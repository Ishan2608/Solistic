import React from "react";
import Header from "../components/Global/Header";
import ImageGallerySection from "../components/ImageGallery/ImageGallerySection";
import "../styles/gallery.css";

const HEADER_TITLE = "Welcome to Image Gallery";
const HEADER_PARA = "Embark on an extraordinary journey through the cosmos.";
const HEADER_BG_URL = "https://images.unsplash.com/photo-1491466424936-e304919aada7?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";


const ImageGallery = () => {
  return (
    <div className="image-gallery-page">
      <Header 
        title={HEADER_TITLE}
        paragraph={HEADER_PARA}
        backgroundImage={HEADER_BG_URL}
      />
      <div className="content-container">
        <h2 className="section-title">Explore Space Imagery</h2>
        <p className="section-description">
          Browse through stunning images from various space agencies and missions. Select a category from the tabs below to view different collections.
        </p>
        <ImageGallerySection />
      </div>
    </div>
  );
};
  
export default ImageGallery;