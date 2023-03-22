import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import CheckoutForm from './checkout-form';
import '../../server/public/stripe.css';

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(process.env.STRIPE_API_KEY);

export default function StripeCheckout() {
  const [clientSecret, setClientSecret] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    const token = localStorage.getItem('basketToken');
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token
      }
    })
      .then(res => res.json())
      .then(data => {
        setClientSecret(data.clientSecret);
        setTotalAmount(data.totalAmount);
      })
      .catch(console.error);
  }, []);

  const appearance = {
    theme: 'stripe'
  };
  const options = {
    clientSecret,
    appearance
  };

  return (
    <div className="container mt-3 d-flex flex-column  flex-grow-1">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise} >
          <CheckoutForm totalAmount={totalAmount} />
        </Elements>
      )}
    </div>
  );
}
