import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();

app.use(cors());

const STOCKS = [
  "RELIANCE.NS",
  "TCS.NS",
  "INFY.NS",
  "HDFCBANK.NS",
  "WIPRO.NS",
  "TATASTEEL.NS",
  "HCLTECH.NS",
  "SBIN.NS",
  "MARUTI.NS",
  "SUNPHARMA.NS",
  "BHARTIARTL.NS",
  "KOTAKBANK.NS",
  "LT.NS",
  "ASIANPAINT.NS",
  "AXISBANK.NS",
  "BAJFINANCE.NS",
  "ITC.NS"
];

// Cache
let cache = {
  data: null,
  timestamp: null,
};

let bestPerformanceCache = {
  data: null,
  timestamp: null,
};

const INDICES = [
  "^NSEI",
  "^BSESN",
  "^NSEBANK"
];

const INDICES_MAP = {
  "^NSEI": "NIFTY 50",
  "^BSESN": "SENSEX",
  "^NSEBANK": "BANKNIFTY"
};

let indicesCache = {
  data: null,
  timestamp: null,
};

// Fetch one stock safely
const fetchStock = async (symbol) => {
  try {
    const url =
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}` +
      `?range=7d&interval=1d`;

    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },

      timeout: 10000,
    });

    const result =
      response.data?.chart?.result?.[0];

    if (!result) {
      return null;
    }

    const closes =
      result.indicators?.quote?.[0]
        ?.close || [];

    const validCloses = closes.filter(
      (price) => price !== null
    );

    if (validCloses.length < 2) {
      return null;
    }

    const currentPrice =
      validCloses[
        validCloses.length - 1
      ];

    const previousPrice =
      validCloses[
        validCloses.length - 2
      ];

    const changePercent =
      ((currentPrice -
        previousPrice) /
        previousPrice) *
      100;

    return {
      symbol,
      shortSymbol:
        symbol.replace(".NS", ""),

      price: currentPrice,

      change: changePercent,

      chart: response.data,
    };
  } catch (error) {
    console.log(
      `Failed: ${symbol}`,
      error.message
    );

    return null;
  }
};

const fetch10YearStock = async (symbol) => {
  try {
    const url =
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}` +
      `?range=10y&interval=1mo`;

    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },

      timeout: 10000,
    });

    const result =
      response.data?.chart?.result?.[0];

    if (!result) {
      return null;
    }

    const closes =
      result.indicators?.quote?.[0]
        ?.close || [];

    const validCloses = closes.filter(
      (price) => price !== null
    );

    if (validCloses.length < 2) {
      return null;
    }

    const currentPrice =
      validCloses[
        validCloses.length - 1
      ];

    const previousPrice =
      validCloses[0];

    const changePercent =
      ((currentPrice -
        previousPrice) /
        previousPrice) *
      100;

    return {
      symbol,
      shortSymbol:
        symbol.replace(".NS", ""),

      price: currentPrice,

      change: changePercent,

      chart: response.data,
    };
  } catch (error) {
    console.log(
      `Failed: ${symbol}`,
      error.message
    );

    return null;
  }
};

//
// BACKGROUND FETCH TO PREVENT RATE LIMITS
//
let isFetching = false;

const updateData = async () => {
  if (isFetching) return;
  isFetching = true;

  try {
    console.log("Background fetching stock data to prevent rate limits...");
    
    let newStockData = [];
    let newBestPerformanceData = [];
    let newIndicesData = [];
    
    for (const symbol of INDICES) {
      const data = await fetchStock(symbol);
      if (data) {
        data.name = INDICES_MAP[symbol];
        newIndicesData.push(data);
      }
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    for (const symbol of STOCKS) {
      const data = await fetchStock(symbol);
      if (data) newStockData.push(data);
      
      // Delay to avoid overwhelming Yahoo Finance
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const bestData = await fetch10YearStock(symbol);
      if (bestData) newBestPerformanceData.push(bestData);
      
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    const now = Date.now();
    cache = {
      data: newStockData,
      timestamp: now,
    };
    
    bestPerformanceCache = {
      data: newBestPerformanceData.sort((a, b) => b.change - a.change).slice(0, 8),
      timestamp: now,
    };

    indicesCache = {
      data: newIndicesData,
      timestamp: now,
    };
    console.log("Background fetch complete.");
  } catch (error) {
    console.error("Background fetch error:", error);
  } finally {
    isFetching = false;
  }
};

// Initial fetch and interval (every 2 minutes)
updateData();
setInterval(updateData, 120000);

//
// ✅ FETCH ALL STOCKS
//
app.get("/api/stocks", (req, res) => {
  if (cache.data) {
    return res.json(cache.data);
  }
  // Fallback if data is not yet available
  res.json([]);
});

//
// ✅ FETCH INDICES
//
app.get("/api/indices", (req, res) => {
  if (indicesCache.data) {
    return res.json(indicesCache.data);
  }
  res.json([]);
});

//
// ✅ FETCH SINGLE STOCK CHART
//
app.get(
  "/api/chart/:symbol",
  async (req, res) => {
    try {
      const { symbol } = req.params;
      const range = req.query.range || "7d";
      const interval = req.query.interval || "1d";

      const url =
        `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}` +
        `?range=${range}&interval=${interval}`;

      const response =
        await axios.get(url, {
          headers: {
            "User-Agent":
              "Mozilla/5.0",
          },

          timeout: 10000,
        });

      res.json(response.data);
    } catch (error) {
      console.error(`Failed to fetch chart data for ${req.params.symbol}:`, error.message);

      res.status(500).json({
        error:
          "Failed to fetch chart data",
      });
    }
  }
);

//
// BEST 10 YEAR STOCKS
//
app.get(
  "/api/best-performance",
  (req, res) => {
    if (bestPerformanceCache.data) {
      return res.json(bestPerformanceCache.data);
    }
    // Fallback if data is not yet available
    res.json([]);
  }
);

app.listen(5000, () => {
  console.log(
    "✅ Strong backend running on port 5000"
  );
});