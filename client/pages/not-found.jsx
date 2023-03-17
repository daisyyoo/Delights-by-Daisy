import React from 'react';
import { Link } from 'react-router-dom';

const styles = {
  pageContent: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 3.5rem)'
  },
  errorContent: {
    height: '300px'
  }
};

export default function NotFound(props) {
  return (
    <div style={styles.pageContent} className="d-flex flex-column">
      <div style={styles.errorContent} className="my-5 text-center d-flex flex-column justify-content-center align-items-center">
        <h1 className="w-75">There was an error with the connection. Please try again.</h1>
        <img src="/image/sad-cookie.png" alt="sad-cookie" />
      </div>
      <Link to="/" >Return to the Homepage</Link>

    </div>

  );
}
