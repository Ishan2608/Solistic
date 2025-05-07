import React from 'react';
import EventsSection from '../components/Events/EventsSection';
import APOD from "../components/APOD"
import HomeHeader from '../components/HomeHeader';

export default function Home() {
  return (
    <main>
      <section className="hero">
        <HomeHeader />
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
