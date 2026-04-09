import { NavLink, Outlet } from 'react-router-dom'

function NavItem({ to, children }) {
  return (
    <li className="nav-item">
      <NavLink
        className={({ isActive }) => `nav-link fancy-btn ${isActive ? 'active' : ''}`}
        to={to}
      >
        {children}
      </NavLink>
    </li>
  )
}

export default function SiteLayout() {
  return (
    <div className="min-vh-100 d-flex flex-column">
      <header className="site-header sticky-top">

        {/* TOP HEADER */}
        <div className="top-header text-center">
          🌐 CỔNG THÔNG TIN ĐIỆN TỬ XÃ TÂN THUẬN ĐÔNG
        </div>

        {/* MAIN HEADER */}
        <div className="container main-header py-4 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3 brand-wrap">
            <img src="/hero/logo.png" width={52} height={52} />
            <div>
              <div className="site-title">Cổng thông tin Xã Tân Thuận Đông</div>
              <div className="text-muted small">Tin tức • Dịch vụ hành chính • Thư viện</div>
            </div>
          </div>
        </div>

        {/* MENU */}
        <nav className="navbar navbar-expand-lg bg-white site-nav-shell">
          <div className="container">
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#siteNav" aria-label="Mở menu điều hướng">
              <span className="navbar-toggler-icon" />
            </button>

            <div className="collapse navbar-collapse" id="siteNav">
              <ul className="navbar-nav mx-auto gap-2 nav-pills-wrap">
                <NavItem to="/">🏠 Trang chủ</NavItem>
                <NavItem to="/gioi-thieu">Giới thiệu</NavItem>
                <NavItem to="/tin-tuc">Tin tức</NavItem>
                <NavItem to="/tham-quan">Tham quan</NavItem>
                <NavItem to="/dac-san">Đặc sản</NavItem>
                <NavItem to="/dich-vu">Dịch vụ</NavItem>
                <NavItem to="/thu-vien">Thư viện</NavItem>
                <NavItem to="/lien-he">Liên hệ</NavItem>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow-1">
        <Outlet />
      </main>

      <footer className="border-top bg-white">
        <div className="container py-4 small text-muted">
          <div className="d-flex flex-column flex-md-row justify-content-between gap-2">
            <div>
              <div className="fw-semibold text-dark">UBND Xã Tân Thuận Đông</div>
              <div>Địa chỉ: Số 39, đường số 1, xã Tân Thuận Đông</div>
              <div>Điện thoại: 02773898112</div>
            </div>
            <div className="text-md-end">© {new Date().getFullYear()} Xã Tân Thuận Đông</div>
          </div>
        </div>
      </footer>

      {/* STYLE VIP FIX */}
      <style>{`
        .site-header {
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          background: #fff;
          box-shadow: 0 8px 24px rgba(11, 18, 32, 0.06);
        }

        .top-header {
          background: linear-gradient(90deg, #0d6efd, #00c6ff);
          color: white;
          padding: 8px 10px;
          font-weight: 600;
          letter-spacing: 0.4px;
          font-size: 14px;
        }

        .main-header {
          min-height: 98px;
        }

        .brand-wrap {
          animation: slideInDown 0.45s ease-out;
        }

        .site-title {
          font-size: 40px;
          font-weight: 700;
          line-height: 1.1;
          color: #111827;
          animation: fadeIn 0.45s ease;
          margin-bottom: 2px;
        }

        .site-nav-shell {
          border-top: 1px solid rgba(0, 0, 0, 0.06);
          padding-bottom: 12px;
        }

        .nav-pills-wrap {
          align-items: center;
        }

        .fancy-btn {
          border: 2px solid #e5e7eb;
          border-radius: 999px;
          padding: 10px 24px !important;
          font-size: 16px;
          font-weight: 600;
          background: white;
          color: #3f454e !important;
          transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease, color 0.2s ease;
          text-decoration: none !important;
          position: relative;
          overflow: hidden;
          white-space: nowrap;
          box-shadow: 0 2px 0 rgba(17, 24, 39, 0.02) inset;
          animation: navReveal 0.38s ease both;
        }

        .nav-item:nth-child(1) .fancy-btn { animation-delay: 0.03s; }
        .nav-item:nth-child(2) .fancy-btn { animation-delay: 0.06s; }
        .nav-item:nth-child(3) .fancy-btn { animation-delay: 0.09s; }
        .nav-item:nth-child(4) .fancy-btn { animation-delay: 0.12s; }
        .nav-item:nth-child(5) .fancy-btn { animation-delay: 0.15s; }
        .nav-item:nth-child(6) .fancy-btn { animation-delay: 0.18s; }
        .nav-item:nth-child(7) .fancy-btn { animation-delay: 0.21s; }
        .nav-item:nth-child(8) .fancy-btn { animation-delay: 0.24s; }

        .fancy-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(120% 160% at 20% 0%, rgba(13, 110, 253, 0.14), transparent 58%);
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .fancy-btn:hover {
          background: #f0f7ff;
          color: #0d6efd !important;
          transform: translateY(-1px);
          box-shadow: 0 10px 20px rgba(13, 110, 253, 0.12);
        }

        .fancy-btn:hover::before {
          opacity: 1;
        }

        .fancy-btn.active {
          background: linear-gradient(180deg, #2a7cf7, #0d6efd);
          color: white !important;
          border-color: #0d6efd;
          box-shadow: 0 12px 24px rgba(13, 110, 253, 0.35);
          transform: translateY(-1px);
        }

        .fancy-btn.active::after {
          content: '';
          position: absolute;
          left: 16px;
          right: 16px;
          bottom: 6px;
          height: 3px;
          border-radius: 999px;
          background: linear-gradient(90deg, rgba(255, 255, 255, 0), #20c997, rgba(255, 255, 255, 0));
        }

        .fancy-btn.active:hover {
          background: linear-gradient(180deg, #2573ee, #0b5ed7);
          color: white !important;
        }

        .navbar-nav .nav-link {
          will-change: transform;
          backface-visibility: hidden;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideInDown {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes navReveal {
          from { opacity: 0; transform: translateY(8px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @media (max-width: 1400px) {
          .site-title {
            font-size: 34px;
          }

          .fancy-btn {
            font-size: 15px;
            padding: 10px 18px !important;
          }
        }

        @media (max-width: 991.98px) {
          .main-header {
            min-height: 88px;
            padding-top: 16px !important;
            padding-bottom: 12px !important;
          }

          .site-title {
            font-size: 27px;
          }

          .site-nav-shell {
            padding-bottom: 0;
          }

          .nav-pills-wrap {
            padding: 10px 0 16px;
          }

          .fancy-btn {
            font-size: 15px;
            display: inline-flex;
            justify-content: center;
          }
        }

        @media (max-width: 767.98px) {
          .top-header {
            font-size: 12px;
          }

          .main-header {
            min-height: 76px;
          }

          .site-title {
            font-size: 21px;
          }

          .fancy-btn {
            width: 100%;
            font-size: 15px;
            padding: 10px 14px !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .brand-wrap,
          .site-title,
          .fancy-btn {
            animation: none;
          }

          .fancy-btn {
            transition: none;
          }
        }
      `}</style>
    </div>
  )
}