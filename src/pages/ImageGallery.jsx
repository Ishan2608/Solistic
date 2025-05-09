import React from "react";
import Header from "../components/Global/Header";

const HEADER_TITLE="Welcome to Image Gallery"
const HEADER_PARA="Embark on an extraordinary journey through the cosmos."
const HEADER_BG_URL="https://images.unsplash.com/photo-1537420327992-d6e192287183?q=80&w=1376&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

const ImageGallery = () => {
    return (
      <div>
        <Header 
          title={HEADER_TITLE}
          paragraph={HEADER_PARA}
          backgroundImage={HEADER_BG_URL}
        />
      </div>
    );
}
  
export default ImageGallery;