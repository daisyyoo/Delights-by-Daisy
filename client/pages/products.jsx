import React from 'react';
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
export default class ProductDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cookie: null,
      quantity: 1,
      setShow: false,
      basketData: {}
    };
    this.handleChange = this.handleChange.bind(this);
    this.sendTheInfo = this.sendTheInfo.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    fetch(`/cookies/${this.props.cookieId}`)
      .then(res => res.json())
      .then(cookie => this.setState({ cookie }))
      .catch(err => console.error(err));
  }

  handleChange(event) {
    this.setState({ quantity: event.target.value });
  }

  sendTheInfo(event) {
    const { cartId, addToBasket } = this.context;
    let req;
    const token = localStorage.getItem('basketToken');
    if (token === null) {
      req = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.state)
      };
    } else {
      req = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        },
        body: JSON.stringify(this.state)
      };
    }
    fetch('/addToBasket', req)
      .then(res => res.json())
      .then(result => {
        this.setState({ basketData: result });
        this.setState({ setShow: true });
        if (!cartId) {
          addToBasket(result);
        }
      })
      .catch(err => console.error(err));
  }

  closeModal() {
    this.setState({ setShow: false });
  }

  render() {
    if (!this.state.cookie) return null;
    const { sendTheInfo } = this;
    const {
      flavor, price, weight, description, ingredients, allergens, backstory, imageUrl
    } = this.state.cookie;
    const modalShow = this.state.setShow ? 'show' : 'd-none';
    const { cookie, quantity } = this.state;
    const { closeModal } = this;
    const { setShow } = this.state;
    const moreProps = { cookie, quantity, closeModal };
    return (
      <>
        <div className="d-flex justify-content-start">
          <a style={styles.backButton} className="text-decoration-none mb-3" href='#cookies'>
            <i className="fa-solid fa-chevron-left" style={styles.icon} />
            {' Back'}
          </a>
        </div>
        <div className="d-flex row align-items-center">
          <div className="col-md-6 d-flex justify-content-center" style={styles.imageContainer}>
            <img src={imageUrl} alt={flavor} style={styles.image} className="w-100 h-100" />
          </div>
          <Card className="col-md-6 border-0 d-flex flex-direction-column justify-content-center">
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
                <Form.Select value={this.state.quantity} onChange={this.handleChange}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                </Form.Select>
              </Form.Group>
              <Button onClick={sendTheInfo} className="button-all ">ADD TO BASKET</Button>
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
        <BasketModal className={modalShow} data={moreProps} show={setShow} />
      </>
    );
  }
}

ProductDetails.contextType = AppContext;

function BasketModal(props) {
  const { cookie, quantity, closeModal } = props.data;
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
            <Button onClick={closeModal} className="button-return">KEEP SHOPPING</Button>
            <Button href="#myBasket" className="button-all">GO TO BASKET</Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
