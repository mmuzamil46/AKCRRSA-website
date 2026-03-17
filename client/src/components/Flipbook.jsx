import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Flipbook.css';

const Flipbook = ({ 
  coverImg = "/img/cover.jpg", 
  leftPageImg = "/img/left-page.jpg", 
  rightPageImg = "/img/right-page.jpg",
  title = "Doctoral Performance Award"
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleBook = () => setIsOpen(!isOpen);

  return (
    <div className="flipbook-container">
      <div 
        className={`flipbook-perspective ${isOpen ? 'is-open' : ''}`}
        onClick={toggleBook}
      >
        {/* Shadow that changes with opening */}
        <div className="flipbook-shadow"></div>

        <div className="flipbook-inner">
          {/* Inside Left Page (Static) */}
          <div className="page inside-left">
            <div className="page-content">
              <img src={leftPageImg} alt="Amharic Praise" />
              <div className="page-crease"></div>
            </div>
          </div>

          {/* Inside Right Page (Static) */}
          <div className="page inside-right">
            <div className="page-content">
              <img src={rightPageImg} alt="Certificate" />
              <div className="page-crease"></div>
            </div>
          </div>

          {/* Cover Page (Animated) */}
          <motion.div 
            className="page cover"
            initial={false}
            animate={{ rotateY: isOpen ? -180 : 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            style={{ transformOrigin: "left center", transformStyle: "preserve-3d" }}
          >
            {/* Front of Cover */}
            <div className="cover-front">
              <div className="leather-texture"></div>
              <img src={coverImg} alt={title} className="cover-image" />
              <div className="gold-trim"></div>
            </div>

            {/* Back of Cover (Visible when open) */}
            <div className="cover-back">
              <div className="leather-texture"></div>
              <div className="page-content back-content">
                 {/* Re-using left-page texture or a blank premium paper for the back of the cover */}
                 <div className="premium-paper"></div>
              </div>
              <div className="gold-trim"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Flipbook;
