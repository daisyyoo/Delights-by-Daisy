require('dotenv/config');
const pg = require('pg');
const express = require('express');
const jwt = require('jsonwebtoken');
const ClientError = require('./client-error');
const staticMiddleware = require('./static-middleware');
const errorMiddleware = require('./error-middleware');

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();
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

app.post('/myBasket', (req, res, next) => {
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
        const { cartId } = result.rows[0];
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
    const { cookieId, quantity } = req.body;
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
  }
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
