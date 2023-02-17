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
  imageContainer: {
    position: 'relative'
  },
  image: {
    position: 'absolute',
    padding: '0',
    objectFit: 'cover',
    height: '100%',
    right: '0'
  },
  height: {
    height: '100%'
  },
  textPadding: {
    padding: '0 50px'
  },
  titlePadding: {
    padding: '0 38px'
  }
};

export default function AboutMe() {
  return (
    <div className="container-fluid mt-3 background-half-color">
      <div className="row flex-column" style={styles.titlePadding}>
        <h1>About Me</h1>
        <h4 className="mt-3" style={styles.header}>Backstory</h4>
        <hr style={styles.line}/>
      </div>
      <div className="row flex-column">
        <div style= {styles.textPadding}>
          <h6 style={styles.text} className="pb-2">
            Hi! I&apos;m Daisy, and I love food. I love food so much I wanted to make a career out of it and went to The Culinary Institue of America for cooking, not baking. I don’t have a sweet tooth like most. But when I decide to indulge in something sweet, my favorite is a chocolate chip cookie.
          </h6>
        </div>
        <div className="d-flex justify-content-end m-0 about-me-image-container" style={styles.imageContainer}>
          <img style={styles.image} className="about-me-image" src="/image/about-me-sm.webp" alt="lots-of-cookies"/>
        </div>
        <div style={styles.textPadding}>
          <h6 style={styles.text} className="py-3">
            As you can assume, I am very picky about my cookie. I never found one I loved, not too sweet, crunchy edges, chewy center, LOTS of good quality chocolate and all those beautiful cracks that add beauty and texture. So during covid, I decided to make my own version. After perfecting what I think is the perfect chocolate chip cookie, I made different flavors and variations. I hope my cookie research gives you a moment of delight.
          </h6>
        </div>
      </div>
    </div>
  );
}
