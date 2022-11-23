import React from 'react';
import Carousel from 'react-bootstrap/Carousel';

const styles = {
  image: {
    objectFit: 'contain'
  }
};

export default function Home(props) {
  return (
    // <div className="row" style={styles.position}>
    //   <img className="img-fluid" src="/image/home-pic.jpg" alt="plate-of-cookies"/>
    //   <h1 style={styles.text}>Welcome to the homepage!</h1>
    // </div>
    <Carousel className="carousel-container" fade>
      <Carousel.Item>
        <img
          className="d-block w-100 img-fluid"
          src="/image/home-pic-sm.jpg"
          alt="welcome-picture"
          style={styles.image}
        />
        <Carousel.Caption>
          <h3>Welcome!</h3>
          <p>In my venture of creating my version of the ideal cookie,
            I have perfected the classic Chocolate Chip and expanded my
            repertoire to my newest creation, Jasmine Tea Almond Blueberry.
            Take a bite and enjoy a moment of delight!</p>
        </Carousel.Caption>
      </Carousel.Item>
      {/* <Carousel.Item>
        <img
          className="d-block w-100"
          src="holder.js/800x400?text=Second slide&bg=282c34"
          alt="Second slide"
        />

        <Carousel.Caption>
          <h3>Second slide label</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="holder.js/800x400?text=Third slide&bg=20232a"
          alt="Third slide"
        />

        <Carousel.Caption>
          <h3>Third slide label</h3>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p>
        </Carousel.Caption>
      </Carousel.Item> */}
    </Carousel>

  );
}
