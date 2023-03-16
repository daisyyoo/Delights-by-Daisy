import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './header';
import Footer from './footer';

export default function PageContainer() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}
