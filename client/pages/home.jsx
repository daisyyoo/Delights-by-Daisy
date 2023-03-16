import React from 'react';
import { Link } from 'react-router-dom';

const styles = {
  image: {
    backgroundImage: 'url("/image/home-pic.webp")',
    backgroundSize: 'cover',
    backgroundPosition: '75%',
    width: '100%',
    height: '100%'
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

export default function Home() {
  return (
    <div className="image-container" >
      <div style={styles.image} className="homepage-image"/>
      <div style={styles.textbox} className="w-50">
        <h1 className="mt-3 mb-5">Welcome!</h1>
        <h6 style={styles.text}>
          In my venture of creating my version of the ideal cookie,
          I have perfected the classic Chocolate Chip and expanded my
          repertoire to my newest creation, Jasmine Tea Almond Blueberry.
          Take a bite and enjoy a moment of delight!</h6>
        <Link to="/cookies" className="button-all my-3">ORDER NOW</Link>
      </div>
    </div>
  );
}
