import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { toDollars } from '../lib/';

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
  weight: {
    color: '#693802',
    fontSize: '0.8rem'
  },
  subtotalHeader: {
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
  button: {
    fontSize: '1rem'
  },
  noBasket: {
    fontWeight: '600',
    color: '#693802'
  },
  noBasketImg: {
    height: '300px'
  }
};
export default class Basket extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cookies: []
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    const token = localStorage.getItem('basketToken');
    if (token) {
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
        })
        .catch(err => console.error(err));
    }
  }

  handleClick(event) {
    const token = localStorage.getItem('basketToken');
    const cookieId = Number(event.target.closest('p').id);
    const cookieIndex = this.state.cookies.findIndex(cookie => cookie.cookieId === cookieId);
    const { quantity } = this.state.cookies[cookieIndex];
    let newQuantity;
    const currentQuantity = Number(event.target.closest('p').textContent);
    if (event.target.matches('.fa-circle-minus')) {
      if (currentQuantity > 1) {
        newQuantity = quantity - 1;
      } else {
        return;
      }
    } else if (event.target.matches('.fa-circle-plus')) {
      newQuantity = quantity + 1;
    }
    const updatedInfo = { cookieId, quantity: newQuantity };

    const req = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token
      },
      body: JSON.stringify(updatedInfo)
    };
    fetch('/updateQuantity', req)
      .then(res => res.json())
      .then(updatedCookie => {
        const newCookies = this.state.cookies.slice();
        updatedCookie.quantity = newQuantity;
        newCookies[cookieIndex] = updatedCookie;
        this.setState({ cookies: newCookies });
      })
      .catch(err => console.error(err));
  }

  render() {
    return (
      <>
        <h1 className="py-1" >My Basket</h1>
        <p className="m-0" style={styles.text}>{`${this.state.cookies.length} items`}</p>
        {this.state.cookies.length === 0 &&
        <h4 style={styles.noBasket} className="my-5 text-center">
          You have no items in your basket!
          <br />Add cookies to your basket to get started!</h4>}
        <div className="d-lg-flex justify-content-lg-between container">
          {this.state.cookies.length > 0 &&
            <div className="row col-lg-9 mb-3">
              {
              this.state.cookies.map((product, index) => (
                <div key={index} className="d-flex justify-content-lg-start">
                  <BasketItems product={product} handleClick={this.handleClick}/>
                </div>
              ))
            }
            </div>
            }
          {this.state.cookies.length === 0 &&
            <div className="col-lg-12 d-flex justify-content-center">
              <img style={styles.noBasketImg} className="img-fluid my-3" src="/image/lots-of-cookies.jpg" alt="cookies"/>
            </div>
            }
          {this.state.cookies.length > 0 &&
            <div className="col-lg-3" >
              <div className="py-3 d-flex flex-column align-items-center">
                <h4 style={styles.subtotalHeader} className="py-2">Need to grab more cookies for a friend in need?</h4>
                <Button href="#cookies" style={styles.button} className="button-more-cookies" >GET COOKIES</Button>
              </div>
              <div className="d-flex w-100 justify-content-between pt-3 mt-5" style={styles.borderTop}>
                <h5 style={styles.subtotalHeader}>{`Subtotal (${this.state.cookies.length} items)`}</h5>
                <h5 style={styles.subtotalHeader}>
                  {toDollars(
                    this.state.cookies.reduce((previousCookie, currentCookie) => {
                      return previousCookie + (currentCookie.quantity * currentCookie.price);
                    }, 0))}
                </h5>
              </div>
              <div style={styles.borderBottom} className="w-100 pb-4 d-flex flex-column align-items-center">
                <p style={styles.weight} className="w-100 text-left py-lg-2">Taxes and shipping calculated at checkout</p>
                <Button href="#checkout" style={styles.button} className="button-all w-100" >PROCEED TO CHECKOUT</Button>
              </div>
            </div>
            }
        </div>
      </>
    );
  }
}

function BasketItems(props) {
  const { cookieId, quantity, flavor, weight, price, imageUrl } = props.product;
  const { handleClick } = props;
  return (
    <>
      <div style={styles.imageContainer} className="col-5 col-md-3 d-flex align-items-center border-bot">
        <img className="h-100 img-fluid" style={styles.image} src={imageUrl} alt={flavor}/>
      </div>
      <Card className="col-7 col-md-9 card-border" style={styles.card}>
        <Card.Body className="d-flex flex-column flex-lg-row justify-content-center justify-content-lg-between align-items-lg-center">
          <div className="p-0">
            <Card.Text className="m-0" style={styles.title}>{flavor}</Card.Text>
            <Card.Text className="m-0 pt-2" style={styles.weight}>{`${weight} oz`}</Card.Text>
          </div>
          <div className="d-flex flex-column flex-lg-row justify-content-lg-between align-items-lg-center">
            <Card.Text className="m-0 py-2" style={styles.price}>{`${toDollars(price * quantity)}`}</Card.Text>
            <Card.Text id={cookieId} className="mx-lg-3" style={styles.text} value={quantity} onClick={handleClick}>
              <Button className="quantity-button" name="minus">
                <i className="fa-solid fa-circle-minus"/>
              </Button>
              {` ${quantity} `}
              <Button className="quantity-button" name="plus">
                <i className="fa-solid fa-circle-plus"/>
              </Button>
            </Card.Text>
          </div>
        </Card.Body>
      </Card>
    </>
  );
}
