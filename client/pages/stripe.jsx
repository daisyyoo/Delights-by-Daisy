import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import CheckoutForm from './checkout-form';
import '../../server/public/stripe.css';

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe('pk_test_51Ly5zQD9hcLXyrLfzzKGfW7VlFhNh5usEvLD2b4yOHnUnobBGxJCh7sJaftQoocfuVGUJOP1XQWhrhIFbA0X53KT00X0pmD4Bs');

export default function StripeCheckout() {
  const [clientSecret, setClientSecret] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    const token = localStorage.getItem('basketToken');
    fetch('/create-payment-intent', {
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
      });
  }, []);

  const appearance = {
    theme: 'stripe'
  };
  const options = {
    clientSecret,
    appearance
  };

  return (
    <div className=" d-flex flex-column justify-content-between flex-lg-row">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise} >
          <CheckoutForm totalAmount={totalAmount} />
        </Elements>
      )}
    </div>
  );
}
