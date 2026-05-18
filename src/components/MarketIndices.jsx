import React, { useState, useEffect } from 'react';
import { getMarketIndices } from '../services/stockApi';

const MarketIndices = () => {
  const [indicesData, setIndicesData] = useState([]);

  useEffect(() => {
    const fetchIndices = async () => {
      const data = await getMarketIndices();
      if (data && data.length > 0) {
        const formattedData = data.map(idx => {
          const previousPrice = idx.price / (1 + idx.change / 100);
          const pointChange = idx.price - previousPrice;
          return {
            name: idx.name,
            value: Number(idx.price).toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 }),
            change: (pointChange >= 0 ? '+' : '') + pointChange.toFixed(2),
            percent: Math.abs(idx.change).toFixed(2),
            isUp: idx.change >= 0
          };
        });
        setIndicesData(formattedData);
      }
    };
    
    fetchIndices();
    const interval = setInterval(fetchIndices, 60000);
    return () => clearInterval(interval);
  }, []);

  if (indicesData.length === 0) {
    return <div className="d-flex gap-4 mb-4" style={{ overflowX: 'auto', paddingBottom: '4px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Loading live indices...</div>;
  }

  return (
    <div className="d-flex gap-4 mb-4" style={{ overflowX: 'auto', paddingBottom: '4px' }}>
      {indicesData.map((idx) => (
        <div key={idx.name} className="d-flex flex-column" style={{ minWidth: '160px' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>{idx.name}</span>
          <div className="d-flex align-items-center gap-2 mt-1">
            <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{idx.value}</span>
            <span className={idx.isUp ? "text-success" : "text-danger"} style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
              {idx.change} ({idx.percent}%)
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MarketIndices;
