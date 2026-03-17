import React from 'react';
import Flipbook from '../components/Flipbook';

const FlipbookDemo = () => {
  return (
    <div className="flipbook-wrapper-fullscreen">
      <Flipbook 
        coverImg="/img/cover.jpg"
        leftPageImg="/img/left-page.jpg"
        rightPageImg="/img/right-page.jpg"
      />
    </div>
  );
};

export default FlipbookDemo;
