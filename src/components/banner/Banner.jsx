import React from 'react';
import './Banner.css';

const Banner = ({ 
  imageSrc, 
  altText = "Publicité", 
  size = "md", 
  className = "", 
  linkUrl = "#",
  isSticky = false 
}) => {
  return (
    <div className={`banner-ad banner-ad-${size} ${isSticky ? 'sticky-banner' : ''} ${className}`}>
      <a href={linkUrl} target="_blank" rel="noopener noreferrer">
        <img 
          src={imageSrc} 
          alt={altText}
          className="banner-image"
        />
      </a>
    </div>
  );
};

export default Banner;