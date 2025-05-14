import React from 'react';

const Header = ({ title, paragraph, backgroundImage }) => {
  // Use default values if props aren't provided
  const headerTitle = title || "Welcome to Space Explorer";
  const headerParagraph = paragraph || "Embark on an extraordinary journey through the cosmos.";
  const bgImage = backgroundImage || "https://images.unsplash.com/photo-1670884307458-4977f638a933?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  // Create inline style for dynamic background image
  const headerStyle = {
    backgroundImage: `url(${bgImage})`
  };

  return (
    <div className="header-container" style={headerStyle}>
      <div className="header-content bold-txt">
        <h1 className="txt-2xl bold-txt">{headerTitle}</h1>
        <p className='txt-md'>{headerParagraph}</p>
      </div>
    </div>
  );
};

export default Header;