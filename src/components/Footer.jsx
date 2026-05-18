import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-5 pt-4 pb-4 border-top" style={{ borderColor: 'var(--border-color)' }}>
      <div className="row">
        <div className="col-md-4 mb-4">
          <h5 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>NEXUS</h5>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            A modern, real-time Indian stock market dashboard built for students, professionals, and everyone in between. Track your favorite NSE and BSE stocks seamlessly.
          </p>
        </div>

        <div className="col-md-2 offset-md-2 mb-4">
          <h6 style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>Company</h6>
          <ul className="list-unstyled" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            <li className="mb-2"><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>About Us</a></li>
            <li className="mb-2"><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Pricing</a></li>
            <li className="mb-2"><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Careers</a></li>
          </ul>
        </div>

        <div className="col-md-4 mb-4">
          <h6 style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>Disclaimer</h6>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            Nexus is a simulated dashboard for educational purposes. It is not a registered broker or investment advisor. All investments are subject to market risks. Please read all scheme-related documents carefully before investing.
          </p>
        </div>
      </div>

      <div className="text-center mt-4 pt-3 border-top" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', borderColor: 'var(--border-color)' }}>
        © {new Date().getFullYear()} Nexus Dashboard. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
