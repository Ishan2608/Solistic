import React, { useState, useEffect } from 'react';
import { fetchEventsForMonth } from '../../api/spaceAPI';


// If you don't have a LoadingSpinner component, use this simple one
const SimpleLoadingSpinner = () => (
  <div className="loading">Loading calendar events...</div>
);

const Calendar = ({ onEventSelect }) => {
  // For debugging
  console.log("Calendar onEventSelect prop:", onEventSelect);
  
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [events, setEvents] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const eventData = await fetchEventsForMonth(year, month);
        console.log("Fetched event data:", eventData);
        setEvents(eventData);
        setError(null);
      } catch (err) {
        console.error("Error loading events:", err);
        setError('Failed to load events. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [year, month]);

  // Calculate calendar grid details
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handleDateClick = (day) => {
    console.log("Date clicked:", day);
    console.log("Events for day:", events[day]);
    
    if (events[day]) {
      setSelectedDay(day);
      
      // Check if onEventSelect is a function before calling it
      if (typeof onEventSelect === 'function') {
        console.log("Calling onEventSelect with:", events[day]);
        onEventSelect(events[day]);
      } else {
        console.error("onEventSelect is not a function:", onEventSelect);
      }
    }
  };

  const handleMonthChange = (e) => {
    setMonth(parseInt(e.target.value));
    setSelectedDay(null); // Reset selection when month changes
  };

  const handleYearChange = (e) => {
    setYear(parseInt(e.target.value));
    setSelectedDay(null); // Reset selection when year changes
  };

  return (
    <div className="calendar-container">
      <div className="calendar-controls">
        <select id="month" value={month} onChange={handleMonthChange}>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>
        
        <select id="year" value={year} onChange={handleYearChange}>
          {Array.from({ length: 10 }, (_, i) => (
            <option key={year - 5 + i} value={year - 5 + i}>
              {year - 5 + i}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <SimpleLoadingSpinner />
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="calendar" id="calendar">
          {/* Weekday headers */}
          {weekdays.map((day) => (
            <div key={day} className="weekday">
              {day}
            </div>
          ))}

          {/* Empty cells for days before the first day of the month */}
          {Array.from({ length: firstDay }, (_, i) => (
            <div key={`empty-${i}`} className="date empty"></div>
          ))}

          {/* Calendar days */}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const hasEvent = !!events[day];
            const isSelected = selectedDay === day;
            
            return (
              <div
                key={`day-${day}`}
                className={`date ${hasEvent ? 'event' : ''} ${isSelected ? 'selected' : ''}`}
                onClick={() => handleDateClick(day)}
              >
                {day}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Calendar;