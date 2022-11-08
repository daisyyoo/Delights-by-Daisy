import React from 'react';
import Header from './components/header';
import Footer from './components/footer';
import { parseRoute } from './lib';
import PageContainer from './components/page-container';
import NotFound from './pages/not-found';
import Home from './pages/home';
import Catalog from './pages/catalog';

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
    if (route.path === '') {
      return <Home />;
    }
    if (route.path === 'catalog') {
      return <Catalog />;
    }
    // if (route.path === 'products') {
    //   const productId = route.params.get('productId');
    //   return <ProductDetails productId={productId} />;
    // }
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
