import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { toDollars } from '../lib/';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';
import AppContext from '../lib/app-context';
import Modal from 'react-bootstrap/Modal';

const styles = {
  title: {
    color: '#422300',
    fontWeight: '600',
    fontFamily: 'Merriweather'
  },
  imageContainer: {
    height: '350px'
  },
  image: {
    objectFit: 'cover',
    borderRadius: '5px'
  },
  description: {
    color: '#693802',
    fontSize: '1rem',
    lineHeight: '1.3rem'
  },
  backButton: {
    color: '#693802'
  },
  icon: {
    fontSize: '0.8rem'
  },
  weight: {
    color: '#693802',
    fontSize: '0.8rem'
  },
  price: {
    color: '#693802',
    fontWeight: '600'
  },
  text: {
    color: '#422300'
  },
  modalCard: {
    height: '150px'
  },
  modalHeader: {
    color: '#fdeedc',
    fontWeight: '600',
    fontFamily: 'Merriweather',
    fontSize: '2rem'
  },
  modalTitle: {
    color: '#422300',
    fontWeight: '600',
    fontFamily: 'Merriweather',
    fontSize: '1.2rem'
  },
  modalText: {
    color: '#422300',
    fontSize: '1rem'
  },
  modalPrice: {
    color: '#693802',
    fontWeight: '600',
    fontSize: '1rem'
  }
};

export default function ProductDetails(props) {
  const context = useContext(AppContext);
  const { cookieId } = useParams();
  const [cookie, setCookie] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [disabled, setDisabled] = useState(true);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const token = localStorage.getItem('basketToken');

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/cookies/${cookieId}`);
        if (response.status === 500) { setError(true); }
        const selectedCookie = await response.json();
        setCookie(selectedCookie);
        setLoading(false);
      } catch (err) { console.error(err); }
    };
    fetchData();
  }, [cookieId]);

  let req;
  const handleClick = event => {
    setLoading(true);
    const addCookie = { cookie, quantity };
    if (!token) {
      req = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(addCookie)
      };
    } else {
      req = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        },
        body: JSON.stringify(addCookie)
      };
    }
    getCookieData();
  };

  const getCookieData = async () => {
    try {
      const response = await fetch('/api/addToBasket', req);
      if (response.status === 500) {
        setShow(false);
        setError(true);
      }
      const { cartId, addToBasket } = context;
      await response.json()
        .then(res => {
          if (!cartId) {
            addToBasket(res);
          }
          setLoading(false);
          return setShow(true);
        })
        .catch(err => console.error(err));
    } catch (err) { console.error(err); }
  };

  const { flavor, price, weight, description, ingredients, allergens, backstory, imageUrl } = cookie;
  const moreProps = { cookie, quantity };

  return (
    <>
      {error && (
        <Navigate to='/not-found' />
      )}
      {loading &&
      <div className="loader d-flex justify-content-center align-items-center" />
    }
      {!loading &&
      <>
        <div className="loader-hide" />
        <div className="container mt-3">
          <div className="d-flex justify-content-start">
            <Link style={styles.backButton} className="text-decoration-none mb-3" to='/cookies'>
              <i className="fa-solid fa-chevron-left" style={styles.icon} />
              {' Back'}
            </Link>
          </div>
          <div className="d-flex row align-items-center">
            <div className="col-md-6 d-flex justify-content-center" style={styles.imageContainer}>
              <img src={imageUrl} alt={flavor} style={styles.image} className="w-100 h-100" />
            </div>
            <Card className="col-md-6 border-0 d-flex flex-direction-column justify-content-center bg-transparent">
              <Card.Body className="pb-0">
                <Card.Text className="h1 py-lg-3 d-flex align-items-center" style={styles.title}>{flavor}</Card.Text>
                <Card.Text className="h6 d-flex align-items-center" style={styles.weight}>{`${weight} oz`}</Card.Text>
              </Card.Body>
              <Card.Body className="d-flex align-items-center">
                <Card.Text style={styles.description}>
                  {description}
                </Card.Text>
              </Card.Body>
              <Card.Body className="py-0 d-flex align-items-center" style={styles.price}>
                {toDollars(price)}
              </Card.Body>
              <Card.Body className="d-flex justify-content-between align-items-center">
                <Form.Group>
                  <Form.Select
                  required
                  value={quantity}
                  onChange={event => {
                    if (parseInt(event.target.value)) {
                      setQuantity(event.target.value);
                      setDisabled(false);
                    }
                  }}>
                    <option >Qty</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                  </Form.Select>
                </Form.Group>
                <Button disabled={disabled} onClick={handleClick} className="button-all ">ADD TO BASKET</Button>
              </Card.Body>
            </Card>
          </div>
          <Accordion className="my-4">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Ingredients</Accordion.Header>
              <Accordion.Body style={styles.text}>{ingredients}</Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>Allergens</Accordion.Header>
              <Accordion.Body style={styles.text}>{allergens}</Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>Backstory</Accordion.Header>
              <Accordion.Body style={styles.text}>{backstory}</Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <BasketModal className={show ? 'show' : 'd-none'} data={moreProps} show={show} />
        </div>
      </>
      }
    </>
  );
}

function BasketModal(props) {
  const { cookie, quantity } = props.data;
  const { show } = props;
  const { flavor, imageUrl, price, weight } = cookie;

  return (
    <Modal
      show={show}
      fullscreen='md-down'
      aria-labelledby="basket-modal"
    >
      <Modal.Header>
        <h1 style={styles.modalHeader} id="basket-modal" className="m-0">
          Added to Basket!
        </h1>
      </Modal.Header>
      <Modal.Body>
        <div className="mt-2">
          <div className="d-flex">
            <div className="col-4 d-flex align-items-center ">
              <img className="w-100" style={styles.image} src={imageUrl} alt={flavor}/>
            </div>
            <Card className="col-8 border-0">
              <Card.Body className="py-2 px-3">
                <Card.Text style={styles.modalTitle} className="h3">
                  {flavor}
                </Card.Text>
                <Card.Text style={styles.modalText} className="h4">
                  {`${weight} oz`}
                </Card.Text>
                <Card.Text style={styles.modalPrice} className="h4">
                  {`${toDollars(price * quantity)}`}
                </Card.Text>
                <Card.Text style={styles.modalText} className="h4">
                  {`Qty :  ${quantity}`}
                </Card.Text>
              </Card.Body>
            </Card>
          </div>
          <div className="d-flex justify-content-between mt-5">
            <Link to="/cookies" className="button-return">KEEP SHOPPING</Link>
            <Link to="/myBasket" className="button-all">GO TO BASKET</Link>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
