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
      <header className="border-bottom bg-white sticky-top shadow-sm">

        {/* TOP HEADER */}
        <div className="top-header text-center">
          🌐 CỔNG THÔNG TIN ĐIỆN TỬ XÃ TÂN THUẬN ĐÔNG
        </div>

        {/* MAIN HEADER */}
        <div className="container py-3 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3">
            <img src="/hero/logo.png" width={52} height={52} />
            <div>
              <div className="site-title">Cổng thông tin Xã Tân Thuận Đông</div>
              <div className="text-muted small">Tin tức • Dịch vụ hành chính • Thư viện</div>
            </div>
          </div>
        </div>

        {/* MENU */}
        <nav className="navbar navbar-expand-lg bg-white">
          <div className="container">
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#siteNav">
              <span className="navbar-toggler-icon" />
            </button>

            <div className="collapse navbar-collapse" id="siteNav">
              <ul className="navbar-nav mx-auto gap-2">
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
        .top-header {
          background: linear-gradient(90deg, #0d6efd, #00c6ff);
          color: white;
          padding: 8px;
          font-weight: 600;
          letter-spacing: 1px;
          font-size: 15px;
        }

        .site-title {
          font-size: 24px;
          font-weight: 700;
          animation: fadeIn 0.8s ease;
        }

        /* ===== NAV BUTTON ===== */
        .fancy-btn {
          border: 2px solid #e5e7eb;
          border-radius: 999px;
          padding: 10px 20px !important;
          font-size: 16px;
          font-weight: 600;
          background: white;
          color: #333 !important;
          transition: all 0.2s ease;
          text-decoration: none !important;
        }

        /* ===== HOVER ===== */
        .fancy-btn:hover {
          background: #f0f7ff;
          color: #0d6efd !important;
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(0,0,0,0.08);
        }

        /* ===== ACTIVE ===== */
        .nav-link.active {
          background: #0d6efd;
          color: white !important;
          border-color: #0d6efd;
          box-shadow: 0 6px 18px rgba(13,110,253,0.3);
        }

        .nav-link.active:hover {
          background: #0b5ed7;
          color: white !important;
        }

        /* ===== FIX MƯỢT ===== */
        .navbar-nav .nav-link {
          will-change: transform;
          backface-visibility: hidden;
        }

        /* ===== ANIMATION ===== */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}