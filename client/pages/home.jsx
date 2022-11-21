import React from 'react';

const styles = {
  text: {
    position: 'absolute',
    left: '100px',
    top: '150px'
  }
};

export default function Home(props) {

  return (
    <div className="row">
      <img className="img-fluid" src="/image/home-pic.jpg" alt="plate-of-cookies"/>
      <h1 style={styles.text}>Welcome to the homepage!</h1>
    </div>
  );
}
