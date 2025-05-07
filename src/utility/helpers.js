// src/utils/helpers.js

/**
 * Truncates text to a specified number of words
 * @param {string} text - The text to truncate
 * @param {number} wordLimit - Maximum number of words to include
 * @returns {string} - The truncated text with "..." appended if shortened
 */
export const truncateText = (text, wordLimit = 80) => {
    if (!text) return '';
    
    const words = text.split(" ");
    if (words.length <= wordLimit) {
      return text;
    } else {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
  };
  
  /**
   * Format a date string to a more readable format
   * @param {string} dateString - ISO date string
   * @returns {string} - Formatted date
   */
  export const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  /*
   * Simple debounce function to limit function calls
   * @param {function} func - The function to debounce
   * @param {number} wait - Time to wait in milliseconds
   * @returns {function} - Debounced function
  */
  export const debounce = (func, wait = 300) => {
    let timeout;
    
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };