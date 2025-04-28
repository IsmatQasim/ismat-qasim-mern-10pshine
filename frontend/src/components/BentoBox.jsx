import React from 'react';

const BentoBox = ({ 
  width = "200px", 
  height = "220px", 
  margin = "0",    
  backgroundColor = "#2e2e2e",
  color="",
  icon, 
  title, 
  paragraph, 
  onClick 
}) => {
  return (
    <div 
      className="bento-box"
      style={{ width, height, margin, backgroundColor , color }}  
      onClick={onClick}
    >
      <div className="bento-header">
        {icon && <span className="bento-icon">{icon}</span>}
        <h2 className="bento-title">{title}</h2>
      </div>
      <p className="bento-paragraph" style={{color}}>{paragraph}</p>
    </div>
  );
};

export default BentoBox;
