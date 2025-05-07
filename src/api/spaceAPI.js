// src/api/spaceAPI.js
// Centralized API service for the space website

// API endpoints
const APOD_URL = "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY";
const SPACEDEV_EVENTS_BASE_URL = "https://lldev.thespacedevs.com/2.2.0/event";
const SPACE_NEWS_API = "https://api.spaceflightnewsapi.net/v4/articles";
const NASA_IMAGES_API = "https://images-api.nasa.gov/search";
const MARS_ROVER_API = "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos";
const SPACEX_API = "https://api.spacexdata.com/v4/launches/past";

// Astronomy Picture of the Day
export const fetchAPOD = async () => {
  try {
    const response = await fetch(APOD_URL);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error("Error fetching APOD:", error);
    throw error;
  }
};

// Space Events
export const fetchEventsForMonth = async (year, month) => {
  try {
    const url = `${SPACEDEV_EVENTS_BASE_URL}?month=${month}&year=${year}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    const results = data.results;
    
    // Format events by date for calendar usage
    const eventsByDate = results.reduce((acc, event) => {
      const date = new Date(event.date).getDate();
      acc[date] = event;
      return acc;
    }, {});
    
    return eventsByDate;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

// Latest Space News
export const fetchLatestNews = async () => {
  try {
    const url = `${SPACE_NEWS_API}?_limit=1&_sort=published_at:DESC`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    return data.results[0]; // Get the first article
  } catch (error) {
    console.error("Error fetching latest news:", error);
    throw error;
  }
};

// Organization-specific news
export const fetchOrganizationNews = async (organization) => {
  try {
    const url = `${SPACE_NEWS_API}?title_contains=${organization.toLowerCase()}&_limit=1&_sort=published_at:DESC`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    return data.results[0]; // Get the first article
  } catch (error) {
    console.error(`Error fetching ${organization} news:`, error);
    throw error;
  }
};

// Multiple news articles
export const fetchMultipleNews = async (limit = 10) => {
  try {
    const url = `${SPACE_NEWS_API}?_limit=${limit}&_sort=published_at:DESC`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching news articles:", error);
    throw error;
  }
};

// NASA Image Gallery
export const fetchNASAImages = async (query = "galaxy") => {
  try {
    const url = `${NASA_IMAGES_API}?q=${query}&media_type=image`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    return data.collection.items;
  } catch (error) {
    console.error("Error fetching NASA images:", error);
    throw error;
  }
};

// Mars Rover Images
export const fetchMarsRoverImages = async (sol = 100, camera = null, page = 1) => {
  try {
    let url = `${MARS_ROVER_API}?sol=${sol}&page=${page}&api_key=DEMO_KEY`;
    if (camera) url += `&camera=${camera}`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    return data.photos;
  } catch (error) {
    console.error("Error fetching Mars Rover images:", error);
    throw error;
  }
};

// SpaceX Launch Images
export const fetchSpaceXImages = async () => {
  try {
    const response = await fetch(SPACEX_API);
    if (!response.ok) throw new Error('Network response was not ok');
    
    const launches = await response.json();
    // Filter launches with images
    return launches.filter(launch => launch.links.flickr.original.length > 0);
  } catch (error) {
    console.error("Error fetching SpaceX images:", error);
    throw error;
  }
};