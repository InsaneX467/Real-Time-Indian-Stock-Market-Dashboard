import { useEffect, useState } from "react";
import { getAllStocks } from "../services/stockApi";


const stocks = [
  "RELIANCE.NS",
  "TCS.NS",
  "INFY.NS",
  "HDFCBANK.NS",
  "MARUTI.NS",
  "SUNPHARMA.NS",
  "BHARTIARTL.NS",
  "KOTAKBANK.NS",
  "LT.NS",
  "ASIANPAINT.NS",
  "AXISBANK.NS",
  "BAJFINANCE.NS"
];

const MarketOverview = ({ selectedStock, setSelectedStock }) => {
  const [marketData, setMarketData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allStocks = await getAllStocks();
        if (!allStocks || allStocks.length === 0) return;

        const mappedData = stocks.map(stock => {
          const found = allStocks.find(s => s.symbol === stock || s.symbol === stock.replace(".NS", ""));
          return {
            symbol: stock.replace(".NS", ""),
            fullSymbol: stock,
            price: found ? found.price : 0,
            change: found ? found.change : 0
          };
        });
        
        setMarketData(mappedData);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };

    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card mb-4">
      <h3 className="section-title">
        Indian Market Overview
      </h3>

      <div className="overview-grid">
        {marketData.map((stock) => {
          const isSelected = selectedStock === stock.fullSymbol;
          return (
          <div
            className={`stock-card ${isSelected ? 'active' : ''}`}
            key={stock.fullSymbol}
            onClick={() => setSelectedStock(stock.fullSymbol)}
            style={{
              backgroundColor: isSelected ? 'rgba(0, 208, 156, 0.2)' : undefined,
              borderColor: isSelected ? 'var(--accent-primary)' : undefined
            }}
          >
            <h4>{stock.symbol}</h4>
            <h5>₹{Number(stock.price).toFixed(2)}</h5>

            <div
              className={
                stock.change >= 0 ? "text-success" : "text-danger"
              }
              style={{ fontWeight: 600, fontSize: "0.875rem" }}
            >
              {stock.change >= 0 ? "▲" : "▼"} {Number(Math.abs(stock.change)).toFixed(2)}%
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
};

export default MarketOverview;