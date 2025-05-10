import React from 'react'
import Header from "../components/Common/Header";

const HEADER_TITLE = "Welcome to अंतरिक्ष Tutor";
const HEADER_PARA = "Knowledge is power. Only we can give you that power";
const HEADER_BG_URL = "https://images.unsplash.com/photo-1537819191377-d3305ffddce4?q=80&w=1421&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const Tutor = () =>{
  return (
    <Header 
      title={HEADER_TITLE}
      paragraph={HEADER_PARA}
      backgroundImage={HEADER_BG_URL}
    />
  );
}

export default Tutor;
  