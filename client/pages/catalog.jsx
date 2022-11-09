import React from 'react';
import { toDollars } from '../lib/';
import Card from 'react-bootstrap/Card';

const styles = {
  product: {
    display: 'block',
    cursor: 'pointer'
  },
  image: {
    height: '150px',
    objectFit: 'cover'
  },
  header: {
    color: '#422300',
    fontWeight: '600'
  },
  title: {
    color: '#422300',
    fontSize: '1rem',
    fontWeight: '600'
  },
  text: {
    color: '#422300'
  },
  description: {
    color: '#693802'
  },
  icon: {
    fontSize: '0.8rem'
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
      <>
        <h1 className="py-1" style={styles.header}>Shop All</h1>
        <div className="d-flex justify-content-between">
          <a style={styles.description} className="text-decoration-none" href='#'>
            <i className="fa-solid fa-chevron-left" style={styles.icon}/>
            {' Home'}
          </a>
          <p style={styles.description}>{`${this.state.cookies.length} items`}</p>
        </div>
        <div className="row">
          {
            this.state.cookies.map(product => (
              <div key={product.cookieId} className="col-6 col-lg-4">
                <Product product={product} />
              </div>
            ))
          }
        </div>
      </>
    );
  }
}

function Product(props) {
  const { cookieId, flavor, price, imageUrl } = props.product;
  return (
    <a
      href={`#cookies?cookieId=${cookieId}`}
      style={styles.product}
      className="mb-4 text-decoration-none">
      <Card className="border-0">
        <Card.Img variant="top" src={imageUrl} alt={flavor} style={styles.image} className=""/>
        <Card.Body className="p-0">
          <Card.Title className="pt-2" style={styles.title}>{flavor}</Card.Title>
          <Card.Text style={styles.text}>
            { toDollars(price) }
          </Card.Text>
        </Card.Body>
      </Card>
    </a>
  );
}
