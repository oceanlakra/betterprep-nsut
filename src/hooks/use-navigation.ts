import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useNavigationRefresh() {
  const location = useLocation();

  useEffect(() => {
    // Force a re-render when location changes
    window.scrollTo(0, 0);
  }, [location]);
} 