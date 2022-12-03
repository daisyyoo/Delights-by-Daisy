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
    backgroundColor: '#FFD8A9',
    height: '50vh'
  },
  imageContainer: {
    position: 'relative',
    height: '250px'
  },
  image: {
    position: 'absolute',
    height: '400px',
    width: '75vw',
    objectFit: 'cover',
    padding: '0'
  }
};

export default class AboutMe extends React.Component {
  render() {
    return (
      <div className="container mt-3">
        <div className="row flex-column">
          <h1>About Me</h1>
          <h4 className="mt-3" style={styles.header}>Backstory</h4>
          <hr style={styles.line}/>
          <h6 style={styles.text} className="pb-4 px-3">
            Hi! I&apos;m Daisy, and I love food. I love food so much I wanted to make a career out of it and went to The Culinary Institue of America for cooking, not baking. I don’t have a sweet tooth like most. But when I decide to indulge in something sweet, my favorite is a chocolate chip cookie.
          </h6>
        </div>
        <div className="row justify-content-end" style={styles.imageContainer}>
          <img style={styles.image} src="/image/about-me.webp" alt="lots-of-cookies"/>
        </div>
        <div className="row flex-column justify-content-end pt-5" style={styles.background}>
          <h6 style={styles.text} className="p-3">
            As you can assume, I am very picky about my cookie. I never found one I loved, not too sweet, crunchy edges, chewy center, LOTS of good quality chocolate and all those beautiful cracks that add beauty and texture. So during covid, I decided to make my own version. After perfecting what I think is the perfect chocolate chip cookie, I made different flavors and variations. I hope my cookie research gives you a moment of delight.
          </h6>
        </div>
      </div>
    );
  }
}
