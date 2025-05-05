// Store user data, token, role, and user ID in memory for faster access
let user = null;
let token = null;
let userRole = null;
let userId = null;  // Store User_id

// Set user, token, role, and User_id after login
export const setUser = (userData, userToken, role, ) => {
  user = userData;
  token = userToken;
  userRole = role;
  userId = id;

  // Persist data in sessionStorage
  sessionStorage.setItem("user", JSON.stringify(userData));
  sessionStorage.setItem("token", userToken);
  sessionStorage.setItem("userRole", role);
  // sessionStorage.setItem("User_id", id); // Store User ID
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

// Get user role (Admin, Vendor, etc.)
export const getUserRole = () => {
  if (!userRole) {
    userRole = sessionStorage.getItem("userRole");
  }
  return userRole;
};

// Get User ID
export const getUserId = () => {
  if (!userId) {
    userId = sessionStorage.getItem("User_id");
  }
  return userId;
};

// Clear user, token, role, and User ID on logout
export const clearUser = () => {
  user = null;
  token = null;
  userRole = null;
  userId = null;

  // Clear sessionStorage
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("userRole");
  sessionStorage.removeItem("User_id");
};
