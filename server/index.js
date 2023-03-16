require('dotenv/config');
const pg = require('pg');
const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const ClientError = require('./client-error');
const staticMiddleware = require('./static-middleware');
const errorMiddleware = require('./error-middleware');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_API_SERVER_KEY);
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(express.json());
app.use(staticMiddleware);

app.get('/api/cookies', async (req, res, next) => {
  const sql = `
  select "cookieId",
        "flavor",
        "price",
        "imageUrl"
    from "cookies"
  `;

  db.query(sql)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => next(err));

});

app.get('/api/cookies/:cookieId', async (req, res, next) => {
  const cookieId = Number(req.params.cookieId);
  if (!cookieId) {
    next(new ClientError(400, 'cookieId must be a positive integer'));
  }
  const sql = `
    select *
    from "cookies"
    where "cookieId" = $1
  `;
  const params = [cookieId];
  db.query(sql, params)
    .then(result => {
      if (!result.rows[0]) {
        next(new ClientError(404, `cannot find cookie with cookieId ${cookieId}`));
      }
      res.json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.post('/api/addToBasket', async (req, res, next) => {
  let token = req.get('x-access-token');
  const { quantity } = req.body;
  const { cookieId } = req.body.cookie;
  if (!cookieId || !quantity) {
    next(new ClientError(400, 'cookieId and quantity are required fields'));
  }
  try {
    if (!token) {
      const sql = `
        insert into "carts"
        default values
        returning *
      `;
      const result = await db.query(sql);
      const cartId = result.rows[0].cartId;
      token = await jwt.sign(cartId, process.env.TOKEN_SECRET);
    } else {
      const cartId = jwt.verify(token, process.env.TOKEN_SECRET);

      const sql = `
        insert into "cartItems" ("cartId", "cookieId", "quantity")
        values ($1, $2, $3)
        on conflict ("cartId", "cookieId")
        do update
              set "quantity" = "cartItems"."quantity" + "excluded"."quantity"
        returning *
        `;
      const params = [cartId, cookieId, quantity];
      const result3 = await db.query(sql, params);
      const [cartItem] = result3.rows;
      const user = { cartId, token, cartItem };
      res.status(201).json(user);
    }
  } catch (err) { return next(err); }
}
);

app.get('/api/myBasket', async (req, res, next) => {
  const token = req.get('x-access-token');
  if (!token) {
    next();
  } else {
    const cartId = jwt.verify(token, process.env.TOKEN_SECRET);
    const sql = `
      select "cartItems"."cartId",
            "cartItems"."cookieId",
            "cartItems"."quantity",
            "cookies"."flavor",
            "cookies"."weight",
            "cookies"."price",
            "cookies"."imageUrl"
      from "cartItems"
      join "cookies" using ("cookieId")
      where "cartId" = $1
    `;
    const params = [cartId];
    db.query(sql, params)
      .then(result => {
        if (!result.rows) {
          next(new ClientError(404, `cannot find basket with cartId ${cartId}`));
        }
        res.json(result.rows);
      })
      .catch(err => next(err));
  }
});

app.post('/api/create-payment-intent', async (req, res, next) => {
  const token = req.get('x-access-token');
  const cartId = jwt.verify(token, process.env.TOKEN_SECRET);
  const sql = `
        select "cartItems"."cartId",
              "cartItems"."cookieId",
              "cartItems"."quantity",
              "cookies"."price"
        from "cartItems"
        join "cookies" using ("cookieId")
        where "cartId" = $1
      `;
  const params = [cartId];
  db.query(sql, params)
    .then(result => {
      if (!result.rows) {
        next(new ClientError(404, `cannot find basket with cartId ${cartId}`));
      }
      const cookiesArray = result.rows;

      const calculateOrderAmount = (
        cookiesArray.reduce((previousCookie, currentCookie) => {
          return previousCookie + (currentCookie.quantity * currentCookie.price);
        }, 0));

      stripe.paymentIntents.create({
        amount: calculateOrderAmount,
        currency: 'usd',
        payment_method_types: ['link', 'card']
      })
        .then(paymentIntent => {
          res.send({
            clientSecret: paymentIntent.client_secret,
            totalAmount: paymentIntent.amount
          });
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

app.get('/process-order/:token', (req, res, next) => {
  const token = req.params.token;
  const cartId = jwt.verify(token, process.env.TOKEN_SECRET);
  const paymentIntent = req.query.payment_intent;
  const sql = `
    insert into "orders" ("cartId", "orderedAt", "paymentIntent")
    values ($1, now(), $2)
    returning *
  `;
  const params = [cartId, paymentIntent];
  db.query(sql, params)
    .then(result => {
      res.redirect(302, '/confirmationPage');
    })
    .catch(err => next(err));
});

app.get('/api/confirmationPage', async (req, res, next) => {
  const token = req.get('x-access-token');
  const cartId = jwt.verify(token, process.env.TOKEN_SECRET);
  const sql = `
    select "orders"."orderId",
          "orders"."orderedAt",
          "cartItems"."quantity",
          "cookies"."flavor",
          "cookies"."price",
          "cookies"."imageUrl"
    from "orders"
    join "cartItems" using ("cartId")
    join "cookies" using ("cookieId")
    where "cartId" = $1
  `;
  const params = [cartId];
  db.query(sql, params)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => next(err));
});

app.post('/api/sendEmail', async (req, res, next) => {
  const { email } = req.body;
  const { orderId } = req.body.order[0];
  const sql = `
    update "orders"
      set "email" = $1,
          "confirmedAt" = now()
      where "orderId" = $2
      returning *
  `;
  const params = [email, orderId];
  db.query(sql, params)
    .then(result => {
      const orderInfo = result.rows[0];
      const { cartId } = orderInfo;
      const sql = `
        select "orders"."orderId",
              "orders"."orderedAt",
              "orders"."email",
              "cartItems"."quantity",
              "cookies"."flavor",
              "cookies"."price"
        from "orders"
        join "cartItems" using ("cartId")
        join "cookies" using ("cookieId")
        where "cartId" = $1
      `;
      const params = [cartId];
      return db.query(sql, params);
    })
    .then(result => {
      const orderDetails = result.rows;
      const { orderId, email, orderedAt } = orderDetails[0];
      const msg = {
        to: email,
        from: 'Daisy@delightsbydaisy.de',
        subject: 'Order Confirmation',
        text: `
            Order Details # 00${orderId}
            Order Date: ${orderedAt}
            ${(orderDetails.map(cookie => (cookie.flavor + 'Qty: ' + cookie.quantity)).join(''))}
            Total:
            ${orderDetails.reduce((previousCookie, currentCookie) => {
              return previousCookie + (currentCookie.quantity * currentCookie.price);
            }, 0)}
            `,
        html: `
            <br><h2>Order Details # 00${orderId}</h2>
            <br><strong>Order Date:</strong> ${orderedAt} <br>
            ${(orderDetails.map(cookie => ('<br><strong>Flavor: </strong>' + cookie.flavor + '<br><strong>Qty: </strong>' + cookie.quantity + '<br>')).join(''))}
            <br><strong>Total:</strong> $
            ${(orderDetails.reduce((previousCookie, currentCookie) => {
            return previousCookie + (currentCookie.quantity * currentCookie.price);
          }, 0) / 100).toFixed(2)}
            <br><h3><em>Thank you for your purchase!</em></h3>`
      };
      return sgMail.send(msg);
    })
    .then(() => res.send())
    .catch(err => next(err));
});

app.patch('/api/updateQuantity', async (req, res, next) => {
  const token = req.get('x-access-token');
  const cartId = jwt.verify(token, process.env.TOKEN_SECRET);
  const { updatedQuantity, cookieId } = req.body;
  if (!Number.isInteger(cookieId) || cookieId < 1) {
    next(new ClientError(400, 'cookieId must be a positive integer'));
  }
  if (!Number.isInteger(updatedQuantity) || updatedQuantity < 0) {
    next(new ClientError(400, 'quantity must be zero or a greater integer'));
  }
  if (updatedQuantity === 0) {
    const sql = `
    delete from "cartItems"
    where "cartId" = $1
      and "cookieId" = $2
    returning *
  `;
    const params = [cartId, cookieId];
    db.query(sql, params)
      .then(result => {
        if (!result.rows) {
          next(new ClientError(404, `cannot find basket with cartId ${cartId}`));
        }
        const [deletedCookie] = result.rows;
        res.json(deletedCookie);
      })
      .catch(err => next(err));
  }
  const sql = `
    update "cartItems"
      set "quantity" = $1
      where "cartId" = $2
      and "cookieId" = $3
      returning *
  `;
  const params = [updatedQuantity, cartId, cookieId];
  db.query(sql, params)
    .then(result => {
      if (!result.rows) {
        next(new ClientError(404, `cannot find basket with cartId ${cartId}`));
      }
      const [updatedCookie] = result.rows;
      res.json(updatedCookie);
    })
    .catch(err => next(err));
});

app.delete('/api/removeCookie/:cookieId', async (req, res, next) => {
  const token = req.get('x-access-token');
  const cartId = jwt.verify(token, process.env.TOKEN_SECRET);
  const cookieId = req.params.cookieId;
  if (!cookieId) {
    next(new ClientError(400, 'cookieId must be a positive integer'));
  }
  const sql = `
    delete from "cartItems"
    where "cartId" = $1
      and "cookieId" = $2
    returning *
  `;
  const params = [cartId, cookieId];
  db.query(sql, params)
    .then(result => {
      if (!result.rows) {
        next(new ClientError(404, `cannot find basket with cartId ${cartId}`));
      }
      const sql = `
      select "cartItems"."cartId",
            "cartItems"."cookieId",
            "cartItems"."quantity",
            "cookies"."flavor",
            "cookies"."weight",
            "cookies"."price",
            "cookies"."imageUrl"
      from "cartItems"
      join "cookies" using ("cookieId")
      where "cartId" = $1
    `;
      const params = [cartId];
      return db.query(sql, params);
    })
    .then(result => {
      if (!result.rows) {
        next(new ClientError(404, `cannot find basket with cartId ${cartId}`));
      }
      res.json(result.rows);
    })
    .catch(err => next(err));
});

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'), function (err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
