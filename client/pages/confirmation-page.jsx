import React from 'react';
import AppContext from '../lib/app-context';
import { toDollars } from '../lib/';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

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
  }
};

export default class ConfirmationPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: [],
      salesTax: 0,
      email: '',
      emailSent: false,
      loading: true,
      error: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.sendEmail = this.sendEmail.bind(this);
  }

  componentDidMount() {
    const token = localStorage.getItem('basketToken');
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token
      }
    };
    fetch('/confirmationPage', req)
      .then(res => {
        if (res.status === 500) {
          this.setState({ error: true });
        }
        return res.json();
      })
      .then(order => {
        this.setState({ loading: false });
        this.setState({ order });
        this.setState({ salesTax: 0 });
      })
      .catch(err => console.error(err));
  }

  handleChange(event) {
    const { value } = event.target;
    this.setState({ email: value });
  }

  sendEmail(event) {
    event.preventDefault();
    this.setState({ loading: true });
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    };
    fetch('./sendEmail', req)
      .then(res => {
        if (res.status === 500) {
          this.setState({ error: true });
        }
        return res.json();
      })
      .then(response => {
        this.setState({ loading: false });
        this.setState({ emailSent: true });
        this.setState({ email: '' });
        const { checkOut } = this.context;
        checkOut();
      })
      .catch(err => console.error(err));
  }

  render() {
    if (this.state.error) {
      return (
        <div style={styles.errorContent} className="my-5 text-center d-flex flex-column justify-content-center align-items-center">
          <h1 className="w-75">There was an error with the connection. Please try again.</h1>
          <img src="/image/sad-cookie.png" alt="sad-cookie" />
        </div>
      );
    }
    const { loading } = this.state;
    if (this.state.order.length === 0) {
      return <div className="loader d-flex justify-content-center align-items-center" />;
    }
    const { orderId, orderedAt } = this.state.order[0];
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
            <p className="m-0" style={styles.orderInfo}>{`Order No. : 00${orderId}`}</p>
            <p className="m-0" style={styles.orderInfo}>{`Order Date : ${orderedAt.slice(0, 10)}`}</p>
          </div>
          <div className="row">
            <div className="col-lg-9 mb-2">
              <h4 style={styles.header} className="border-bot m-0 pb-2">Items Ordered</h4>
              <div>
                {
              this.state.order.map((cookie, index) => (
                <div key={index} className="d-flex justify-content-lg-start border-bot">
                  <OrderedCookie cookie={cookie} />
                </div>
              ))
            }
              </div>
            </div>
            <div className="col-lg-3 pt-lg-3 mt-4">
              <div style={styles.borderTop} className="d-flex justify-content-between pt-1">
                <p className="m-1" style={styles.subtotalHeader}>{`Subtotal (${this.state.order.length} items) `}</p>
                <p className="m-1" style={styles.subtotalHeader}>
                  {toDollars(
                    this.state.order.reduce((previousCookie, currentCookie) => {
                      return previousCookie + (currentCookie.quantity * currentCookie.price);
                    }, 0))}</p>
              </div>
              <div className="d-flex justify-content-between pb-lg-4">
                <p className="m-1" style={styles.subtotalHeader}>Sales Tax</p>
                <p className="m-1" style={styles.subtotalHeader}>{toDollars(this.state.salesTax)}</p>
              </div>
              <div style={styles.borderBottom} className="d-flex justify-content-between pb-1">
                <p className="m-1" style={styles.total}>Total Paid</p>
                <p className="m-1" style={styles.total}>
                  {toDollars((this.state.order.reduce((previousCookie, currentCookie) => {
                    return previousCookie + (currentCookie.quantity * currentCookie.price);
                  }, 0)) + this.state.salesTax)}</p>
              </div>
            </div>
          </div>
          <div className="row mb-3">
            <form className="mt-4 py-0 col-12 col-lg-9 w-lg-75 shadow-none d-flex flex-column" onSubmit={this.sendEmail}>
              <label style={styles.header}>Would you like a confirmation email?</label>
              <input
            autoFocus
            type="text"
            onChange={this.handleChange}
            value={this.state.email}
            placeholder="type email here"
            className="mb-2 mt-1 email-input p-2 px-3"
            />
              <div className="d-flex justify-content-between">
                <div className="px-2">
                  <p style={styles.orderInfo} className={this.state.emailSent ? 'show' : 'd-none'}>
                    Your confirmation email has been sent!</p>
                </div>
                <button type="submit" className="button-all submit-button">SEND</button>
              </div>
            </form>
            <div className="d-flex justify-content-center mt-5 pt-3">
              <Button href=" " className={this.state.emailSent ? 'button-all' : 'd-none'}>RETURN TO HOME</Button>
            </div>
          </div>
        </div>
      </>
    );
  }
}
ConfirmationPage.contextType = AppContext;

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
