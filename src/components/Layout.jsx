import { useMemo } from 'react';
import { Outlet} from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import MarketStrip from './MarketStrip';

const Layout = ({ isDarkMode, toggleDarkMode, selectedStock, setSelectedStock }) => {
  const contextValue = useMemo(
    () => ({ selectedStock, setSelectedStock, isDarkMode }),
    [selectedStock, setSelectedStock, isDarkMode]
  );

  return (
    <div className="app-container">
      <Sidebar />
      <div className="content-wrapper">
        <Navbar
          selectedStock={selectedStock}
          setSelectedStock={setSelectedStock}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />
        <main className="dashboard-main">
          <MarketStrip />
          <div className="container-fluid">
            <Outlet context={contextValue} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;