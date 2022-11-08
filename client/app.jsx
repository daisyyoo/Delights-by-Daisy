import React from 'react';
import Header from './components/header';
import Footer from './components/footer';
import PageContainer from './pages/pageContainer';

export default class App extends React.Component {
  render() {
    return (
      <>
        <Header />
        <PageContainer />
        <Footer />
      </>
    );
  }
}
