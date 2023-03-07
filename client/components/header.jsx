import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <Navbar collapseOnSelect className="color-nav" expand="md" sticky="top" >
      <Container fluid>
        <Navbar.Brand href="/" className="px-sm-5">Delights by Daisy</Navbar.Brand>
        <Navbar.Toggle aria-controls="offcanvasNavbar-expand" />
        <Navbar.Offcanvas id="offcanvasNavbar-expand" aria-labelledby="offcanvasNavbar-expand" placement="end">
          <Offcanvas.Header className="mx-4 border-bot" closeButton>
            <Offcanvas.Title className="pt-2" id="offcanvasNavbar-expand">
              MENU
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className="px-4">
            <Nav className="justify-content-end flex-grow-1 pe-3" onSelect={(_, event) => { window.location.href = event.target.href; }} >
              <NavLink className="px-3 px-lg-3 menu-link" to="/">HOME</NavLink>
              <NavLink className="px-3 px-lg-3 menu-link" to="/cookies">SHOP</NavLink>
              <NavLink className="px-3 px-lg-3 menu-link" to="/myBasket" >MY BASKET</NavLink>
              <NavLink className="px-3 px-lg-3 menu-link" to="/aboutMe">ABOUT ME</NavLink>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}
