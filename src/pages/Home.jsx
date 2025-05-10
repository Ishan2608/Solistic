import React from 'react';
import EventsSection from '../components/Events/EventsSection';
import APOD from "../components/APOD"
import Header from '../components/Global/Header';



const HEADER_TITLE = "Solistic";
const HEADER_PARA = "A center for all space enthusiasts throughout the Mutliverse.";
const HEADER_BG_URL = "https://images.unsplash.com/photo-1491466424936-e304919aada7?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

export default function Home() {
  return (
    <main>
      <section className="hero">
        <Header 
          title={HEADER_TITLE}
          paragraph={HEADER_PARA}
          backgroundImage={HEADER_BG_URL}
        />
      </section>
      <section className="apod-section">
        <APOD />
      </section>
      <section className="events-section">
        <EventsSection />
      </section>
    </main>
  );
}
