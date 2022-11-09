import React from 'react';

const styles = {
  bgcolor: {
    backgroundColor: '#FDEEDC'
  },
  title: {
    fontFamily: 'Merriweather',
    color: '#422300',
    fontWeight: '600'
  },
  text: {
    color: '#422300',
    marginBottom: '0.3rem'
  },
  image: {
    height: '150px',
    objectFit: 'contain'
  }
};
export default class Footer extends React.Component {
  render() {
    return (
      <div className="d-flex p-2" style={styles.bgcolor}>
        <div>
          <h4 style={styles.title}>Delights by Daisy</h4>
          <p style={styles.text}>Contact us!</p>
          <p style={styles.text}>Email: daisyhyoo@gmail.com</p>
          <p style={styles.text}>Instagram: delights.by.daisy</p>
        </div>
        <div>
          <img style={styles.image} src='/image/logo.png' />
        </div>
      </div>
    );
  }
}
