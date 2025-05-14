import React, { useState } from 'react';
import Calendar from './Calendar';
import EventCard from './EventCard';


const EventsSection = () => {
  console.log("EventsSection rendering");
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Define the event handler function
  const handleEventSelect = (event) => {
    // console.log("Event selected in EventsSection:", event);
    setSelectedEvent(event);
  };

  // console.log("handleEventSelect type:", typeof handleEventSelect);

  return (
    <section className="events-section">
      <div className="container">
        <h2>Upcoming Events</h2>
        <div className="events-content">
          <div className="calendar-column">
            {/* Pass the handler function to Calendar */}
            <Calendar 
              onEventSelect={handleEventSelect} 
            />
          </div>
          <div className="event-card-column">
            <EventCard event={selectedEvent} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;