import { useEffect, useState } from "react";
import axios from "axios";

const News = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const apiKey = import.meta.env.VITE_NEWS_API_KEY;
      const response = await axios.get(
        `https://newsapi.org/v2/everything?q=stock%20market%20india&language=en&sortBy=publishedAt&apiKey=${apiKey}`
      );

      const formattedNews = response.data.articles.map((item) => ({
        title: item.title,
        category: item.source.name,
        time: new Date(item.publishedAt).toLocaleDateString(),
        description: item.description,
        image: item.urlToImage,
        url: item.url,
      }));

      setNewsList(formattedNews);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading latest market news...</div>;
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="section-title mb-0" style={{ fontSize: "1.5rem" }}>
          Latest Market News
        </h2>
        <span style={{ color: "var(--text-muted)" }}>
          Live updates from Indian stock market
        </span>
      </div>

      <div className="row g-4">
        {newsList.map((news, index) => (
          <div className="col-md-6 col-lg-4" key={index}>
            <div
              className="glass-card h-100 mb-0 d-flex flex-column"
              style={{ transition: "transform 0.2s ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              {news.image && (
                <div style={{ height: "180px", overflow: "hidden", borderRadius: "12px", marginBottom: "16px" }}>
                  <img
                    src={news.image}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              )}

              <div className="d-flex justify-content-between align-items-center mb-2">
                <span
                  style={{
                    padding: "4px 10px",
                    backgroundColor: "var(--accent-light)",
                    color: "var(--accent-primary)",
                    borderRadius: "6px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                  }}
                >
                  {news.category || "News"}
                </span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  {news.time}
                </span>
              </div>

              <h4
                style={{
                  margin: "8px 0",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  fontSize: "1.125rem",
                  lineHeight: "1.4",
                }}
              >
                {news.title}
              </h4>

              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "0.875rem",
                  flexGrow: 1,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {news.description}
              </p>

              <a
                href={news.url}
                target="_blank"
                rel="noreferrer"
                style={{ textDecoration: "none", marginTop: "16px" }}
              >
                <button
                  className="btn w-100"
                  style={{
                    backgroundColor: "var(--bg-body)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--border-color)",
                    fontWeight: 600,
                    borderRadius: "8px",
                  }}
                >
                  Read Full Article
                </button>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default News;
