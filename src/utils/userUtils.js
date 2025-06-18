/**
 * Utility functions for user data handling and display
 */

/**
 * Get the display name for a user with proper fallback handling
 * @param {Object} user - User object from AuthContext
 * @param {string} fallback - Fallback text when user name is not available (default: 'User')
 * @returns {string} - Display name for the user
 */
export const getUserDisplayName = (user, fallback = 'User') => {
  if (!user) return fallback;
  
  // Try different name fields in order of preference
  return user.fullName || user.name || user.displayName || fallback;
};

/**
 * Get a personalized greeting for the user
 * @param {Object} user - User object from AuthContext
 * @param {string} timeOfDay - Time-based greeting ('morning', 'afternoon', 'evening')
 * @returns {string} - Personalized greeting message
 */
export const getUserGreeting = (user, timeOfDay = null) => {
  const name = getUserDisplayName(user, 'there');
  
  if (!timeOfDay) {
    const hour = new Date().getHours();
    if (hour < 12) timeOfDay = 'morning';
    else if (hour < 17) timeOfDay = 'afternoon';
    else timeOfDay = 'evening';
  }
  
  return `Good ${timeOfDay}, ${name}!`;
};

/**
 * Get the user's role with proper capitalization
 * @param {Object} user - User object from AuthContext
 * @param {string} fallback - Fallback role when user role is not available (default: 'Student')
 * @returns {string} - Capitalized user role
 */
export const getUserRole = (user, fallback = 'Student') => {
  if (!user || !user.role) return fallback;
  
  const role = user.role.toLowerCase();
  return role.charAt(0).toUpperCase() + role.slice(1);
};

/**
 * Get the user's first name only
 * @param {Object} user - User object from AuthContext
 * @param {string} fallback - Fallback text when user name is not available (default: 'User')
 * @returns {string} - First name of the user
 */
export const getUserFirstName = (user, fallback = 'User') => {
  const fullName = getUserDisplayName(user, fallback);
  return fullName.split(' ')[0];
};

/**
 * Get a welcome message for the user
 * @param {Object} user - User object from AuthContext
 * @param {string} context - Context for the welcome message ('dashboard', 'profile', 'general')
 * @returns {string} - Welcome message
 */
export const getWelcomeMessage = (user, context = 'general') => {
  const firstName = getUserFirstName(user, 'there');
  
  switch (context) {
    case 'dashboard':
      return `Welcome back, ${firstName}! Continue your learning journey.`;
    case 'profile':
      return `Hello, ${firstName}! Manage your profile and settings here.`;
    case 'settings':
      return `Hi ${firstName}, customize your learning experience.`;
    default:
      return `Welcome, ${firstName}!`;
  }
};

/**
 * Check if user has a complete profile
 * @param {Object} user - User object from AuthContext
 * @returns {boolean} - Whether user has essential profile information
 */
export const hasCompleteProfile = (user) => {
  if (!user) return false;
  
  return !!(
    user.name || user.fullName || user.displayName
  ) && !!user.email;
};

/**
 * Get user initials for avatar fallback
 * @param {Object} user - User object from AuthContext
 * @returns {string} - User initials (max 2 characters)
 */
export const getUserInitials = (user) => {
  const name = getUserDisplayName(user, 'U');
  const nameParts = name.split(' ').filter(part => part.length > 0);
  
  if (nameParts.length === 0) return 'U';
  if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
  
  return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
};
