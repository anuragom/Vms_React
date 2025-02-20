

// let user = null; // Store user data in memory
// let token = null; // Store token in memory

// // Set user and token after login
// export const setUser = (userData, userToken) => {
//   user = userData;
//   token = userToken;

//   // Persist user and token
//   sessionStorage.setItem("user", JSON.stringify(userData));
//   sessionStorage.setItem("token", userToken);
// };


// // Get user for components
// export const getUser = () => {
//   // Fallback to sessionStorage if user is null
//   if (!user) {
//     const storedUser = sessionStorage.getItem('user');
//     if (storedUser) user = JSON.parse(storedUser);
//   }
//   return user;
// };

// // Get token for API calls
// export const getToken = () => {
//   // Fallback to sessionStorage if token is null
//   if (!token) {
//     token = sessionStorage.getItem('token');
//   }
//   return token;
// };

// // Clear user and token on logout
// export const clearUser = () => {
//   user = null;
//   token = null;

//   // Clear sessionStorage
//   sessionStorage.removeItem('user');
//   sessionStorage.removeItem('token');
// };


// src/Auth/auth.js
// let token = null;

// // Set token after login
// export const setToken = (userToken) => {
//   token = userToken;
//   sessionStorage.setItem('token', userToken);
// };

// // Get token for API calls
// export const getToken = () => {
//   if (!token) {
//     token = sessionStorage.getItem('token');
//   }
//   return token;
// };

// // Clear token on logout
// export const clearToken = () => {
//   token = null;
//   sessionStorage.removeItem('token');
// };

// src/Auth/auth.js

// Store user data and token in memory for faster access
let user = null;
let token = null;

// Set user and token after login
export const setUser = (userData, userToken) => {
  user = userData;
  token = userToken;

  // Persist user and token
  sessionStorage.setItem("user", JSON.stringify(userData));
  sessionStorage.setItem("token", userToken);
};

// Get user data for components
export const getUser = () => {
  // Fallback to sessionStorage if user is null
  if (!user) {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) user = JSON.parse(storedUser);
  }
  return user;
};

// Get token for API calls
export const getToken = () => {
  // Fallback to sessionStorage if token is null
  if (!token) {
    token = sessionStorage.getItem('token');
  }
  return token;
};

// Clear user and token on logout
export const clearUser = () => {
  user = null;
  token = null;

  // Clear sessionStorage
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('token');
};
