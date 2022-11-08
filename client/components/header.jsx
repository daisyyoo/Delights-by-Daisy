import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';

export default class Header extends React.Component {
  render() {
    return (
      <Navbar bg="dark" variant="dark" expand="md" sticky="top" className="mb-3">
        <Container>
          <Navbar.Brand href="#">Delights by Daisy</Navbar.Brand>
          <Navbar.Toggle aria-controls="offcanvasNavbar-expand" />
          <Navbar.Offcanvas id="offcanvasNavbar-expand" aria-labelledby="offcanvasNavbar-expand" placement="end">
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id="offcanvasNavbar-expand">
                MENU
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <Nav.Link href="#home">HOME</Nav.Link>
                <Nav.Link href="#shopAll">SHOP</Nav.Link>
                <Nav.Link href="#myBasket">MY BASKET</Nav.Link>
                <Nav.Link href="aboutMe">ABOUT ME</Nav.Link>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    );
  }
}
