// import React, { useEffect, useState, useContext } from 'react';
// import { PaymentElement, LinkAuthenticationElement, useStripe, useElements } from '@stripe/react-stripe-js';
// import { toDollars } from '../lib/';
// import AppContext from '../lib/app-context';
// import { useNavigate } from 'react-router-dom';

// export default function CheckoutForm(props) {
//   const stripe = useStripe();
//   const elements = useElements();
//   const context = useContext(AppContext);
//   const navigate = useNavigate();
//   const { setOrderId } = context;
//   const [email, setEmail] = useState('');
//   const [message, setMessage] = useState(null);
//   // const [loading, handleLoading] = useState(true);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     // handleLoading(false);
//     if (!stripe) {
//       return;
//     }
//     const clientSecret = new URLSearchParams(window.location.search).get(
//       'payment_intent_client_secret'
//     );
//     if (!clientSecret) {
//       return;
//     }
//     stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
//       switch (paymentIntent.status) {
//         case 'succeeded':
//           setMessage('Payment succeeded!');
//           break;
//         case 'processing':
//           setMessage('Your payment is processing.');
//           break;
//         case 'requires_payment_method':
//           setMessage('Your payment was not successful, please try again.');
//           break;
//         default:
//           setMessage('Something went wrong.');
//           break;
//       }
//     });
//   }, [stripe, props]);

//   const handleSubmit = async e => {
//     e.preventDefault();
//     if (!stripe || !elements) {
//       return;
//     }

//     setIsLoading(true);
//     const { error } = await stripe.confirmPayment({
//       elements,
//       confirmParams: {
//         return_url: navigate('/confirmationPage')
//       }
//     });

//     if (error.type === 'card_error' || error.type === 'validation_error') {
//       setMessage(error.message);
//     } else {
//       setMessage('An unexpected error occurred.');
//     }
//     setIsLoading(false);
//   };

//   const paymentElementOptions = {
//     layout: 'tabs'
//   };

//   const { totalAmount } = props;
//   return (
//     <div className="container mt-3">
//       <div className="px-4 mx-2 my-2 border-bot d-flex justify-content-between align-items-center">
//         <h1>Checkout</h1>
//         <h4>{`Total: ${toDollars(totalAmount)}`}</h4>
//       </div>
//       <form id="payment-form" onSubmit={handleSubmit} className="mx-auto mt-4 mb-5">
//         <LinkAuthenticationElement
//             id="link-authentication-element"
//             email={email}
//             onChange={event => setEmail(event.target.value)}
//           />
//         <PaymentElement id="payment-element" options={paymentElementOptions}/>
//         <button className="button-all w-100" disabled={isLoading || !stripe || !elements} id="submit">
//           <span id="button-text">
//             {isLoading ? <div className="spinner" id="spinner" /> : 'Pay now'}
//           </span>
//         </button>
//         {message && <div id="payment-message">{message}</div>}
//       </form>
//     </div>
//   );
// }
