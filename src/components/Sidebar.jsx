import {
  FaChartLine,
  FaList,
  FaNewspaper,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="sidebar">
      <div className="logo">NEXUS</div>

      <ul className="list-unstyled">
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <li className={location.pathname === "/" ? "active" : ""}>
            <FaChartLine /> Explore
          </li>
        </Link>

        <Link to="/watchlist" style={{ textDecoration: "none", color: "inherit" }}>
          <li className={location.pathname === "/watchlist" ? "active" : ""}>
            <FaList /> Watchlist
          </li>
        </Link>

        <Link to="/news" style={{ textDecoration: "none", color: "inherit" }}>
          <li className={location.pathname === "/news" ? "active" : ""}>
            <FaNewspaper /> News
          </li>
        </Link>
      </ul>
    </div>
  );
};

export default Sidebar;