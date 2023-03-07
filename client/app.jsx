import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import Header from './components/header';
import Footer from './components/footer';
import AppContext from './lib/app-context';
import PageContainer from './components/page-container';
import NotFound from './pages/not-found';
import Home from './pages/home';
import Catalog from './pages/catalog';
import ProductDetails from './pages/products';
import Basket from './pages/basket';
import StripeCheckout from './pages/stripe';
import ConfirmationPage from './pages/confirmation-page';
import AboutMe from './pages/about-me';

export default function App() {
  const [cartId, setCartId] = useState();

  useEffect(() => {
    const token = window.localStorage.getItem('basketToken');
    const cartId = token ? jwtDecode(token) : null;
    setCartId(cartId);
  }, []);

  const addToBasket = result => {
    const { cartId, token } = result;
    window.localStorage.setItem('basketToken', token);
    setCartId(cartId);
  };

  const checkOut = () => {
    window.localStorage.removeItem('basketToken');
    setCartId('');
  };

  const contextValue = { cartId, addToBasket, checkOut };
  return (
    <AppContext.Provider value={contextValue}>
      <BrowserRouter>
        <Header />
        <PageContainer>
          <Routes>
            <Route index path='/' element={<Home />} />
            <Route path='cookies' element={<Catalog />} />
            <Route path='cookie/:cookieId' element={<ProductDetails />} />
            <Route path='myBasket' element={<Basket />} />
            <Route path='checkout' element={<StripeCheckout />} />
            <Route path='confirmationPage' element={<ConfirmationPage />} />
            <Route path='aboutMe' element={<AboutMe />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageContainer>
        <Footer />
      </BrowserRouter>
    </AppContext.Provider>
  );

}
