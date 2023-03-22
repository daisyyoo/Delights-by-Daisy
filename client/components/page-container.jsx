import React from 'react';
import { Outlet } from 'react-router-dom';

// const styles = {
//   style: {
//     height: '90vh'
//   }
// };

export default function PageContainer() {
  return (
    <Outlet />
  );
}
