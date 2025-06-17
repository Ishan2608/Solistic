import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import {
  doc, collection, getDocs, query, where,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { auth, db } from '../api/Firebase';

// Create the AuthContext
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [savedImages, setSavedImages] = useState([]);
  const [savedNews, setSavedNews] = useState([]);
  const [savedEvents, setSavedEvents] = useState([]);

  // Helper function to fetch saved items data based on IDs
  const fetchSavedItems = async (itemIds, collectionName) => {
    if (!itemIds || itemIds.length === 0) {
      return [];
    }

    try {
      // Firestore `in` query has a limit of 10, so we need to batch queries
      const itemQueries = [];
      for (let i = 0; i < itemIds.length; i += 10) {
        const chunk = itemIds.slice(i, i + 10);
        itemQueries.push(query(collection(db, collectionName), where('id', 'in', chunk)));
      }

      const itemSnapshots = await Promise.all(itemQueries.map(q => getDocs(q)));
      const items = itemSnapshots.flatMap(snapshot => snapshot.docs.map(doc => doc.data()));
      return items;
    } catch (error) {
      console.error(`Error fetching ${collectionName}:`, error);
      return [];
    }
  };

  // Helper functions to fetch saved item data for specific collections
  const fetchSavedImages = async (userId) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const savedImageIds = userDoc.data().savedImageIds || [];
        const images = await fetchSavedItems(savedImageIds, 'images');
        setSavedImages(images);
      }
    } catch (error) {
      console.error('Error fetching saved images:', error);
      setSavedImages([]);
    }
  };

  const fetchSavedNews = async (userId) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const savedNewsIds = userDoc.data().savedNewsIds || [];
        const news = await fetchSavedItems(savedNewsIds, 'news');
        setSavedNews(news);
      }
    } catch (error) {
      console.error('Error fetching saved news:', error);
      setSavedNews([]);
    }
  };

  const fetchSavedEvents = async (userId) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const savedEventIds = userDoc.data().savedEventIds || [];
        const events = await fetchSavedItems(savedEventIds, 'events');
        setSavedEvents(events);
      }
    } catch (error) {
      console.error('Error fetching saved events:', error);
      setSavedEvents([]);
    }
  };

  // Check auth state on component mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);

      if (firebaseUser) {
        try {
          // User is signed in
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              username: userData.username,
              savedImageIds: userData.savedImageIds || [],
              savedNewsIds: userData.savedNewsIds || [],
              savedEventIds: userData.savedEventIds || []
            });

            // Fetch saved items data
            await Promise.all([
              fetchSavedImages(firebaseUser.uid),
              fetchSavedNews(firebaseUser.uid),
              fetchSavedEvents(firebaseUser.uid)
            ]);
          } else {
            // Create user document if it doesn't exist
            const newUserData = {
              email: firebaseUser.email,
              savedImageIds: [],
              savedNewsIds: [],
              savedEventIds: [],
              createdAt: new Date().toISOString()
            };

            await setDoc(doc(db, 'users', firebaseUser.uid), newUserData);

            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              savedImageIds: [],
              savedNewsIds: [],
              savedEventIds: []
            });

            // Clear saved items arrays
            setSavedImages([]);
            setSavedNews([]);
            setSavedEvents([]);
          }

          setIsLoggedIn(true);
        } catch (error) {
          console.error('Error setting up user:', error);
          setUser(null);
          setIsLoggedIn(false);
        }
      } else {
        // User is signed out
        setUser(null);
        setIsLoggedIn(false);
        setSavedImages([]);
        setSavedNews([]);
        setSavedEvents([]);
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Register function
  const register = async (email, password, username) => {
    try {
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Create user document in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        username,
        email,
        savedImageIds: [],
        savedNewsIds: [],
        savedEventIds: [],
        createdAt: new Date().toISOString()
      });

      return { success: true };
    } catch (error) {
      console.error('Registration error:', error.code, error.message, error);
      return {
        success: false,
        error: error.message || 'Registration failed'
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error.code, error.message, error);
      return {
        success: false,
        error: error.message || 'Login failed'
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save News function - FIXED VERSION
  const saveNews = async (newsData) => {
    if (!isLoggedIn || !user) {
      alert('Please login to save news');
      return false;
    }

    try {
      // Convert ID to string to ensure compatibility with Firestore
      const newsId = String(newsData.id);

      // Add the news article to the 'news' collection
      const newsRef = doc(db, 'news', newsId);
      await setDoc(newsRef, { ...newsData, id: newsId }, { merge: true });

      // Add the news id to the user's savedNewsIds array
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        savedNewsIds: arrayUnion(newsId)
      });

      // Update local state
      setUser(prev => ({
        ...prev,
        savedNewsIds: [...(prev.savedNewsIds || []), newsId]
      }));

      setSavedNews(prev => [...prev, { ...newsData, id: newsId }]);

      return true;
    } catch (error) {
      console.error('Error saving news:', error);
      return false;
    }
  };

  // Save Image function - FIXED VERSION
  const saveImage = async (imageData) => {
    if (!isLoggedIn || !user) {
      alert('Please login to save images');
      return false;
    }

    try {
      // Convert ID to string to ensure compatibility with Firestore
      const imageId = String(imageData.id);

      // Add the image to the 'images' collection
      const imageRef = doc(db, 'images', imageId);
      await setDoc(imageRef, { ...imageData, id: imageId }, { merge: true });

      // Add the image id to the user's savedImageIds array
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        savedImageIds: arrayUnion(imageId)
      });

      // Update local state
      setUser(prev => ({
        ...prev,
        savedImageIds: [...(prev.savedImageIds || []), imageId]
      }));

      setSavedImages(prev => [...prev, { ...imageData, id: imageId }]);

      return true;
    } catch (error) {
      console.error('Error saving image:', error);
      return false;
    }
  };

  // Save Event function - FIXED VERSION
  const saveEvent = async (eventData) => {
    if (!isLoggedIn || !user) {
      alert('Please login to save events');
      return false;
    }

    try {
      // Convert ID to string to ensure compatibility with Firestore
      const eventId = String(eventData.id);

      // Add the event to the 'events' collection
      const eventRef = doc(db, 'events', eventId);
      await setDoc(eventRef, { ...eventData, id: eventId }, { merge: true });

      // Add the event id to the user's savedEventIds array
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        savedEventIds: arrayUnion(eventId)
      });

      // Update local state
      setUser(prev => ({
        ...prev,
        savedEventIds: [...(prev.savedEventIds || []), eventId]
      }));

      setSavedEvents(prev => [...prev, { ...eventData, id: eventId }]);

      return true;
    } catch (error) {
      console.error('Error saving event:', error);
      return false;
    }
  };

  // Remove saved image
  const removeSavedImage = async (imageId) => {
    if (!isLoggedIn || !user) return false;

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        savedImageIds: arrayRemove(imageId)
      });

      // Update local state
      setUser(prev => ({
        ...prev,
        savedImageIds: (prev.savedImageIds || []).filter(id => id !== imageId)
      }));

      setSavedImages(prev => prev.filter(img => img.id !== imageId));

      return true;
    } catch (error) {
      console.error('Error removing saved image:', error);
      return false;
    }
  };

  // Remove saved news
  const removeSavedNews = async (newsId) => {
    if (!isLoggedIn || !user) return false;

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        savedNewsIds: arrayRemove(newsId)
      });

      // Update local state
      setUser(prev => ({
        ...prev,
        savedNewsIds: (prev.savedNewsIds || []).filter(id => id !== newsId)
      }));

      setSavedNews(prev => prev.filter(news => news.id !== newsId));

      return true;
    } catch (error) {
      console.error('Error removing saved news:', error);
      return false;
    }
  };

  // Remove saved event
  const removeSavedEvent = async (eventId) => {
    if (!isLoggedIn || !user) return false;

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        savedEventIds: arrayRemove(eventId)
      });

      // Update local state
      setUser(prev => ({
        ...prev,
        savedEventIds: (prev.savedEventIds || []).filter(id => id !== eventId)
      }));

      setSavedEvents(prev => prev.filter(event => event.id !== eventId));

      return true;
    } catch (error) {
      console.error('Error removing saved event:', error);
      return false;
    }
  };

  // Check if item is saved
  const isImageSaved = (imageId) => {
    return user?.savedImageIds?.includes(imageId) || false;
  };

  const isNewsSaved = (newsId) => {
    return user?.savedNewsIds?.includes(newsId) || false;
  };

  const isEventSaved = (eventId) => {
    return user?.savedEventIds?.includes(eventId) || false;
  };

  // Context value
  const value = {
    user,
    isLoggedIn,
    isLoading,
    savedImages,
    savedNews,
    savedEvents,
    register,
    login,
    logout,
    saveImage,
    saveNews,
    saveEvent,
    removeSavedImage,
    removeSavedNews,
    removeSavedEvent,
    isImageSaved,
    isNewsSaved,
    isEventSaved,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;