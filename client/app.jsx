import React, { useState, useEffect } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import Header from './components/header';
import Footer from './components/footer';
// import { parseRoute } from './lib';
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

const router = createBrowserRouter([
  createRoutesFromElements(
    <Route path='' element={<Home />}>
      <Route path='cookies' element={<Catalog />} />
      <Route path='cookie/:cookieId' element={<ProductDetails />} />
      <Route path='myBasket' element={<Basket />} />
      <Route path='checkout' element={<StripeCheckout />} />
      <Route path='confirmationPage' element={<ConfirmationPage />} />
      <Route path='aboutMe' element={<AboutMe />} />
      <Route path="*" element={<NotFound />}/>
    </Route>
  )
]);

export default function App() {
  const [cartId, setCartId] = useState();

  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     cartId: null,
  //     route: parseRoute(window.location.hash)
  //   };
  //   this.addToBasket = this.addToBasket.bind(this);
  //   this.checkOut = this.checkOut.bind(this);
  // }
  useEffect(() => {
    // window.addEventListener('hashchange', event => {
    //   const route = parseRoute(window.location.hash);
    //   this.setState({ route });
    // });
    const token = window.localStorage.getItem('basketToken');
    const cartId = token ? jwtDecode(token) : null;
    setCartId(cartId);
    //  this.setState({ cartId });
  }, []);

  // componentDidMount() {
  //   window.addEventListener('hashchange', event => {
  //     const route = parseRoute(window.location.hash);
  //     this.setState({ route });
  //   });
  //   const token = window.localStorage.getItem('basketToken');
  //   const cartId = token ? jwtDecode(token) : null;
  //   this.setState({ cartId });
  // }

  const addToBasket = result => {
    const { cartId, token } = result;
    window.localStorage.setItem('basketToken', token);
    setCartId(cartId);
    // this.setState({ cartId });
  };

  const checkOut = () => {
    window.localStorage.removeItem('basketToken');
    setCartId('');
    // this.setState({ cartId: null });
  };

  // renderPage() {
  //   const { route } = this.state;
  //   if (route.path === '') {
  //     return <Home />;
  //   }
  //   if (route.path === 'cookies') {
  //     return <Catalog />;
  //   }
  //   if (route.path === 'cookie') {
  //     const cookieId = route.params.get('cookieId');
  //     return <ProductDetails cookieId={cookieId} />;
  //   }
  //   if (route.path === 'myBasket') {
  //     return <Basket />;
  //   }
  //   if (route.path === 'checkout') {
  //     return <StripeCheckout />;
  //   }
  //   if (route.path === 'confirmationPage') {
  //     return <ConfirmationPage />;
  //   }
  //   if (route.path === 'aboutMe') {
  //     return <AboutMe />;
  //   }
  //   return <NotFound />;
  // }

  // const { cartId, route } = this.state;
  // const { addToBasket, checkOut } = this;
  const contextValue = { cartId, addToBasket, checkOut };
  return (
    <AppContext.Provider value={contextValue}>
      <>
        <Header />
        <RouterProvider router={router}/>
        <PageContainer>
          <RouterProvider router={router}/>
          {/* { this.renderPage() } */}
        </PageContainer>
        <Footer />
      </>
    </AppContext.Provider>
  );

}
