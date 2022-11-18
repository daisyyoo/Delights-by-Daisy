require('dotenv/config');
const pg = require('pg');
const express = require('express');
const jwt = require('jsonwebtoken');
const ClientError = require('./client-error');
const staticMiddleware = require('./static-middleware');
const errorMiddleware = require('./error-middleware');
const app = express();
const stripe = require('stripe')('sk_test_51Ly5zQD9hcLXyrLfIIebHLiTNOKeO1CELshkDj0vjizFzkrgZ2cnZa8lF2Vf3AmZJQYHJfi454bf68ehAzJExyHe00gMcrQPGO');
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

app.get('/cookies', (req, res, next) => {
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

app.get('/cookies/:cookieId', (req, res, next) => {
  const cookieId = Number(req.params.cookieId);
  if (!cookieId) {
    throw new ClientError(400, 'cookieId must be a positive integer');
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
        throw new ClientError(404, `cannot find cookie with cookieId ${cookieId}`);
      }
      res.json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.post('/addToBasket', (req, res, next) => {
  const token = req.get('x-access-token');
  const { quantity } = req.body;
  const { cookieId } = req.body.cookie;
  if (!token) {
    const sql = `
      insert into "carts"
      default values
      returning *
    `;
    db.query(sql)
      .then(result => {
        const cartId = result.rows[0].cartId;
        const token = jwt.sign(cartId, process.env.TOKEN_SECRET);
        if (!cookieId || !quantity) {
          throw new ClientError(400, 'cookieId and quantity are required fields');
        }
        const sql = `
          insert into "cartItems" ("cartId", "cookieId", "quantity")
          values ($1, $2, $3)
          returning *
        `;
        const params = [cartId, cookieId, quantity];
        db.query(sql, params)
          .then(result => {
            const [cartItem] = result.rows;
            const user = { cartId, token, cartItem };
            res.status(201).json(user);
          })
          .catch(err => next(err));
      })
      .catch(err => next(err));
  } else {
    const cartId = jwt.verify(token, process.env.TOKEN_SECRET);
    if (!cookieId || !quantity) {
      throw new ClientError(400, 'cookieId and quantity are required fields');
    }

    const sql = `
      insert into "cartItems" ("cartId", "cookieId", "quantity")
      values ($1, $2, $3)
      on conflict ("cartId", "cookieId")
      do update
            set "quantity" = "cartItems"."quantity" + "excluded"."quantity"
      returning *
      `;
    const params = [cartId, cookieId, quantity];
    db.query(sql, params)
      .then(result => {
        const [cartItem] = result.rows;
        const user = { cartId, token, cartItem };
        res.status(201).json(user);
      })
      .catch(err => next(err));
  }
});

app.get('/myBasket', (req, res, next) => {
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
          throw new ClientError(404, `cannot find basket with cartId ${cartId}`);
        }
        res.json(result.rows);
      })
      .catch(err => next(err));
  }
});

app.post('/create-payment-intent', async (req, res, next) => {
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
        throw new ClientError(404, `cannot find basket with cartId ${cartId}`);
      }
      const cookiesArray = result.rows;

      const calculateOrderAmount = (
        cookiesArray.reduce((previousCookie, currentCookie) => {
          return previousCookie + (currentCookie.quantity * currentCookie.price);
        }, 0));

      stripe.paymentIntents.create({
        amount: calculateOrderAmount,
        currency: 'usd',
        payment_method_types: ['card']
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
      res.redirect(302, '/#confirmationPage');
    })
    .catch(err => next(err));
});

app.post('/confirmationPage', (req, res, next) => {
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

app.post('/sendEmail', (req, res, next) => {
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
              "cartItems"."quantity",
              "cookies"."flavor",
              "cookies"."price"
        from "orders"
        join "cartItems" using ("cartId")
        join "cookies" using ("cookieId")
        where "cartId" = $1
      `;
      const params = [cartId];
      db.query(sql, params)
        .then(result => {
          // const orderDetails = result.rows;
          // console.log('1', orderDetails);
          // const msg = {
          //   to: email,
          //   from: 'Daisy@delightsbydaisy.de',
          //   subject: 'Sending with SendGrid is Fun',
          //   text: 'and easy to do anywhere, even with Node.js',
          //   html: '<strong>and easy to do anywhere, even with Node.js</strong>'
          // };
          // sgMail
          //   .send(msg)
          //   .then(() => {
          //     console.log('Email sent');
          //   })
          //   .catch(error => {
          //     console.error(error);
          //   });
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));

});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
