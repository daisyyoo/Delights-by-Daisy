# Delights By Daisy

A full stack web application where you can order cookies baked by me

## Why I Built This

I wanted to build an e-commerce website for my cookie side business in my personal style and design.

## Technologies Used

- React.js
- Webpack
- Bootstrap 5
- Node.js
- HTML5
- CSS3
- Stripe API [https://stripe.com/docs](https://stripe.com/docs)
- SendGrid API [https://docs.sendgrid.com/](https://docs.sendgrid.com/)

## Live Demo

Try the application live at [https://delights-by-daisy.delightsbydaisy.de/](https://delights-by-daisy.delightsbydaisy.de/)

## Features

- User can view all items
- User can view a specific item
- User can add an item into basket
- User can view basket
- User can edit the quantity of item in basket
- User can remove item in basket
- User can place an order
- User can view confirmation page
- User can opt to receive a confirmation email
- User can view the About Me page

## Preview

[Delights Demo 1](image/delights-demo-1.gif)
[Delights Demo 3](image/delights-demo-3.gif)
## Stretch Features
- User can add allergy notes to their order

### System Requirements

- Node.js 10 or higher
- NPM 6 or higher
- PostgreSQL 14.6 or higher

### Getting Started

1. Clone the repository.

    ```shell
    git clone https://github.com/daisyyoo/delights-by-daisy
    cd delights-by-daisy
    ```

1. Make a copy of .env.example.

    ```shell
    cp .env.example .env
    ```

1. Create an API key with Stripe and put both testing keys in .env under STRIPE_API_KEY and STRIPE_API_SERVER_KEY respectively.

1. Create an API key with SendGrid and put in .env under SENDGRID_API_KEY.

1. Install all dependencies with NPM.

    ```shell
    npm install
    ```

1. Make sure postgresql is running

    ```shell
    sudo service postgresql start
    ```

1. Create a new database in postgreSQL

    ```shell
    createdb newDatabaseName
    ```

1. Import the schema.

    ```shell
    npm run db:import
    ```

1. Start pgweb in new terminal.

    ```shell
    pgweb --db=newDatabaseName
    ```

1. Open a browser tab to http://localhost:8081 to view database.

1. Start the project. Once started, you can view the application by opening http://localhost:3000 in your browser. Have fun!

    ```shell
    npm run dev
    ```
