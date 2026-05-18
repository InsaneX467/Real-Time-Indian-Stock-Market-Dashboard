import { useEffect, useState } from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

import { Line } from "react-chartjs-2";

import { getChartData } from "../services/stockApi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const StockChart = ({ symbol, isDarkMode }) => {
  const [chartData, setChartData] = useState(null);
  const [timeRange, setTimeRange] = useState({ label: "1D", range: "1d", interval: "5m" });

  const textColor = isDarkMode ? "#b8b8b8" : "#7c7e8c";
  const tooltipBg = isDarkMode ? "#1e1e1e" : "#ffffff";
  const tooltipText = isDarkMode ? "#f5f5f5" : "#44475b";
  const tooltipBorder = isDarkMode ? "#2d2d2d" : "#e8e9eb";

  useEffect(() => {
    let intervalId;

    const fetchChart = async () => {
      try {
        const data = await getChartData(symbol, timeRange.range, timeRange.interval);

        if (!data || !data.chart || !data.chart.result) {
          console.error("Invalid API response");
          return;
        }

        const result = data.chart.result[0];

        if (!result) {
          console.error("No chart result found");
          return;
        }


        let timestamps = result.timestamp || [];
        let closes = result.indicators.quote[0].close || [];

        if (!timestamps.length || !closes.length) return;

        if (timeRange.label === "1W") {
          const filteredTimestamps = [];
          const filteredCloses = [];
          const days = {};
          
          timestamps.forEach((ts, index) => {
            const dateStr = new Date(ts * 1000).toDateString();
            if (!days[dateStr]) days[dateStr] = [];
            days[dateStr].push({ ts, close: closes[index] });
          });

          Object.values(days).forEach((dayPoints) => {
            if (dayPoints.length >= 2) {
              filteredTimestamps.push(dayPoints[0].ts);
              filteredCloses.push(dayPoints[0].close);
              filteredTimestamps.push(dayPoints[dayPoints.length - 1].ts);
              filteredCloses.push(dayPoints[dayPoints.length - 1].close);
            } else if (dayPoints.length === 1) {
              filteredTimestamps.push(dayPoints[0].ts);
              filteredCloses.push(dayPoints[0].close);
            }
          });
          
          timestamps = filteredTimestamps;
          closes = filteredCloses;
        }

        const firstClose = closes.find(c => c !== null) || 0;
        const lastClose = closes[closes.length - 1] || 0;
        const isPositive = lastClose >= firstClose;

        const chartColor = isPositive ? "#00d09c" : "#ff4b4b";
        const chartBg = isPositive ? "rgba(0, 208, 156, 0.15)" : "rgba(255, 75, 75, 0.15)";

        const labels = timestamps.map((time) => {
          const date = new Date(time * 1000);
          if (timeRange.label === "1D") {
            return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
          } else if (timeRange.label === "1Y" || timeRange.label === "5Y") {
            return date.toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
          } else {
            return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
          }
        });

        setChartData({
          labels,
          datasets: [
            {
              label: `${symbol.replace(".NS", "")} Price`,
              data: closes,
              borderColor: chartColor,
              backgroundColor: chartBg,
              tension: 0,
              borderWidth: 2,
              pointRadius: 0,
              pointHoverRadius: 4,
              fill: true,
            },
          ],
        });
      } catch (error) {
        console.error("Chart Error:", error);
      }
    };

    if (symbol) {
      fetchChart();
      intervalId = setInterval(fetchChart, 60000); // ✅ refresh every 60s
    }

    return () => clearInterval(intervalId);
  }, [symbol, timeRange]);

  const ranges = [
    { label: "1D", range: "1d", interval: "5m" },
    { label: "1W", range: "7d", interval: "15m" },
    { label: "1M", range: "1mo", interval: "1d" },
    { label: "3M", range: "3mo", interval: "1d" },
    { label: "1Y", range: "1y", interval: "1wk" },
    { label: "5Y", range: "5y", interval: "1mo" },
  ];

  const getTicksLimit = (label) => {
    switch (label) {
      case "1D": return 10;
      case "1W": return 7;
      case "1M": return 31;
      case "3M": return 15;
      case "1Y": return 12;
      case "5Y": return 5;
      default: return 10;
    }
  };

  if (!chartData) {
    return (
      <div className="text-center py-3">
        <div className="spinner-border text-primary" role="status">
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="chart-controls mb-3 text-end">
        {ranges.map((r) => (
          <button
            key={r.label}
            className={timeRange.label === r.label ? "active" : ""}
            onClick={() => setTimeRange(r)}
            style={{ marginLeft: '8px' }}
          >
            {r.label}
          </button>
        ))}
      </div>

      <Line
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: {
              bottom: 15,
              left: 0,
              right: 0,
              top: 10
            }
          },
          plugins: {
            legend: {
              display: true,
            },
            tooltip: {
              backgroundColor: tooltipBg,
              titleColor: tooltipText,
              bodyColor: tooltipText,
              borderColor: tooltipBorder,
              borderWidth: 1,
              padding: 12,
              callbacks: {
                label: function (context) {
                  return `₹${context.raw}`;
                },
              },
            },
          },
          scales: {
            x: {
              ticks: {
                maxTicksLimit: getTicksLimit(timeRange.label),
                maxRotation: 0,
                minRotation: 0,
                align: 'inner',
                font: {
                  size: 11
                },
                color: textColor
              },
              grid: {
                display: false,
                drawBorder: false
              }
            },
            y: {
              ticks: {
                callback: function (value) {
                  return `₹${value}`;
                },
                font: {
                  size: 11
                },
                color: textColor
              },
              grid: {
                display: false,
                drawBorder: false
              }
            },
          },
        }}
      />
    </>
  );
};

export default StockChart;