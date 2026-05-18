import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const STOCKS = [
  "RELIANCE.NS", "TCS.NS", "INFY.NS", "HDFCBANK.NS", "WIPRO.NS", "TATASTEEL.NS",
  "HCLTECH.NS", "SBIN.NS", "MARUTI.NS", "SUNPHARMA.NS", "BHARTIARTL.NS", "KOTAKBANK.NS",
  "LT.NS", "ASIANPAINT.NS", "AXISBANK.NS", "BAJFINANCE.NS"
];

const Navbar = ({
  selectedStock,
  setSelectedStock,
  isDarkMode,
  toggleDarkMode,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.trim()) {
      const filtered = STOCKS.filter((stock) =>
        stock.toLowerCase().includes(value.toLowerCase().replace(".ns", ""))
      );
      setSuggestions(filtered);
      setShowDropdown(true);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  const handleSelectStock = (symbol) => {
    setSelectedStock(symbol);
    setInputValue("");
    setShowDropdown(false);
    navigate("/"); // ensure we navigate to the dashboard
  };

  const handleSearchClick = () => {
    if (!inputValue.trim()) return;
    
    let formatted = inputValue.toUpperCase();
    if (!formatted.endsWith(".NS")) {
      formatted += ".NS";
    }

    if (STOCKS.includes(formatted)) {
      handleSelectStock(formatted);
    } else {
      // Show no results in dropdown
      setSuggestions([]);
      setShowDropdown(true);
    }
  };

  return (
    <div className="navbar-custom">
      {/* Left */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div>
          <h3 style={{
            fontSize: "1.3rem",
            fontWeight: "800",
            letterSpacing: "-0.5px",
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}>
            <span style={{ color: "var(--text-primary)" }}>Market</span>
            <span style={{ 
              background: "linear-gradient(90deg, var(--accent-primary) 0%, #008f6b 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
             }}>Dashboard</span>
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
            <span className="live-indicator" style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "var(--success-color)",
              boxShadow: "0 0 8px var(--success-color)",
              display: "inline-block"
            }}></span>
            <p style={{
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              margin: 0,
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}>
              Live NSE Data
            </p>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="nav-right">
        {/* Search */}
        <div className="search-box" ref={dropdownRef} style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="Search NSE stock..."
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => {
              if (inputValue.trim()) setShowDropdown(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearchClick();
              }
            }}
          />

          <button onClick={handleSearchClick}>
            Search
          </button>

          {/* Autocomplete Dropdown */}
          {showDropdown && inputValue.trim() && (
            <div 
              className="search-dropdown" 
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                borderRadius: "8px",
                marginTop: "8px",
                zIndex: 1000,
                maxHeight: "250px",
                overflowY: "auto",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
              }}
            >
              {suggestions.length > 0 ? (
                suggestions.map((stock) => (
                  <div
                    key={stock}
                    onClick={() => handleSelectStock(stock)}
                    style={{
                      padding: "10px 15px",
                      cursor: "pointer",
                      borderBottom: "1px solid var(--border-color)",
                      color: "var(--text-primary)",
                      fontWeight: 600,
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = "var(--bg-body)"}
                    onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                  >
                    {stock.replace(".NS", "")}
                  </div>
                ))
              ) : (
                <div style={{ padding: "10px 15px", color: "var(--text-muted)", textAlign: "center" }}>
                  No results found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Dark Mode Toggle */}
        <button className="theme-toggle-btn" onClick={toggleDarkMode}>
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
    </div>
  );
};

export default Navbar;