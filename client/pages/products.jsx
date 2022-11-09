import React from 'react';
import { toDollars } from '../lib/';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

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
          <h1>{flavor}</h1>
          <p>{weight}</p>
        </div>
        <Card>
          <Card.Img variant="top" src={imageUrl} alt={flavor} />
          <Card.Body>
            <Card.Text>
              {description}
            </Card.Text>
          </Card.Body>
          <Card.Body>
            {toDollars(price)}
          </Card.Body>
          <Card.Body>
            <input type="number" />
            <Button>Go To Basket</Button>
          </Card.Body>
        </Card>
        <div>
          {ingredients}
          {allergens}
          {backstory}
        </div>
      </>
    );
  }
}
