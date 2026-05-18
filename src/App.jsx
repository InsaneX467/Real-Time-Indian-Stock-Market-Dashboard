import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import WatchlistPage from "./pages/WatchlistPage";
import News from "./components/news";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved === "true" || (saved === null && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  const [selectedStock, setSelectedStock] = useState("RELIANCE.NS");

  useEffect(() => {
    localStorage.setItem("darkMode", isDarkMode);
    if (!isDarkMode) {
      document.body.classList.add("light-theme");
    } else {
      document.body.classList.remove("light-theme");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={
            <Layout 
              isDarkMode={isDarkMode} 
              toggleDarkMode={toggleDarkMode} 
              selectedStock={selectedStock}
              setSelectedStock={setSelectedStock}
            />
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="watchlist" element={<WatchlistPage />} />
          <Route path="news" element={<News />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;