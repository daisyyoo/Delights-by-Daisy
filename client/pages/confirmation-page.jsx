import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
// import AppContext from '../lib/app-context';
import { toDollars } from '../lib/';
import Card from 'react-bootstrap/Card';
import AppContext from '../lib/app-context';

const styles = {
  image: {
    objectFit: 'cover',
    borderRadius: '5px'
  },
  imageContainer: {
    height: '150px'
  },
  card: {
    height: '150px'
  },
  header: {
    color: '#422300',
    fontFamily: 'Merriweather'
  },
  title: {
    color: '#422300',
    fontWeight: '600',
    fontFamily: 'Merriweather',
    fontSize: '1.1rem'
  },
  text: {
    color: '#422300',
    fontSize: '1rem'
  },
  price: {
    color: '#693802',
    fontWeight: '600',
    fontSize: '1rem'
  },
  orderInfo: {
    color: '#693802',
    fontSize: '0.8rem'
  },
  subtotalHeader: {
    fontSize: '1rem',
    color: '#693802'
  },
  total: {
    fontWeight: '600',
    fontSize: '1rem',
    color: '#693802'
  },
  borderTop: {
    borderTop: 'solid 2px #94540F'
  },
  borderBottom: {
    borderBottom: 'solid 2px #94540F'
  },
  errorContent: {
    height: '500px'
  },
  button: {
    fontSize: '1rem'
  }
};

export default function ConfirmationPage() {
  const [order, setOrder] = useState([]);
  const [salesTax, setSalesTax] = useState(0);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const context = useContext(AppContext);

  useEffect(() => {
    const token = localStorage.getItem('basketToken');
    const req = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token
      }
    };
    const fetchData = async () => {
      const response = await fetch('/api/confirmationPage', req);
      if (response.status === 500) { setError(true); }
      const order = await response.json();
      setOrder(order);
      setSalesTax(0);
      setLoading(false);
    };
    fetchData()
      .catch(console.error);

  }, []);

  const sendEmail = async event => {
    event.preventDefault();
    const emailInfo = { order, email };
    setLoading(true);
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailInfo)
    };
    const fetchData = async () => {
      const response = await fetch('/api/sendEmail', req);
      if (response.status === 500) { setError(true); }
      if (response.status === 200) {
        const { checkOut } = context;
        checkOut();
      }
      setLoading(false);
      setEmailSent(true);
      setEmail('');
      // const emailSent = await response.json();
      // console.log('hello', emailSent);

    };
    fetchData()
      .catch(console.error);
  };

  if (error) {
    return (
      <div style={styles.errorContent} className="my-5 text-center d-flex flex-column justify-content-center align-items-center">
        <h1 className="w-75">There was an error with the connection. Please try again.</h1>
        <img src="/image/sad-cookie.png" alt="sad-cookie" />
      </div>
    );
  }

  if (order.length === 0) {
    return <div className="loader d-flex justify-content-center align-items-center" />;
  }

  return (
    <>
      {loading === true &&
      <div className="loader d-flex justify-content-center align-items-center" />
        }
      {loading === false &&
      <div className="loader-hide" />
        }
      <div className="container mt-3">
        <h1 className="py-1">Thank you for your order!</h1>
        <div className="mb-3">
          <p className="m-0" style={styles.orderInfo}>{`Order No. : 00${order[0].orderId}`}</p>
          <p className="m-0" style={styles.orderInfo}>{`Order Date : ${order[0].orderedAt.slice(0, 10)}`}</p>
        </div>
        <div className="row">
          <div className="col-lg-9 mb-2">
            <h4 style={styles.header} className="border-bot m-0 pb-2">Items Ordered</h4>
            <div>
              {
              order.map((cookie, index) => (
                <div key={index} className="d-flex justify-content-lg-start border-bot">
                  <OrderedCookie cookie={cookie} />
                </div>
              ))
            }
            </div>
          </div>
          <div className="col-lg-3 pt-lg-3 mt-4">
            <div style={styles.borderTop} className="d-flex justify-content-between pt-1">
              <p className="m-1" style={styles.subtotalHeader}>{`Subtotal (${order.length} items) `}</p>
              <p className="m-1" style={styles.subtotalHeader}>
                {toDollars(
                  order.reduce((previousCookie, currentCookie) => {
                    return previousCookie + (currentCookie.quantity * currentCookie.price);
                  }, 0))}</p>
            </div>
            <div className="d-flex justify-content-between pb-lg-4">
              <p className="m-1" style={styles.subtotalHeader}>Sales Tax</p>
              <p className="m-1" style={styles.subtotalHeader}>{toDollars(salesTax)}</p>
            </div>
            <div style={styles.borderBottom} className="d-flex justify-content-between pb-1">
              <p className="m-1" style={styles.total}>Total Paid</p>
              <p className="m-1" style={styles.total}>
                {toDollars((order.reduce((previousCookie, currentCookie) => {
                  return previousCookie + (currentCookie.quantity * currentCookie.price);
                }, 0)) + salesTax)}</p>
            </div>
          </div>
        </div>
        <div className="row mb-3">
          <form className="mt-4 py-0 col-12 col-lg-9 w-lg-75 shadow-none d-flex flex-column" onSubmit={sendEmail}>
            <label style={styles.header}>Would you like a confirmation email?</label>
            <input
            autoFocus
            type="text"
            onChange={event => { setEmail(event.target.value); }}
            value={email}
            placeholder="type email here"
            className="mb-2 mt-1 email-input p-2 px-3"
            />
            <div className="d-flex justify-content-between">
              <div className="px-2">
                <p style={styles.orderInfo} className={emailSent ? 'show' : 'd-none'}>
                  Your confirmation email has been sent!</p>
              </div>
              <button type="submit" className="button-all submit-button">SEND</button>
            </div>
          </form>
          <div className="d-flex justify-content-center mt-5 pt-3">
            <Link to="/" style={styles.button} className={emailSent ? 'button-all w-100 text-center' : 'd-none'}
              onClick={event => { window.localStorage.removeItem('paidStatus'); }}>RETURN TO HOME</Link>
          </div>
        </div>
      </div>
    </>
  );
}

function OrderedCookie(props) {
  const { flavor, quantity, price, imageUrl } = props.cookie;
  return (
    <>
      <div className="col-5 col-md-3 d-flex align-items-center py-2" style={styles.imageContainer}>
        <img className="h-100 w-100 img-fluid" style={styles.image} src={imageUrl} alt={flavor} />
      </div>
      <Card className="col-7 col-md-9 border-0 bg-transparent" style={styles.card}>
        <Card.Body className="d-flex flex-column justify-content-around">
          <Card.Text className="m-0" style={styles.title}>{flavor}</Card.Text>
          <Card.Text className="m-0" style={styles.price}>{ toDollars(price * quantity) }</Card.Text>
          <Card.Text className="m-0" style={styles.text}>{`Qty : ${quantity} `}</Card.Text>
        </Card.Body>
      </Card>
    </>
  );
}
