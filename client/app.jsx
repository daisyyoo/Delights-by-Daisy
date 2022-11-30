import React from 'react';
import jwtDecode from 'jwt-decode';
import Header from './components/header';
import Footer from './components/footer';
import { parseRoute } from './lib';
import AppContext from './lib/app-context';
import PageContainer from './components/page-container';
import NotFound from './pages/not-found';
import Home from './pages/home';
import Catalog from './pages/catalog';
import ProductDetails from './pages/products';
import Basket from './pages/basket';
import StripeCheckout from './pages/stripe';
import ConfirmationPage from './pages/confirmation-page';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cartId: null,
      route: parseRoute(window.location.hash),
      loading: false
    };
    this.addToBasket = this.addToBasket.bind(this);
    this.checkOut = this.checkOut.bind(this);
    this.handleLoader = this.handleLoader.bind(this);
  }

  componentDidMount() {
    window.addEventListener('hashchange', event => {
      const route = parseRoute(window.location.hash);
      this.setState({ route });
    });
    const token = window.localStorage.getItem('basketToken');
    const cartId = token ? jwtDecode(token) : null;
    this.setState({ cartId });
  }

  handleLoader() {
    if (!this.state.loading) {
      this.setState({ loading: true });
    } else if (this.state.loading) {
      this.setState({ loading: false });
    }
  }

  addToBasket(result) {
    const { cartId, token } = result;
    window.localStorage.setItem('basketToken', token);
    this.setState({ cartId });
  }

  checkOut() {
    window.localStorage.removeItem('basketToken');
    this.setState({ cartId: null });
  }

  renderPage() {
    const { route } = this.state;
    if (route.path === '') {
      return <Home />;
    }
    if (route.path === 'cookies') {
      return <Catalog />;
    }
    if (route.path === 'cookie') {
      const cookieId = route.params.get('cookieId');
      return <ProductDetails cookieId={cookieId} />;
    }
    if (route.path === 'myBasket') {
      return <Basket />;
    }
    if (route.path === 'checkout') {
      return <StripeCheckout />;
    }
    if (route.path === 'confirmationPage') {
      return <ConfirmationPage />;
    }
    return <NotFound />;
  }

  render() {
    const { cartId, route, loading } = this.state;
    const { addToBasket, checkOut, handleLoader } = this;
    const contextValue = { cartId, route, loading, addToBasket, checkOut, handleLoader };
    return (
      <AppContext.Provider value={contextValue}>
        <>

          <Header />
          <PageContainer>
            { this.renderPage() }
          </PageContainer>
          <Footer />
        </>
      </AppContext.Provider>
    );
  }
}
