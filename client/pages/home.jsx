import React from 'react';
import Button from 'react-bootstrap/Button';

const styles = {
  image: {
    backgroundImage: 'url("/image/home-pic.webp")',
    backgroundSize: 'cover',
    backgroundPosition: '75%',
    width: '100%',
    position: 'absolute',
    left: '0',
    top: '3rem'
  },
  textbox: {
    position: 'absolute',
    top: '18%',
    left: '10%'
  },
  text: {
    color: '#422300',
    lineHeight: '2rem'
  }
};

export default function Home(props) {
  return (
    <div className="homepage-container">
      <div className="image-container">
        <img style={styles.image} className="homepage-image"/>
        <div style={styles.textbox} className="w-50">
          <h1 className="mt-3 mb-5">Welcome!</h1>
          <p style={styles.text}>
            In my venture of creating my version of the ideal cookie,
            I have perfected the classic Chocolate Chip and expanded my
            repertoire to my newest creation, Jasmine Tea Almond Blueberry.
            Take a bite and enjoy a moment of delight!</p>
          <Button href="#cookies" className="button-all my-3">Order Now</Button>
        </div>
      </div>
    </div>

  );
}
