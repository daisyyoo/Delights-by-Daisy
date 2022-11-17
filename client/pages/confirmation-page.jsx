import React from 'react';
import AppContext from '../lib/app-context';
// import { toDollars } from '../lib/';
import Card from 'react-bootstrap/Card';

export default class ConfirmationPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: []
    };
  }

  componentDidMount() {
    const token = localStorage.getItem('basketToken');
    if (!token) {
      return;
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
        // window.localStorage.removeItem('basketToken');
        // checkOut();
      })
      .catch();
  }

  render() {
    if (this.state.order.length === 0) return;

    const { orderId, orderedAt } = this.state.order[0];
    return (
      <>
        <h1 className="py-1">Thank you for your order!</h1>
        <div>
          <p>{`Order No. : 00${orderId}`}</p>
          <p>{`Order Date : ${orderedAt}`}</p>
        </div>
        <div>
          <h3 className="border-bot">Items Ordered</h3>
          <div className="row">
            {
              this.state.order.map(cookie => (
                <div key={cookie.cookieId} className="">
                  <OrderedCookie cookie={cookie} />
                </div>
              ))
            }
          </div>
        </div>
        <div>
          <div>
            <p>Subtotal</p>
            <p>$price</p>
          </div>
          <div>
            <p>Sales Tax</p>
            <p>$moremoney</p>
          </div>
          <div>
            <p>Total </p>
            <p>$lotsofmoney</p>
          </div>
        </div>
      </>
    );
  }
}
ConfirmationPage.contextType = AppContext;

function OrderedCookie() {
  return (
    <Card>
      <Card.Img />
      <Card.Body>
        <Card.Text>Flavor</Card.Text>
        <Card.Text>Price for this cookie order</Card.Text>
        <Card.Text>Quantity</Card.Text>
      </Card.Body>
    </Card>
  );
}
