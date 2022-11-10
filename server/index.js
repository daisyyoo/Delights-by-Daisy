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
        req.cartId = res.json({ token, cartId });
      })
      .catch(err => next(err));
  } else {
    const cartId = jwt.verify(token, process.env.TOKEN_SECRET);
    req.cartId = cartId; // this is the cardId number, not object
    next();
  }
  // the above is to get the cartId to be able to add it to cartItems table
  // the below is adding the items to the cartItems table
  const cartId = req.cartId;
  const { cookieId, quantity } = req.body;
  const sql = `
    insert into "cartItems" ("cartId", "cookieId", "quantity")
    values ($1, $2, $3)
    returning *
  `;
  const params = [cartId, cookieId, quantity];
  db.query(sql, params)
    .then(result => {
      const [cartItem] = result.rows;
      res.status(201).json(cartItem);
    })
    .catch(err => next(err));
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
