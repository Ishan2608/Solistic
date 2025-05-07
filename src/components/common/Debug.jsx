// src/components/common/Debug.js
import React from 'react';

// A simple component to display debug information during development
const Debug = ({ data, title = 'Debug Info' }) => {
  const style = {
    padding: '10px',
    margin: '10px 0',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: '#f8f8f8',
    fontFamily: 'monospace',
    fontSize: '12px',
    overflow: 'auto',
    maxHeight: '300px'
  };
  
  const titleStyle = {
    fontWeight: 'bold',
    marginBottom: '5px'
  };

  return (
    <div style={style}>
      <div style={titleStyle}>{title}</div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default Debug;