import React from 'react';
import EventsSection from '../components/Events/EventsSection';

export default function Home() {
  return (
    <main>
      <section className="hero">
        <h1>Explore The Universe</h1>
        <p>Discover the latest in space exploration, celestial events, and stunning imagery.</p>
      </section>
      <section className="apod-section">

      </section>
      <section className="events-section">
        <EventsSection />
      </section>
    </main>
  );
}
