import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
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
import ProtectedRoute from './pages/protected-route';

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
      <Routes>
        <Route path='/' element={<PageContainer />}>
          <Route index element ={<Home />}/>
          <Route path='cookies' element={<Catalog />} />
          <Route path='cookies/:cookieId' element={<ProductDetails />} />
          <Route path='myBasket' element={<Basket />} />
          <Route path='checkout' element={<StripeCheckout />} />
          <Route element={<ProtectedRoute />} >
            <Route element={<ConfirmationPage />} path='confirmationPage'/>
          </Route>
          <Route path='aboutMe' element={<AboutMe />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AppContext.Provider>
  );
}
