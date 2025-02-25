
// // src/Auth/auth.js

// // Store user data and token in memory for faster access
// let user = null;
// let token = null;

// // Set user and token after login
// export const setUser = (userData, userToken) => {
//   user = userData;
//   token = userToken;

//   // Persist user and token
//   sessionStorage.setItem("user", JSON.stringify(userData));
//   sessionStorage.setItem("token", userToken);
// };

// // Get user data for components
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

// Store user data and token in memory for faster access
let user = null;
let token = null;
let userRole = null;  // Store "data": "Admin"

// Set user, token, and role after login
export const setUser = (userData, userToken, role) => {
  user = userData;
  token = userToken;
  userRole = role;  // Store role

  // Persist user, token, and role
  sessionStorage.setItem("user", JSON.stringify(userData));
  sessionStorage.setItem("token", userToken);
  sessionStorage.setItem("userRole", role);  // Save role
};

// Get user data for components
export const getUser = () => {
  if (!user) {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) user = JSON.parse(storedUser);
  }
  return user;
};

// Get token for API calls
export const getToken = () => {
  if (!token) {
    token = sessionStorage.getItem("token");
  }
  return token;
};

// Get user role (Admin or other)
export const getUserRole = () => {
  if (!userRole) {
    userRole = sessionStorage.getItem("userRole");
  }
  return userRole;
};

// Clear user, token, and role on logout
export const clearUser = () => {
  user = null;
  token = null;
  userRole = null;

  // Clear sessionStorage
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("userRole");
};
