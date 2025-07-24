import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import MarketNavbar from './MarketNavbar';

const Layout = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;

  const marketPaths = [
    '/post',
    '/market-homepage',
    '/product',
    '/message',
    '/edit-profile',
    '/edit-account',
    '/my-listings',
    '/myproduct'
  ];

  const showMarketNavbar = marketPaths.some((p) => path.startsWith(p));

  return (
    <>
      {showMarketNavbar ? <MarketNavbar /> : <Navbar />}
      {children}
    </>
  );
};

export default Layout;
