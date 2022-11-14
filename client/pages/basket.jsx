import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { toDollars } from '../lib/';

const styles = {
  image: {
    objectFit: 'contain'
  },
  card: {
    height: '150px'
  },
  title: {
    color: '#422300',
    fontWeight: '600',
    fontFamily: 'Merriweather',
    fontSize: '1.2rem'
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
  weight: {
    color: '#693802',
    fontSize: '0.8rem'
  }
};
export default class Basket extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cookies: []
    };
  }

  componentDidMount() {
    const token = localStorage.getItem('basketToken');
    const req = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token
      }
    };

    fetch('/myBasket', req)
      .then(res => res.json())
      .then(cookies => {
        this.setState({ cookies });
      });
  }

  render() {
    return (
      <>
        <h1 className="py-1" style={styles.header}>My Basket</h1>
        <p className="m-0" style={styles.text}>{`${this.state.cookies.length} items`}</p>
        <div className="d-lg-flex">
          <div className="row">
            {/* if statement if !token and populate a message */}
            {
            this.state.cookies.map((product, index) => (
              <div key={index} className="card-container d-flex basket-border py-3">
                <BasketItems product={product} />
              </div>
            ))
          }
          </div>
          <div className="d-flex flex-column align-items-center my-3" >
            <div className="d-flex w-100 justify-content-between">
              <h4>{`Subtotal (${this.state.cookies.length} items)`}</h4>
              <h4>
                {toDollars(
                  this.state.cookies.reduce((previousCookie, currentCookie) => {
                    return previousCookie + (currentCookie.quantity * currentCookie.price);
                  }, 0))}
              </h4>
            </div>
            <p>Taxes and shipping calculated at checkout</p>
            <Button className="button-all w-75 w-lg-50">PROCEED TO CHECKOUT</Button>
          </div>
        </div>

      </>
    );
  }
}

function BasketItems(props) {
  const { quantity, flavor, weight, price, imageUrl } = props.product;
  // cartId, cookieId
  return (
    <>
      <div className="col-5 d-flex align-items-center">
        <img className="w-100" style={styles.image} src={imageUrl} alt={flavor}/>
      </div>
      <Card className="col-7 border-0">
        <Card.Body>
          <Card.Text className="m-0" style={styles.title}>{flavor}</Card.Text>
          <Card.Text className="m-0" style={styles.weight}>{`${weight} oz`}</Card.Text>
          <Card.Text className="m-0" style={styles.price}>{`${toDollars(price)}`}</Card.Text>
          <Card.Text style={styles.text}>{`Qty: ${quantity}`}</Card.Text>
        </Card.Body>
      </Card>
    </>

  );

}
