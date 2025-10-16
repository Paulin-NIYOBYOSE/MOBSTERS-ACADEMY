import { User } from '@/services/authService';

/**
 * Determines the appropriate dashboard route based on user roles
 * Priority: admin > academy_student > mentorship_student > free (default)
 */
export const getDashboardRoute = (user: User | null): string => {
  if (!user || !user.roles) {
    return '/dashboard';
  }

  // Admin has highest priority
  if (user.roles.includes('admin')) {
    return '/admin';
  }

  // Academy student
  if (user.roles.includes('academy_student')) {
    return '/academy';
  }

  // Mentorship student
  if (user.roles.includes('mentorship_student')) {
    return '/mentorship';
  }

  // Default to free dashboard
  return '/dashboard';
};

/**
 * Gets the dashboard name for display purposes
 */
export const getDashboardName = (user: User | null): string => {
  if (!user || !user.roles) {
    return 'Free Dashboard';
  }

  if (user.roles.includes('admin')) {
    return 'Admin Dashboard';
  }

  if (user.roles.includes('academy_student')) {
    return 'Academy Dashboard';
  }

  if (user.roles.includes('mentorship_student')) {
    return 'Mentorship Dashboard';
  }

  return 'Free Dashboard';
};
