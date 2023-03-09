import React, { useState, useEffect } from 'react';
import { toDollars } from '../lib/';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

const styles = {
  product: {
    display: 'block',
    cursor: 'pointer'
  },
  image: {
    height: '200px',
    objectFit: 'cover'
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
  },
  errorContent: {
    height: '500px'
  }
};

export default function Catalog() {
  const [cookies, setCookies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/cookies')
      .then(res => {
        if (res.status === 500) {
          setError(true);
        }
        return res.json();
      })
      .then(cookies => {
        setCookies(cookies);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      {error && (
        <div style={styles.errorContent} className="my-5 text-center d-flex flex-column justify-content-center align-items-center">
          <h1 className="w-75">There was an error with the connection. Please try again.</h1>
          <img src="/image/sad-cookie.png" alt="sad-cookie"/>
        </div>
      )}
      <div className="container mt-3">
        <h1 className="py-1">Shop All</h1>
        <div className="d-flex justify-content-between">
          <Link to="/" style={styles.description} className="text-decoration-none">
            <i className="fa-solid fa-chevron-left" style={styles.icon}/>
            {' Home'}
          </Link>
          <p style={styles.description}>{`${cookies.length} items`}</p>
        </div>
        <div className="row">
          {
            cookies.map(product => (
              <div key={product.cookieId} className="col-6 col-lg-4">
                <Product product={product} />
              </div>
            ))
          }
        </div>
      </div>
      {loading &&
      <div className="loader d-flex justify-content-center align-items-center" />
        }
      {!loading &&
      <div className="loader-hide" />
        }
    </>
  );
}

function Product(props) {
  const { cookieId, flavor, price, imageUrl } = props.product;
  return (
    <Link
      to={`/cookie/${cookieId}`}
      style={styles.product}
      className="mb-4 text-decoration-none">
      <Card className="border-0">
        <Card.Img variant="top" src={imageUrl} alt={flavor} style={styles.image} />
        <Card.Body className="p-0">
          <Card.Title className="pt-2" style={styles.title}>{flavor}</Card.Title>
          <Card.Text style={styles.text}>
            { toDollars(price) }
          </Card.Text>
        </Card.Body>
      </Card>
    </Link>
  );
}
