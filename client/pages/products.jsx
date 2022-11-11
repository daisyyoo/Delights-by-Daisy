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
  image: {
    height: '400px',
    objectFit: 'contain'
  },
  description: {
    color: '#693802',
    fontSize: '1rem',
    lineHeight: '1.3rem'
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
  }

  componentDidMount() {
    fetch(`/cookies/${this.props.cookieId}`)
      .then(res => res.json())
      .then(cookie => this.setState({ cookie }));
  }

  handleChange(event) {
    this.setState({ quantity: event.target.value });
  }

  sendTheInfo(event) {
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    };
    fetch('/myBasket', req)
      .then(res => res.json())
      .then(result => {
        // console.log(result);
        this.setState({ basketData: result });
        this.setState({ setShow: true });
      });
    // add token to window location HERE from the result of the fetch
  }

  render() {
    if (!this.state.cookie) return null;
    // const { addToBasket } = this.context;
    const { sendTheInfo } = this;
    const {
      flavor, price, weight, description, ingredients, allergens, backstory, imageUrl
    } = this.state.cookie;
    const modalShow = this.state.setShow ? 'show' : 'd-none';
    const { cookie, quantity } = this.state;
    const { setShow } = this.state;
    const moreProps = { cookie, quantity };
    return (
      <>
        <div className="d-flex row">
          <div className="col">
            <img src={imageUrl} alt={flavor} style={styles.image} />
          </div>
          <Card className="col border-0 d-flex flex-direction-column justify-content-center">
            <Card.Body className="pb-0">
              <Card.Text className="h1 py-lg-3 d-flex align-items-center" style={styles.title}>{flavor}</Card.Text>
              <Card.Text className="h6 d-flex align-items-center" style={styles.weight}>{`${weight} oz`}</Card.Text>
            </Card.Body>
            <Card.Body className="pt-lg-0 d-flex align-items-center">
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
  const { cookie, quantity } = props.data;
  const { show } = props;
  const { flavor, imageUrl, price, weight } = cookie;

  return (
    <Modal
      show={show}
      // onHide= {!show}
      dialogClassName="modal-lg-50w"
      aria-labelledby="basket-modal"
    >
      <Modal.Header>
        <Modal.Title id="basket-modal">
          Added to Basket!
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Card>
          <Card.Img src={imageUrl} alt={flavor}/>
          <Card.Body>
            <Card.Text>
              {flavor}
            </Card.Text>
            <Card.Text>
              {`${weight} oz`}
            </Card.Text>
            <Card.Text>
              {`${toDollars(price * quantity)}`}
            </Card.Text>
            <Card.Text>
              {`Qty :  ${quantity}`}
            </Card.Text>
          </Card.Body>
          <Card.Body>
            <Button className="button-return">KEEP SHOPPING</Button>
            {/* need to figure out how to close the modal with ^ button onClick event */}
            <Button href="#myBasket" className="button-all">GO TO BASKET</Button>
          </Card.Body>
        </Card>
      </Modal.Body>
    </Modal>

  );
}
