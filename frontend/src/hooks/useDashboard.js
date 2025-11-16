/**
 * Custom React Hooks for Dashboard
 */

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook for fetching dashboard data from API
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Object} { data, loading, error, refetch }
 */
export const useDashboardData = (endpoint, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(endpoint, options);
      if (!response.ok) throw new Error('Failed to fetch data');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Hook for auto-refreshing data
 * @param {Function} callback - Function to call on refresh
 * @param {number} interval - Refresh interval in ms (0 to disable)
 */
export const useAutoRefresh = (callback, interval = 0) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (interval === 0) return;

    const tick = () => {
      savedCallback.current();
    };

    const id = setInterval(tick, interval);
    return () => clearInterval(id);
  }, [interval]);
};

/**
 * Hook for local storage state
 * @param {string} key - Storage key
 * @param {*} initialValue - Initial value
 * @returns {Array} [value, setValue]
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

/**
 * Hook for table sorting
 * @param {Array} data - Data to sort
 * @param {Object} defaultSort - Default sort config { key, order }
 * @returns {Object} { sortedData, sortConfig, requestSort }
 */
export const useTableSort = (data, defaultSort = { key: null, order: 'asc' }) => {
  const [sortConfig, setSortConfig] = useState(defaultSort);

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];

    if (aVal < bVal) return sortConfig.order === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.order === 'asc' ? 1 : -1;
    return 0;
  });

  const requestSort = (key) => {
    let order = 'asc';
    if (sortConfig.key === key && sortConfig.order === 'asc') {
      order = 'desc';
    }
    setSortConfig({ key, order });
  };

  return { sortedData, sortConfig, requestSort };
};

/**
 * Hook for pagination
 * @param {Array} data - Data to paginate
 * @param {number} itemsPerPage - Items per page
 * @returns {Object} Pagination state and controls
 */
export const usePagination = (data, itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const goToPage = (page) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  return {
    currentData,
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  };
};

/**
 * Hook for search/filter
 * @param {Array} data - Data to filter
 * @param {Array} searchKeys - Keys to search in
 * @returns {Object} { filteredData, searchTerm, setSearchTerm }
 */
export const useSearch = (data, searchKeys = []) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter(item => {
    if (!searchTerm) return true;

    const term = searchTerm.toLowerCase();
    
    if (searchKeys.length === 0) {
      return JSON.stringify(item).toLowerCase().includes(term);
    }

    return searchKeys.some(key => 
      String(item[key]).toLowerCase().includes(term)
    );
  });

  return { filteredData, searchTerm, setSearchTerm };
};

/**
 * Hook for responsive breakpoint detection
 * @param {number} breakpoint - Breakpoint in px
 * @returns {boolean} Is mobile
 */
export const useResponsive = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
};

/**
 * Hook for widget visibility toggle
 * @param {Object} initialState - Initial visibility state
 * @returns {Object} { visibility, toggleWidget, setVisibility }
 */
export const useWidgetVisibility = (initialState = {}) => {
  const [visibility, setVisibility] = useLocalStorage('widgetVisibility', initialState);

  const toggleWidget = (widgetId) => {
    setVisibility(prev => ({
      ...prev,
      [widgetId]: !prev[widgetId]
    }));
  };

  return { visibility, toggleWidget, setVisibility };
};

/**
 * Hook for dashboard theme
 * @param {string} defaultTheme - Default theme
 * @returns {Object} { theme, setTheme, toggleTheme }
 */
export const useDashboardTheme = (defaultTheme = 'light') => {
  const [theme, setTheme] = useLocalStorage('dashboardTheme', defaultTheme);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return { theme, setTheme, toggleTheme };
};

/**
 * Hook for debounced value
 * @param {*} value - Value to debounce
 * @param {number} delay - Delay in ms
 * @returns {*} Debounced value
 */
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default {
  useDashboardData,
  useAutoRefresh,
  useLocalStorage,
  useTableSort,
  usePagination,
  useSearch,
  useResponsive,
  useWidgetVisibility,
  useDashboardTheme,
  useDebounce,
};
