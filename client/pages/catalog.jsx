import React from 'react';
import { toDollars } from '../lib/';
import Card from 'react-bootstrap/Card';

const styles = {
  product: {
    display: 'block',
    cursor: 'pointer'
  },
  image: {
    height: '250px',
    objectFit: 'contain'
  },
  drkbrown: {
    color: '#422300'
  },
  lgtbrown: {
    color: '#693802'
  }
};

export default class Catalog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cookies: []
    };
  }

  componentDidMount() {
    fetch('/cookies/shopAll')
      .then(res => res.json())
      .then(cookies => {
        window.location.hash = 'catalog';
        this.setState({ cookies });
      }
      );
  }

  render() {
    return (
      <div className="container">
        <h1 style={styles.drkbrown}>Shop All</h1>
        <div className="row">
          <a style={styles.lgtbrown} href='#'>Home</a>
          <p style={styles.lgtbrown}>{`${this.state.cookies.length} items`}</p>
        </div>
        <div className="row">
          {
            this.state.cookies.map(product => (
              <div key={product.cookieId} className="col-12 col-md-6 col-lg-4">
                <Product product={product} />
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}

function Product(props) {
  // eslint-disable-next-line no-unused-vars
  const { cookieId, flavor, price, imageUrl } = props.product;
  /* this anchor should go to product details at `#cookies?cookieId=${cookieId}` */
  return (
    <a
      href={`#cookies?cookieId=${cookieId}`}
      style={styles.product}
      className="mb-4 shadow-sm text-decoration-none">
      <Card>
        <Card.Img variant="top" src={imageUrl} alt={flavor} style={styles.image}/>
        <Card.Body>
          <Card.Title style={styles.drkbrown}>{flavor}</Card.Title>
          <Card.Text style={styles.drkbrown}>
            { toDollars(price) }
          </Card.Text>
        </Card.Body>
      </Card>
    </a>
  );
}
