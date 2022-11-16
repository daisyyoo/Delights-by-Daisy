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
    color: '#422300'
  },
  image: {
    height: '150px',
    objectFit: 'cover'
  }
};
export default class Footer extends React.Component {
  render() {
    const { cartId } = this.context;
    return (
      <>
        {!cartId &&
        <footer style={styles.bgcolor} className="w-100">
          <div className="container d-flex">
            <div className="d-flex align-items-left justify-content-center flex-column w-75">
              <h4 style={styles.title}>Delights by Daisy</h4>
              <p style={styles.text} className="mb-1">Contact us!</p>
              <p style={styles.text} className="mb-1">Email: daisyhyoo@gmail.com</p>
              <p style={styles.text} className="mb-1">Instagram: delights.by.daisy</p>
            </div>
            <div className="d-flex justify-content-end w-25">
              <img style={styles.image} src='/image/logo.png' />
            </div>
          </div>
          </footer>
        }
        {cartId &&
        <footer style={styles.bgcolor} className="w-100">
          <div className="container d-flex">
            <div className="d-flex align-items-left justify-content-center flex-column w-75">
              <h4 style={styles.title}>Delights by Daisy</h4>
              <p style={styles.text} className="mb-1">Contact us!</p>
              <p style={styles.text} className="mb-1">Email: daisyhyoo@gmail.com</p>
              <p style={styles.text} className="mb-1">Instagram: delights.by.daisy</p>
            </div>
            <div className="d-flex justify-content-end w-25">
              <img style={styles.image} src='/image/logo.png' />
            </div>
          </div>
        </footer>
      }
      </>
    );
  }
}
