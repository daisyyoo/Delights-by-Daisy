import React from 'react';
import Header from './components/header';
import Footer from './components/footer';
import { parseRoute } from './lib';
import PageContainer from './components/page-container';
import NotFound from './pages/not-found';
// import Home from './pages/home';
import Catalog from './pages/catalog';
import ProductDetails from './pages/products';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash)
    };
  }

  componentDidMount() {
    window.addEventListener('hashchange', event => {
      const route = parseRoute(window.location.hash);
      this.setState({ route });
    });
  }

  renderPage() {
    const { route } = this.state;

    // if (route.path === '') {
    //   return <Home />;
    // }
    if (route.path === 'cookies') {
      return <Catalog />;
    }
    if (route.path === 'cookies' && route.params.includes('cookieId')) {
      const cookieId = route.params.get('cookieId');
      return <ProductDetails cookieId={cookieId} />;
    }
    return <NotFound />;
  }

  render() {
    return (
      <>
        <Header />
        <PageContainer>
          { this.renderPage() }
        </PageContainer>
        <Footer />
      </>
    );
  }
}
