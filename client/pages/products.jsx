import React from 'react';
import { toDollars } from '../lib/';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';

const styles = {
  title: {
    color: '#422300',
    fontWeight: '600'
  },
  image: {
    height: '300px',
    objectFit: 'cover'
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
  accordionText: {
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
        <div>
          <h1 style={styles.title}>{flavor}</h1>
          <p style={styles.weight}>{`${weight} oz`}</p>
        </div>
        <Card>
          <Card.Img variant="top" src={imageUrl} alt={flavor} style={styles.image} />
          <Card.Body>
            <Card.Text style={styles.description}>
              {description}
            </Card.Text>
          </Card.Body>
          <Card.Body className="py-0" style={styles.price}>
            {toDollars(price)}
          </Card.Body>
          <Card.Body className="d-flex justify-content-between">
            <input type="number" />
            <Button className="button-all">ADD TO BASKET</Button>
          </Card.Body>
        </Card>
        <Accordion className="my-4">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Ingredients</Accordion.Header>
            <Accordion.Body style={styles.accordionText}>{ingredients}</Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>Allergens</Accordion.Header>
            <Accordion.Body style={styles.accordionText}>{allergens}</Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header>Backstory</Accordion.Header>
            <Accordion.Body style={styles.accordionText}>{backstory}</Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </>
    );
  }
}
