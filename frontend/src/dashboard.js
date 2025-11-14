/**
 * Dashboard Index - One-stop import for everything dashboard-related
 * 
 * Import everything you need from this single file:
 * import { StatCard, useDashboardData, formatCurrency, SALES_DASHBOARD } from '../dashboard';
 */

// Components
export { default as Badge } from './components/dashboard/Badge';
export { default as Button } from './components/dashboard/Button';
export { default as Card } from './components/dashboard/Card';
export { default as ProgressBar } from './components/dashboard/ProgressBar';
export { default as StatCard } from './components/dashboard/StatCard';
export { default as Table } from './components/dashboard/Table';

// Configuration
export * from './config/dashboardConfig';
export * from './config/dashboardVariations';

// Hooks
export * from './hooks/useDashboard';

// Utilities
export * from './utils/dashboardUtils';

// Default export for convenience
export default {
  // Components
  Badge,
  Button,
  Card,
  ProgressBar,
  StatCard,
  Table,
};
