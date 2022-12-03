import React from 'react';

const styles = {
  text: {
    color: '#693802',
    lineHeight: '1.7rem'
  },
  header: {
    color: '#422300',
    fontFamily: 'Merriweather'
  },
  line: {
    color: '#422300'
  },
  background: {
    backgroundColor: '#FFD8A9'
  },
  imageContainer: {
    position: 'relative',
    height: '250px'
  },
  image: {
    position: 'absolute',
    padding: '0',
    objectFit: 'cover'
  },
  height: {
    height: '100%'
  }
};

export default class AboutMe extends React.Component {
  render() {
    return (
      <>
        <div className="container mt-3">
          <div className="row flex-column">
            <h1>About Me</h1>
            <h4 className="mt-3" style={styles.header}>Backstory</h4>
            <hr style={styles.line}/>
            <h6 style={styles.text} className="pb-2">
              Hi! I&apos;m Daisy, and I love food. I love food so much I wanted to make a career out of it and went to The Culinary Institue of America for cooking, not baking. I don’t have a sweet tooth like most. But when I decide to indulge in something sweet, my favorite is a chocolate chip cookie.
            </h6>
          </div>
        </div>
        <div className="row justify-content-end m-0" style={styles.imageContainer}>
          <img style={styles.image} className="about-me-image" src="/image/about-me.webp" alt="lots-of-cookies"/>
        </div>
        <div style={styles.background} className="about-me-background">
          <div className="container" style={styles.height}>
            <div style={styles.height} className="d-flex flex-column justify-content-end">
              <h6 style={styles.text} className="py-3">
                As you can assume, I am very picky about my cookie. I never found one I loved, not too sweet, crunchy edges, chewy center, LOTS of good quality chocolate and all those beautiful cracks that add beauty and texture. So during covid, I decided to make my own version. After perfecting what I think is the perfect chocolate chip cookie, I made different flavors and variations. I hope my cookie research gives you a moment of delight.
              </h6>
            </div>
          </div>
        </div>
      </>
    );
  }
}
