import { useEffect, useState } from "react";
import { getAllStocks, getBestPerformance } from "../services/stockApi";
import { useNavigate, useOutletContext } from "react-router-dom";

const WatchlistPage = () => {
  const [stocks, setStocks] = useState([]);
  const [bestStocks, setBestStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { setSelectedStock } = useOutletContext();

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const [data, bestData] = await Promise.all([
          getAllStocks(),
          getBestPerformance()
        ]);
        if (data) {
          const sortedStocks = [...data].sort((a, b) => b.change - a.change);
          setStocks(sortedStocks.slice(0, Math.max(0, sortedStocks.length - 5)));
        }
        if (bestData) {
          const sortedBest = [...bestData].sort((a, b) => b.change - a.change).slice(0, 8);
          setBestStocks(sortedBest);
        }
      } catch (error) {
        console.error("Watchlist error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
    const interval = setInterval(fetchWatchlist, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleStockClick = (symbol) => {
    setSelectedStock(symbol);
    navigate("/");
  };

  if (loading) {
    return <div className="p-4 text-center">Loading your watchlist...</div>;
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="section-title mb-0" style={{ fontSize: "1.5rem" }}>10-Year Best Performers</h2>
        <span style={{ color: "var(--text-muted)" }}>{bestStocks.length} Assets</span>
      </div>

      <div className="row g-3">
        {bestStocks.map((stock) => (
          <div className="col-md-6 col-lg-4 col-xl-3" key={stock.symbol}>
            <div 
              className="glass-card h-100 mb-0" 
              style={{ cursor: "pointer", transition: "transform 0.2s ease" }}
              onClick={() => handleStockClick(stock.symbol)}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h4 style={{ margin: 0, fontWeight: 700, color: "var(--text-primary)", fontSize: "1.125rem" }}>
                  {stock.symbol.replace(".NS", "")}
                </h4>
                <div style={{ padding: "4px 8px", backgroundColor: "var(--bg-body)", borderRadius: "6px", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  NSE
                </div>
              </div>
              
              <div>
                <h5 style={{ margin: "0 0 8px 0", fontWeight: 700, color: "var(--text-primary)", fontSize: "1.25rem" }}>
                  ₹{Number(stock.price).toFixed(2)}
                </h5>
                <div
                  className={stock.change >= 0 ? "text-success" : "text-danger"}
                  style={{ fontWeight: 600, fontSize: "0.875rem" }}
                >
                  {stock.change >= 0 ? "▲" : "▼"} {Number(Math.abs(stock.change)).toFixed(2)}%
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4 mt-5">
        <h2 className="section-title mb-0" style={{ fontSize: "1.5rem" }}>Recommended for Today</h2>
        <span style={{ color: "var(--text-muted)" }}>{stocks.length} Assets</span>
      </div>

      <div className="row g-3">
        {stocks.map((stock) => (
          <div className="col-md-6 col-lg-4 col-xl-3" key={stock.symbol}>
            <div 
              className="glass-card h-100 mb-0" 
              style={{ cursor: "pointer", transition: "transform 0.2s ease" }}
              onClick={() => handleStockClick(stock.symbol)}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h4 style={{ margin: 0, fontWeight: 700, color: "var(--text-primary)", fontSize: "1.125rem" }}>
                  {stock.symbol.replace(".NS", "")}
                </h4>
                <div style={{ padding: "4px 8px", backgroundColor: "var(--bg-body)", borderRadius: "6px", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  NSE
                </div>
              </div>
              
              <div>
                <h5 style={{ margin: "0 0 8px 0", fontWeight: 700, color: "var(--text-primary)", fontSize: "1.25rem" }}>
                  ₹{Number(stock.price).toFixed(2)}
                </h5>
                <div
                  className={stock.change >= 0 ? "text-success" : "text-danger"}
                  style={{ fontWeight: 600, fontSize: "0.875rem" }}
                >
                  {stock.change >= 0 ? "▲" : "▼"} {Number(Math.abs(stock.change)).toFixed(2)}%
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WatchlistPage;
