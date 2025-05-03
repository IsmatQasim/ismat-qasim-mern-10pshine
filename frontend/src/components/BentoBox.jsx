import React from 'react';
import PropTypes from 'prop-types';

const BentoBox = ({ 
  width = "200px", 
  height = "220px", 
  margin = "0",    
  backgroundColor = "#2e2e2e",
  color = "",
  icon, 
  title, 
  paragraph, 
  onClick 
}) => {

  
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      onClick?.(event); 
    }
  };

  return (
    <div 
      className="bento-box"
      style={{ width, height, margin, backgroundColor, color }}
    >
      <button 
        className="bento-button"
        onClick={onClick}         
        onKeyDown={handleKeyDown}
        style={{ all: 'unset', padding: 0, background: 'none', border: 'none' }} 
        aria-label={title} 
      >
        <div className="bento-header">
          {icon && <span className="bento-icon">{icon}</span>}
          <h2 className="bento-title">{title}</h2>
        </div>
        <p className="bento-paragraph" style={{ color }}>{paragraph}</p>
      </button>
    </div>
  );
};

BentoBox.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  margin: PropTypes.string,
  backgroundColor: PropTypes.string,
  color: PropTypes.string,
  icon: PropTypes.node,
  title: PropTypes.string.isRequired,
  paragraph: PropTypes.string.isRequired,
  onClick: PropTypes.func
};

export default BentoBox;
