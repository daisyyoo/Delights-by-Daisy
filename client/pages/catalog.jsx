import React, { useState, useEffect } from 'react';
import { toDollars } from '../lib/';
import Card from 'react-bootstrap/Card';
import { Link, Navigate } from 'react-router-dom';

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
    const fetchData = async () => {
      try {
        const response = await fetch('/api/cookies');
        if (response.status === 500) { setError(true); }
        const allCookies = await response.json();
        setCookies(allCookies);
        setLoading(false);
      } catch (err) { console.error(err); }
    };
    fetchData();
  }, []);

  return (
    <>
      {error && (
        <Navigate to='/not-found' />
      )}
      <div className="container mt-3 flex-grow-1">
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
      to={`/cookies/${cookieId}`}
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
