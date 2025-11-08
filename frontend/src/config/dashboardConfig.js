/**
 * Dashboard Configuration File
 * 
 * Customize your dashboard by editing the values in this file.
 * No need to touch the component code!
 */

// Theme Colors - Dopasowane do strony startowej
export const THEME_COLORS = {
  primary: '#11998e',      // Główny zielony
  success: '#38ef7d',      // Jasny zielony
  warning: '#fda085',      // Pomarańczowy
  danger: '#e55353',       // Czerwony (kontrast)
  info: '#4facfe',         // Niebieski
  dark: '#2c3e50',         // Ciemny granat
  light: '#ebedef',        // Jasny szary
  gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', // Główny gradient
};

// Dashboard Settings
export const DASHBOARD_CONFIG = {
  // Page settings
  title: 'Panel Główny',
  subtitle: 'Witaj! Oto podsumowanie twojej firmy.',
  
  // Layout
  refreshButton: true,
  responsiveBreakpoint: 992, // px - when to switch to mobile layout
  
  // Auto-refresh (in milliseconds, set to 0 to disable)
  autoRefresh: 0, // e.g., 60000 for 1 minute
};

// Stats Configuration - Kluczowe statystyki dla pracodawcy
export const STATS_CONFIG = [
  {
    id: 'employees',
    title: 'Pracownicy',
    value: '24',
    color: 'primary',
    icon: 'FaUsers',
    change: '+2',
    inverse: false,
    enabled: true,
  },
  {
    id: 'today-shifts',
    title: 'Dzisiejsze zmiany',
    value: '8',
    color: 'success',
    icon: 'FaCalendarAlt',
    change: '0',
    inverse: false,
    enabled: true,
  },
  {
    id: 'pending-requests',
    title: 'Oczekujące wnioski',
    value: '3',
    color: 'warning',
    icon: 'FaClipboardList',
    change: '+1',
    inverse: false,
    enabled: true,
  },
  {
    id: 'unassigned-shifts',
    title: 'Nieobsadzone zmiany',
    value: '2',
    color: 'danger',
    icon: 'FaExclamationTriangle',
    change: '-1',
    inverse: true,
    enabled: true,
  },
];

// Progress Bars Configuration - Obsadzenie zmian w tygodniu
export const PROGRESS_CONFIG = [
  {
    id: 'monday',
    label: 'Poniedziałek',
    value: 100,
    color: 'success',
    animated: false,
    striped: false,
    enabled: true,
  },
  {
    id: 'tuesday',
    label: 'Wtorek',
    value: 100,
    color: 'success',
    animated: false,
    striped: false,
    enabled: true,
  },
  {
    id: 'wednesday',
    label: 'Środa',
    value: 87,
    color: 'warning',
    animated: true,
    striped: true,
    enabled: true,
  },
  {
    id: 'thursday',
    label: 'Czwartek',
    value: 75,
    color: 'warning',
    animated: true,
    striped: true,
    enabled: true,
  },
  {
    id: 'friday',
    label: 'Piątek',
    value: 62,
    color: 'danger',
    animated: true,
    striped: true,
    enabled: true,
  },
  {
    id: 'saturday',
    label: 'Sobota',
    value: 50,
    color: 'danger',
    animated: true,
    striped: true,
    enabled: true,
  },
];

// Widget Visibility - Enable/disable widgets
export const WIDGET_VISIBILITY = {
  stats: true,
  weeklyScheduleCoverage: true,
  upcomingShifts: true,
  recentActivity: true,
  quickActions: true,
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

// Quick Stats Configuration - Dodatkowe statystyki
export const QUICK_STATS_CONFIG = [
  {
    id: 'total-hours',
    label: 'Godziny w tym miesiącu',
    value: '1,248',
    enabled: true,
  },
  {
    id: 'active-employees',
    label: 'Aktywni pracownicy',
    value: '22',
    enabled: true,
  },
  {
    id: 'completed-shifts',
    label: 'Zrealizowane zmiany',
    value: '156',
    enabled: true,
  },
  {
    id: 'pending-approvals',
    label: 'Do zatwierdzenia',
    value: '5',
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
