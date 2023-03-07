import React from 'react';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { toDollars } from '../lib/';

const styles = {
  image: {
    objectFit: 'cover',
    borderRadius: '5px'
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
  noBasketText: {
    position: 'relative',
    fontFamily: 'Merriweather',
    top: '3rem',
    lineHeight: '2.2rem',
    fontSize: '1.7rem',
    fontWeight: '600',
    color: '#693802'
  },
  noBasketSmText: {
    position: 'relative',
    top: '3rem',
    lineHeight: '2.2rem',
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#693802'
  },
  noBasketButton: {
    position: 'relative',
    top: '3rem',
    fontSize: '1rem'
  },
  noBasketImg: {
    backgroundImage: 'url("/image/lots-of-cookies-sm.webp")',
    backgroundSize: 'cover',
    backgroundPosition: '45%',
    width: '100%',
    height: '100%'
  },
  remove: {
    cursor: 'pointer',
    color: '#693802',
    fontSize: '0.8rem',
    textDecoration: 'underline'
  },
  errorContent: {
    height: '500px'
  }
};
export default class Basket extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cookies: [],
      loading: true,
      error: false
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }

  componentDidMount() {
    const token = localStorage.getItem('basketToken');
    if (!token) {
      this.setState({ loading: false });
    }
    if (token) {
      const req = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        }
      };

      fetch('/myBasket', req)
        .then(res => {
          if (res.status === 500) {
            this.setState({ error: true });
          }
          return res.json();
        })
        .then(cookies => {
          this.setState({ loading: false });
          this.setState({ cookies });
        })
        .catch(err => console.error(err));
    }
  }

  handleClick(event) {
    this.setState({ loading: true });
    const token = localStorage.getItem('basketToken');
    const cookieId = Number(event.target.closest('div').id);
    const cookieIndex = this.state.cookies.findIndex(cookie => cookie.cookieId === cookieId);
    const { quantity } = this.state.cookies[cookieIndex];
    let newQuantity;
    const currentQuantity = Number(event.target.closest('div').textContent);

    if (event.target.matches('.fa-circle-minus')) {
      if (currentQuantity > 1) {
        newQuantity = quantity - 1;
      } else {
        return;
      }
    } else if (event.target.matches('.fa-circle-plus')) {
      newQuantity = quantity + 1;
    } else {
      return;
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
      .then(res => {
        if (res.status === 500) {
          this.setState({ error: true });
        }
        return res.json();
      })
      .then(updatedCookie => {
        this.setState({ loading: false });
        const newCookies = this.state.cookies.slice();
        updatedCookie.quantity = newQuantity;
        newCookies[cookieIndex] = updatedCookie;
        this.setState({ cookies: newCookies });
      })
      .catch(err => console.error(err));
  }

  handleRemove(event) {
    this.setState({ loading: true });
    const token = localStorage.getItem('basketToken');
    const cookieId = Number(event.target.closest('a').id);
    const req = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token
      }
    };
    fetch(`/removeCookie/${cookieId}`, req)
      .then(res => {
        if (res.status === 500) {
          this.setState({ error: true });
        }
        return res.json();
      })
      .then(updatedBasket => {
        this.setState({ loading: false });
        const updatedCookies = updatedBasket;
        this.setState({ cookies: updatedCookies });
      })
      .catch(err => console.error(err));
  }

  render() {
    const { loading } = this.state;
    if (this.state.error) {
      return (
        <div style={styles.errorContent} className="my-5 text-center d-flex flex-column justify-content-center align-items-center">
          <h1 className="w-75">There was an error with the connection. Please try again.</h1>
          <img src="/image/sad-cookie.png" alt="sad-cookie" />
        </div>
      );
    }
    return (
      <>
        {loading === true &&
          <div className="loader d-flex justify-content-center align-items-center" />
        }
        {loading === false &&
          <div className="loader-hide" />
        }

        {this.state.cookies.length === 0 &&
          <div className="no-basket-image-container">
            <div style={styles.noBasketImg} className="no-basket-image d-flex flex-column align-items-center">
              <h2 style={styles.noBasketText} className="text-center w-75">
                You have no cookies in your basket!</h2>
              <h4 style={styles.noBasketSmText} className="text-center w-75">
                Add some cookies to your basket to get started!</h4>
              <Link to="/cookies" style={styles.noBasketButton} className="button-more-cookies mt-2" >GET COOKIES</Link>
            </div>
          </div>
        }

        {this.state.cookies.length > 0 &&
        <div className="container mt-3">
          <h1 className="py-1" >My Basket</h1>
          <p className="m-0" style={styles.text}>{`${this.state.cookies.length} items`}</p>
          <div className="d-lg-flex justify-content-lg-between container">
            <div className="row col-lg-9 mb-3">
              {
            this.state.cookies.map((product, index) => (
              <div key={index} className="d-flex justify-content-lg-start">
                <BasketItems product={product} handleClick={this.handleClick} handleRemove={this.handleRemove} />
              </div>
            ))
            }
            </div>
            <div className="col-lg-3 mb-3" >
              <div className="py-3 d-flex flex-column align-items-center">
                <h4 style={styles.subtotalHeader} className="py-2">Need to grab more cookies for a friend in need?</h4>
                <Link to="/cookies" style={styles.button} className="button-more-cookies" >GET COOKIES</Link>
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
                <Link to="/checkout" style={styles.button} className="button-all w-100" >PROCEED TO CHECKOUT</Link>
              </div>
            </div>
          </div>
        </div>
        }
      </>
    );
  }
}

function BasketItems(props) {
  const { cookieId, quantity, flavor, weight, price, imageUrl } = props.product;
  const { handleClick } = props;
  const { handleRemove } = props;
  return (
    <>
      <div style={styles.imageContainer} className="col-5 col-md-4 p-3 d-flex align-items-center border-bot">
        <img className="w-100 h-100 img-fluid" style={styles.image} src={imageUrl} alt={flavor}/>
      </div>
      <Card className="col-7 col-md-8 card-border bg-transparent" style={styles.card}>
        <Card.Body className="d-flex flex-column flex-md-row justify-content-center justify-content-md-between align-items-md-center">
          <div className="p-0 col-md-5">
            <Card.Text className="m-0" style={styles.title}>{flavor}</Card.Text>
            <Card.Text className="m-0 pt-2" style={styles.weight}>{`${weight} oz`}</Card.Text>
          </div>
          <div className="d-flex flex-column w-50 flex-md-row justify-content-md-between align-items-md-center">
            <Card.Text className="m-0 py-2" style={styles.price}>{`${toDollars(price * quantity)}`}</Card.Text>
            <div id={cookieId} className="m-0 py-1 d-flex align-items-center" style={styles.text} value={quantity} onClick={handleClick}>
              <Button className="quantity-button p-0 mr-1">
                <i className="fa-solid fa-circle-minus"/>
              </Button>
              <p style={styles.text} className=" px-2 px-md-3 m-0">{` ${quantity} `}</p>
              <Button className="quantity-button p-0">
                <i className="fa-solid fa-circle-plus"/>
              </Button>
            </div>
            <Card.Text>
              <a id={cookieId} onClick={handleRemove} style={styles.remove}>Remove</a>
            </Card.Text>
          </div>
        </Card.Body>
      </Card>
    </>
  );
}
