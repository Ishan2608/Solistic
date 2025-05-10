import React from "react";
import Header from "../components/Common/Header";

const HEADER_TITLE = "Welcome to Space पत्रिका";
const HEADER_PARA = "Stay updated on all stars through the cosmos.";
const HEADER_BG_URL = "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const News = () => {
    return (
      <Header 
        title={HEADER_TITLE}
        paragraph={HEADER_PARA}
        backgroundImage={HEADER_BG_URL}
      />
    );
  }
  
export default News;