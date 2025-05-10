import React from 'react';
import EventsSection from '../components/Events/EventsSection';
import APOD from "../components/APOD"
import Header from '../components/Global/Header';



const HEADER_TITLE = "Solistic";
const HEADER_PARA = "A center for all space enthusiasts throughout the Mutliverse.";
// const HEADER_BG_URL = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZjR2ZWVkc2lhdGViaThzeGhrZWtkY2ZrbTh6c28wdTYzNnpzd3cwbiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/tZqBZPEPUrzuUIELIV/giphy.gif";
// const HEADER_BG_URL = "https://media.giphy.com/media/tdC6N1RKNp4swre2JY/giphy.gif?cid=ecf05e47gysbj1y61yiz7mwdgm73t78kzp6rq2xvjauvoy35&ep=v1_gifs_search&rid=giphy.gif&ct=g";
const HEADER_BG_URL = "https://images.unsplash.com/photo-1529788295308-1eace6f67388?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

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
