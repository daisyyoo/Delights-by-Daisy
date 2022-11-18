import React from 'react';
import AppContext from '../lib/app-context';
import { toDollars } from '../lib/';
import Card from 'react-bootstrap/Card';
import Redirect from '../components/redirect';

const styles = {
  image: {
    objectFit: 'contain'
  },
  imageContainer: {
    height: '200px'
  },
  card: {
    height: '200px'
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
  }
};

export default class ConfirmationPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: [],
      salesTax: 0,
      email: null,
      emailSent: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.sendEmail = this.sendEmail.bind(this);
  }

  componentDidMount() {
    const token = localStorage.getItem('basketToken');
    if (!token) {
      return <Redirect to=""/>;
    }
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token
      }
    };
    fetch('/confirmationPage', req)
      .then(res => res.json())
      .then(order => {
        // const { checkOut } = this.context;
        this.setState({ order });
        // checkOut();
      })
      .catch();
    this.setState({ salesTax: 100 });
  }

  handleChange(event) {
    const { value } = event.target;
    this.setState({ email: value });
  }

  sendEmail(event) {
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: this.state.email
    };
    fetch('./sendEmail', req)
      .then(res => res.json())
      .then(response => {
        // setState for successful email sent, true or false, and have it affect the message shown if it's successful or not
      })
      .catch();
  }

  render() {
    if (this.state.order.length === 0) return;

    const { orderId, orderedAt } = this.state.order[0];
    return (
      <>
        <h1 className="py-1">Thank you for your order!</h1>
        <div className="mb-3">
          <p className="m-0" style={styles.orderInfo}>{`Order No. : 00${orderId}`}</p>
          <p className="m-0" style={styles.orderInfo}>{`Order Date : ${orderedAt.slice(0, 10)}`}</p>
        </div>
        <div className="row">
          <div className="col-lg-9">
            <h3 style={styles.header} className="border-bot m-0 pb-2">Items Ordered</h3>
            <div>
              {
              this.state.order.map(cookie => (
                <div key={cookie.cookieId} className="d-flex justify-content-lg-start border-bot">
                  <OrderedCookie cookie={cookie} />
                </div>
              ))
            }
            </div>
          </div>
          <div className="col-lg-3 mt-5">
            <div style={styles.borderTop} className="d-flex justify-content-between pt-1">
              <p className="m-1" style={styles.subtotalHeader}>{`Subtotal (${this.state.order.length} items) `}</p>
              <p className="m-1" style={styles.subtotalHeader}>
                {toDollars(
                  this.state.order.reduce((previousCookie, currentCookie) => {
                    return previousCookie + (currentCookie.quantity * currentCookie.price);
                  }, 0))}</p>
            </div>
            <div className="d-flex justify-content-between pb-lg-4">
              <p className="m-1">Sales Tax</p>
              <p className="m-1">{toDollars(this.state.salesTax)}</p>
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
        <form onSubmit={this.sendEmail}>
          <input
            autoFocus
            type="text"
            onChange={this.handleChange}
            placeholder="Type email here for confirmation email"
            className="w-100"
          />
          <button type="submit" className="button-all">Send Email</button>
        </form>
      </>
    );
  }
}
ConfirmationPage.contextType = AppContext;

function OrderedCookie(props) {
  const { flavor, quantity, price, imageUrl } = props.cookie;
  return (
    <>
      <div className="col-5 col-md-3 d-flex align-items-center py-lg-2" style={styles.imageContainer}>
        <img className="h-100 img-fluid" style={styles.image} src={imageUrl} alt={flavor} />
      </div>
      <Card className="col-7 col-md-9 border-0" style={styles.card}>
        <Card.Body className="d-flex flex-column justify-content-center">
          <Card.Text style={styles.title}>{flavor}</Card.Text>
          <Card.Text style={styles.price}>{ toDollars(price * quantity) }</Card.Text>
          <Card.Text style={styles.text}>{`Qty : ${quantity} `}</Card.Text>
        </Card.Body>
      </Card>
    </>
  );
}
