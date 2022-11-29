import React from 'react';

export default function PageContainer({ children }) {
  return (
    <div id="page-container">
      <div className="container" id="content">
        { children }
      </div>
    </div>
  );
}
