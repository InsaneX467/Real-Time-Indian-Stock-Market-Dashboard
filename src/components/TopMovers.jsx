import { useEffect, useState } from "react";
import { getAllStocks } from "../services/stockApi";

const Sparkline = ({ data, color }) => {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 80;
  const height = 24;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width={width} height={height} style={{ overflow: "visible", margin: "0 10px" }}>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const TopMovers = () => {
  const [gainers, setGainers] = useState([]);
  const [losers, setLosers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovers = async () => {
      try {
        const stocks = await getAllStocks();
        if (!stocks || stocks.length === 0) return;

        const stockData = stocks.map((s) => {
          let closes = [];
          try {
            const chartData = s.chart?.chart?.result?.[0];
            if (chartData) {
              const rawCloses = chartData.indicators?.quote?.[0]?.close || [];
              closes = rawCloses.filter((c) => c !== null);
            }
          } catch{
            // ignore
          }
          return {
            symbol: s.shortSymbol || s.symbol.replace(".NS", ""),
            change: s.change,
            chartData: closes,
          };
        });

        // Sort descending
        const sorted = [...stockData].sort((a, b) => b.change - a.change);

        setGainers(sorted.slice(0, 5));
        setLosers(sorted.slice(-5).reverse());
      } catch (error) {
        console.error("Top Movers Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovers();
    const interval = setInterval(fetchMovers, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card mb-0">
      {loading ? (
        <div className="text-center py-3">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : (
        <div className="row">
          {/* Gainers */}
          <div className="col-md-6">
            <h3 className="section-title text-success">Best Performers</h3>
            {gainers.map((gainer) => (
              <div className="mover-card d-flex justify-content-between align-items-center" key={gainer.symbol}>
                <span className="watchlist-symbol" style={{ flex: 1 }}>{gainer.symbol}</span>
                <Sparkline data={gainer.chartData} color="#00d09c" />
                <span className="text-success font-weight-bold" style={{ flex: 1, textAlign: "right" }}>
                  +{Number(gainer.change).toFixed(2)}%
                </span>
              </div>
            ))}
          </div>

          {/* Losers */}
          <div className="col-md-6">
            <h3 className="section-title text-danger">Underperforming</h3>
            {losers.map((loser) => (
              <div className="mover-card d-flex justify-content-between align-items-center" key={loser.symbol}>
                <span className="watchlist-symbol" style={{ flex: 1 }}>{loser.symbol}</span>
                <Sparkline data={loser.chartData} color="#ff4b4b" />
                <span className="text-danger font-weight-bold" style={{ flex: 1, textAlign: "right" }}>
                  {Number(loser.change).toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TopMovers;