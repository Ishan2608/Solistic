import React from 'react';

const ImageTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'spacex', label: 'SpaceX Launches' },
    { id: 'marsrover', label: 'Mars Rover' },
    { id: 'nasa', label: 'NASA Gallery' },
  ];

  return (
    <div className="image-tabs-container">
      <div className="image-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageTabs;

