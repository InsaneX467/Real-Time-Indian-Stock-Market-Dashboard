import MarketOverview from "../components/MarketOverview";
import TopMovers from "../components/TopMovers";
import StockChart from "../components/StockChart";
import MarketIndices from "../components/MarketIndices";
import Footer from "../components/Footer";
import { useOutletContext } from "react-router-dom";

const Dashboard = () => {
  const { selectedStock, setSelectedStock, isDarkMode } = useOutletContext();

  return (
    <>
      <MarketIndices />

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="glass-card mb-0">
            <h3 className="section-title">{selectedStock.replace('.NS', '')} Trend</h3>
            <div className="chart-wrapper">
              <StockChart symbol={selectedStock} isDarkMode={isDarkMode} />
            </div>
          </div>

          <div className="mt-4">
            <TopMovers />
          </div>
        </div>

        <div className="col-lg-4">
          <MarketOverview
            selectedStock={selectedStock}
            setSelectedStock={setSelectedStock}
          />
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default Dashboard;