import { useEffect } from 'react';
import { useLocation } from 'wouter';

const ScrollToTop = ({ children }: { children: React.ReactNode }) => {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [location]);

  return <>{children}</>;
};

export default ScrollToTop;
