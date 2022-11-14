import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { toDollars } from '../lib/';

const styles = {
  image: {
    objectFit: 'contain'
  },
  imageContainer: {
    height: '180px'
  },
  card: {
    height: '180px'
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
  },
  subtotalHeader: {
    fontWeight: '600',
    fontSize: '1rem'
  },
  subtotalText: {
    color: '#693802',
    fontSize: '0.8rem'
  },
  borderTop: {
    borderTop: 'solid 2px #94540F'
  },
  borderBottom: {
    borderBottom: 'solid 2px #94540F'
  },
  button: {
    fontSize: '1rem'
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
        <div className="d-lg-flex justify-content-lg-between container">
          <div className="row col-lg-8">
            {/* if statement if !token and populate a message */}
            {
            this.state.cookies.map((product, index) => (
              <div key={index} className="d-flex py-lg-3 justify-content-lg-start">
                <BasketItems product={product} />
              </div>
            ))
          }
          </div>
          <div className="py-3 col-lg-3" >
            <div className="d-flex w-100 justify-content-between pt-3" style={styles.borderTop}>
              <h5 style={styles.subtotalHeader}>{`Subtotal (${this.state.cookies.length} items)`}</h5>
              <h5 style={styles.subtotalHeader}>
                {toDollars(
                  this.state.cookies.reduce((previousCookie, currentCookie) => {
                    return previousCookie + (currentCookie.quantity * currentCookie.price);
                  }, 0))}
              </h5>
            </div>
            <div style={styles.borderBottom} className="w-100 pb-4 d-flex flex-column align-items-center">
              <p style={styles.subtotalText} className="w-100 text-left py-lg-2">Taxes and shipping calculated at checkout</p>
              <Button style={styles.button} className="button-all w-100" >PROCEED TO CHECKOUT</Button>
            </div>
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
      <div style={styles.imageContainer} className="col-5 d-flex align-items-center basket-border">
        <img className="h-100 img-fluid rounded" style={styles.image} src={imageUrl} alt={flavor}/>
      </div>
      <Card className="col-7 card-border" style={styles.card}>
        <Card.Body className="d-flex flex-column justify-content-between">
          <Card.Text className="m-0" style={styles.title}>{flavor}</Card.Text>
          <Card.Text className="m-0" style={styles.weight}>{`${weight} oz`}</Card.Text>
          <Card.Text className="m-0" style={styles.price}>{`${toDollars(price)}`}</Card.Text>
          <Card.Text style={styles.text}>{`Qty: ${quantity}`}</Card.Text>
        </Card.Body>
      </Card>
    </>

  );

}
