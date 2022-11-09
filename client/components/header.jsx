import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';

const styles = {
  link: {
    color: '#fdeedc'
  }
};

export default class Header extends React.Component {
  render() {
    return (
      <Navbar className="color-nav mb-3" expand="md" sticky="top" >
        <Container>
          <Navbar.Brand href="#" style={styles.link}>Delights by Daisy</Navbar.Brand>
          <Navbar.Toggle aria-controls="offcanvasNavbar-expand" />
          <Navbar.Offcanvas id="offcanvasNavbar-expand" aria-labelledby="offcanvasNavbar-expand" placement="end">
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id="offcanvasNavbar-expand">
                MENU
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <Nav.Link style={styles.link} href="#">HOME</Nav.Link>
                <Nav.Link style={styles.link} href="#cookies">SHOP</Nav.Link>
                <Nav.Link style={styles.link} href="#myBasket">MY BASKET</Nav.Link>
                <Nav.Link style={styles.link} href="#aboutMe">ABOUT ME</Nav.Link>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    );
  }
}
