import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';

export default class Header extends React.Component {
  render() {
    return (
      <Navbar collapseOnSelect className="color-nav mb-3" expand="md" sticky="top" >
        <Container fluid>
          <Navbar.Brand href="#" className="px-sm-5">Delights by Daisy</Navbar.Brand>
          <Navbar.Toggle aria-controls="offcanvasNavbar-expand" />
          <Navbar.Offcanvas id="offcanvasNavbar-expand" aria-labelledby="offcanvasNavbar-expand" placement="end">
            <Offcanvas.Header className="mx-4 border-bot" closeButton>
              <Offcanvas.Title className="pt-2" id="offcanvasNavbar-expand">
                MENU
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="px-4">
              <Nav className="justify-content-end flex-grow-1 pe-3" onSelect={(_, event) => { window.location.href = event.target.href; }} >
                <Nav.Link className="px-3 px-lg-3 menu-link" href="#" role="fool">HOME</Nav.Link>
                <Nav.Link className="px-3 px-lg-3 menu-link" href="#cookies">SHOP</Nav.Link>
                <Nav.Link className="px-3 px-lg-3 menu-link" href="#myBasket" >MY BASKET</Nav.Link>
                <Nav.Link className="px-3 px-lg-3 menu-link" href="#aboutMe">ABOUT ME</Nav.Link>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    );
  }
}
