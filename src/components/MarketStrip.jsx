import { useEffect, useState } from "react";
import { getAllStocks } from "../services/stockApi";
import "../index.css";

const MarketStrip = () => {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    const fetchStripData = async () => {
      try {
        const data = await getAllStocks();
        if (data && data.length > 0) {
          setStocks(data);
        }
      } catch (error) {
        console.error("MarketStrip fetch error:", error);
      }
    };

    fetchStripData();
    const intervalId = setInterval(fetchStripData, 60000);
    return () => clearInterval(intervalId);
  }, []);

  if (stocks.length === 0) return null;

  return (
    <div className="market-strip-container" style={{ overflow: "hidden", whiteSpace: "nowrap", borderBottom: "1px solid var(--border-color)", padding: "8px 0", marginBottom: "16px", backgroundColor: "var(--bg-body)" }}>
      <div className="market-strip-content d-inline-block" style={{ animation: "scroll-left 30s linear infinite" }}>
        {/* Double the list to make infinite scroll smooth */}
        {[...stocks, ...stocks].map((stock, idx) => (
          <span key={idx} className="strip-item mx-4" style={{ fontSize: "0.875rem", fontWeight: 600 }}>
            <span style={{ color: "var(--text-primary)" }}>{stock.symbol.replace(".NS", "")} </span>
            <span style={{ color: "var(--text-secondary)" }}>₹{Number(stock.price).toFixed(2)} </span>
            <span className={stock.change >= 0 ? "text-success" : "text-danger"}>
              {stock.change >= 0 ? "▲" : "▼"}{Number(Math.abs(stock.change)).toFixed(2)}%
            </span>
          </span>
        ))}
      </div>
      <style>
        {`
          @keyframes scroll-left {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .market-strip-container:hover .market-strip-content {
            animation-play-state: paused !important;
          }
        `}
      </style>
    </div>
  );
};

export default MarketStrip;
