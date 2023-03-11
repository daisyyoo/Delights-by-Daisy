import React, { useEffect, useState, useContext } from 'react';
import { PaymentElement, LinkAuthenticationElement, AddressElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toDollars } from '../lib/';
import AppContext from '../lib/app-context';
import { useNavigate } from 'react-router-dom';

const styles = {
  errorContent: {
    height: '500px'
  }
};

export default function CheckoutForm(props) {
  const stripe = useStripe();
  const elements = useElements();
  const context = useContext(AppContext);
  const navigate = useNavigate();
  const { setOrderId } = context;
  const [paymentIntent, setPaymentIntent] = useState();
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState({});
  const [message, setMessage] = useState(null);
  // const [loading, handleLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // handleLoading(false);
    if (!stripe) {
      return;
    }
    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    );
    if (!clientSecret) {
      return;
    }
    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      setPaymentIntent(paymentIntent);
      switch (paymentIntent.status) {
        case 'succeeded':
          setMessage('Payment succeeded!');
          break;
        case 'processing':
          setMessage('Your payment is processing.');
          break;
        case 'requires_payment_method':
          setMessage('Your payment was not successful, please try again.');
          break;
        default:
          setMessage('Something went wrong.');
          break;
      }
    });
  }, [stripe, props]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setIsLoading(true);

    const token = localStorage.getItem('basketToken');
    const req = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
        body: JSON.stringify(paymentIntent)
      }
    };
    const fetchData = async () => {
      const response = await fetch('/api/getOrderId', req);
      if (response.status === 500) { setError(true); }
      const paidOrder = await response.json();
      const { orderId } = paidOrder;
      setOrderId(orderId);

    };
    fetchData()
      .catch(console.error);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        shipping: address,
        return_url: navigate('/confirmationPage')
      }
    });

    if (error.type === 'card_error' || error.type === 'validation_error') {
      setMessage(error.message);
    } else {
      setMessage('An unexpected error occurred.');
    }
    setIsLoading(false);
  };

  // const paymentElementOptions = {
  //   layout: 'tabs'
  // };

  const { totalAmount } = props;
  return (
    <>

      {error &&
      <div style={styles.errorContent} className="my-5 text-center d-flex flex-column justify-content-center align-items-center">
        <h1 className="w-75">There was an error with the connection. Please try again.</h1>
        <img src="/image/sad-cookie.png" alt="sad-cookie" />
      </div>
        }
      <div className="container mt-3">
        <div className="px-4 mx-2 my-2 border-bot d-flex justify-content-between align-items-center">
          <h1>Checkout</h1>
          <h4>{`Total: ${toDollars(totalAmount)}`}</h4>
        </div>
        <form id="payment-form" onSubmit={handleSubmit} className="mx-auto mt-4 mb-5">
          <h3>Contact Info</h3>
          <LinkAuthenticationElement
            id="link-authentication-element"
            options={{
              email,
              defaultValues: {
                email: 'email@.com'
              }
            }}
            onChange={event => setEmail(event.value.email)}
          />
          <h3>Shipping Address</h3>
          <AddressElement
        options={{
          mode: 'shipping',
          allowedCountries: ['US'],
          blockPoBox: true,
          fields: {
            phone: 'always'
          },
          validation: {
            phone: {
              required: 'never'
            }
          }
        }}
        onChange={event => setAddress(event.value.address)}/>
          <h3>Payment</h3>
          <PaymentElement id="payment-element"
          options={{
            defaultValues: {
              billingDetails: {
                name: 'name',
                phone: '888-888-8888'
              }
            }
          }}/>
          <button className="button-all w-100" disabled={isLoading || !stripe || !elements} id="submit">
            <span id="button-text">
              {isLoading ? <div className="spinner" id="spinner" /> : 'Pay now'}
            </span>
          </button>
          {message && <div id="payment-message">{message}</div>}
        </form>
      </div>
    </>
  );
}
