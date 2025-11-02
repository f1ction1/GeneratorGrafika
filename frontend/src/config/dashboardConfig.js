/**
 * Dashboard Configuration File
 * 
 * Customize your dashboard by editing the values in this file.
 * No need to touch the component code!
 */

// Theme Colors - Customize your color palette
export const THEME_COLORS = {
  primary: '#321fdb',
  success: '#2eb85c',
  warning: '#f9b115',
  danger: '#e55353',
  info: '#39f',
  dark: '#636f83',
  light: '#ebedef',
};

// Dashboard Settings
export const DASHBOARD_CONFIG = {
  // Page settings
  title: 'Dashboard',
  subtitle: "Welcome back! Here's what's happening today.",
  
  // Layout
  refreshButton: true,
  responsiveBreakpoint: 992, // px - when to switch to mobile layout
  
  // Auto-refresh (in milliseconds, set to 0 to disable)
  autoRefresh: 0, // e.g., 30000 for 30 seconds
};

// Stats Configuration - Customize your stat cards
export const STATS_CONFIG = [
  {
    id: 'users',
    title: 'Użytkownicy',
    value: '1,234',
    color: 'primary',
    icon: 'FaUsers', // React Icons name
    change: '+12.5',
    inverse: false,
    enabled: true,
  },
  {
    id: 'tasks',
    title: 'Zadania',
    value: '76',
    color: 'success',
    icon: 'FaTasks',
    change: '+8.2',
    inverse: false,
    enabled: true,
  },
  {
    id: 'performance',
    title: 'Wydajność',
    value: '92%',
    color: 'info',
    icon: 'FaChartLine',
    change: '+3.1',
    inverse: false,
    enabled: true,
  },
  {
    id: 'errors',
    title: 'Błędy',
    value: '3',
    color: 'danger',
    icon: 'FaExclamationTriangle',
    change: '-15.3',
    inverse: false,
    enabled: true,
  },
];

// Progress Bars Configuration
export const PROGRESS_CONFIG = [
  {
    id: 'server',
    label: 'Server Load',
    value: 45,
    color: 'primary',
    animated: true,
    striped: true,
    enabled: true,
  },
  {
    id: 'disk',
    label: 'Disk Usage',
    value: 78,
    color: 'warning',
    animated: true,
    striped: true,
    enabled: true,
  },
  {
    id: 'memory',
    label: 'Memory Usage',
    value: 62,
    color: 'info',
    animated: true,
    striped: true,
    enabled: true,
  },
  {
    id: 'cpu',
    label: 'CPU Usage',
    value: 34,
    color: 'success',
    animated: true,
    striped: true,
    enabled: true,
  },
];

// Widget Visibility - Enable/disable widgets
export const WIDGET_VISIBILITY = {
  stats: true,
  systemPerformance: true,
  recentProjects: true,
  recentActivity: true,
  quickStats: true,
  additionalInfo: true,
};

// Table Configuration
export const TABLE_CONFIG = {
  itemsPerPage: 10,
  striped: true,
  hover: true,
  bordered: false,
  size: 'md', // sm, md, lg
};

// Activity Feed Configuration
export const ACTIVITY_CONFIG = {
  maxItems: 10,
  showTimestamp: true,
  showUserAvatar: false,
};

// Quick Stats Configuration
export const QUICK_STATS_CONFIG = [
  {
    id: 'revenue',
    label: 'Total Revenue',
    value: '$45,678',
    enabled: true,
  },
  {
    id: 'customers',
    label: 'New Customers',
    value: '234',
    enabled: true,
  },
  {
    id: 'orders',
    label: 'Pending Orders',
    value: '18',
    enabled: true,
  },
  {
    id: 'tickets',
    label: 'Support Tickets',
    value: '7',
    enabled: true,
  },
];

// API Endpoints 
export const API_ENDPOINTS = {
  
};

// Date/Time Format
export const DATE_FORMAT = {
  short: 'MMM DD',
  long: 'MMMM DD, YYYY',
  time: 'HH:mm',
};

export default {
  THEME_COLORS,
  DASHBOARD_CONFIG,
  STATS_CONFIG,
  PROGRESS_CONFIG,
  WIDGET_VISIBILITY,
  TABLE_CONFIG,
  ACTIVITY_CONFIG,
  QUICK_STATS_CONFIG,
  API_ENDPOINTS,
  DATE_FORMAT,
};
