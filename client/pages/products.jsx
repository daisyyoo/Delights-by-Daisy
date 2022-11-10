import React from 'react';
import { toDollars } from '../lib/';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';

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
      cookie: null
    };
  }

  componentDidMount() {
    fetch(`/cookies/${this.props.cookieId}`)
      .then(res => res.json())
      .then(cookie => this.setState({ cookie }));
  }

  render() {
    if (!this.state.cookie) return null;
    const {
      flavor, price, weight, description, ingredients, allergens, backstory, imageUrl
    } = this.state.cookie;
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
                <Form.Select defaultValue="1">
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                  <option>6</option>
                </Form.Select>
              </Form.Group>
              <Button href="#"className="button-all ">ADD TO BASKET</Button>
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
      </>
    );
  }
}
