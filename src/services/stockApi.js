import axios from "axios";

// Fetch dashboard stocks
export const getAllStocks = async () => {
  try {
    const res = await axios.get(
      "http://localhost:5000/api/stocks"
    );

    return res.data;
  } catch (error) {
    console.error(
      "Stocks API Error:",
      error.message
    );

    return [];
  }
};

// Fetch market indices
export const getMarketIndices = async () => {
  try {
    const res = await axios.get(
      "http://localhost:5000/api/indices"
    );

    return res.data;
  } catch (error) {
    console.error(
      "Indices API Error:",
      error.message
    );
    return [];
  }
};

// Fetch best performance 10-year stocks
export const getBestPerformance = async () => {
  try {
    const res = await axios.get(
      "http://localhost:5000/api/best-performance"
    );

    return res.data;
  } catch (error) {
    console.error(
      "Best Performance API Error:",
      error.message
    );

    return [];
  }
};


// Get one stock price/change
export const getQuote = async (
  symbol
) => {
  try {
    const stocks = await getAllStocks();

    const stock = stocks.find(
      (s) => s.symbol === symbol
    );

    if (!stock) {
      return {
        c: 0,
        dp: 0,
      };
    }

    return {
      c: stock.price,
      dp: stock.change,
    };
  } catch (error) {
    console.error(
      "Quote API Error:",
      error.message
    );

    return {
      c: 0,
      dp: 0,
    };
  }
};

// Fetch chart dynamically for searched stock
export const getChartData = async (
  symbol,
  range = "7d",
  interval = "1d"
) => {
  try {
    const res = await axios.get(
      `http://localhost:5000/api/chart/${symbol}?range=${range}&interval=${interval}`
    );

    return res.data;
  } catch (error) {
    console.error(
      "Chart Data Error:",
      error.message
    );

    return null;
  }
};