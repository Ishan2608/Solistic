# Solistic (Work In Progress)

A one stop platform for all space enthusiasts to stay updated on latest trends, news, and event of the cosmos. They also get to explore the solar system in our simulator and explore the image gallery from sources like Hubble and Mars Rover.

The project has started developing as of 28th April 2025 by some college students, enthusiastic about building something... `Cool`.

This is a work in progress and will see major updates over time.

# Backend Things to do.

1. Write Firebase setup code with API in Firebase.js
2. Create User Schema:
```
1. Unique username
2. Email
3. Password
4. Saved Events [list]
5. Saved News [list]
6. Saved Images [list]
```
3. Create Event Schema: 
```
Event Schema:

Unique event ID
Name
Description
Date
Location (optional)
Type (optional)
Feature Image (optional)
Video URL (optional)
```
4. News Schema: 
```
News Schema:

Unique news ID
Title
URL
Summary
Image URL (optional)
Site Name
```
5. Image Schema: ```
Unique image ID
Title
URL
Datetime
Description (optional)
```
6. Go to `AuthContext.jsx` file and using the `useContext()` function, create AuthContext wrapper with the relevant methods such as:
  - Register
  - Login
  - Logout
  - Save Event
  - Save Image
  - Save News

7. Implement the logic using Firebase database.