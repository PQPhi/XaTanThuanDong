import { NavLink, Outlet } from 'react-router-dom'

function NavItem({ to, children }) {
  return (
    <li className="nav-item">
      <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to={to}>
        {children}
      </NavLink>
    </li>
  )
}

export default function SiteLayout() {
  return (
    <div className="min-vh-100 d-flex flex-column">
      <header className="border-bottom bg-white sticky-top">
        <div className="container py-2 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <img
              src="/hero/logo.png"
              alt="Logo Xã Tân Thuận Đông"
              className="site-logo"
              width={42}
              height={42}
              loading="eager"
            />
            <div>
              <div className="fw-bold">Cổng thông tin Xã Tân Thuận Đông</div>
              <div className="text-muted small">Tin tức • Dịch vụ hành chính • Thư viện</div>
            </div>
          </div>
          {/* Người dân không cần đăng nhập. Khu vực quản trị truy cập trực tiếp qua /admin/login */}
        </div>
        <nav className="navbar navbar-expand-lg navbar-light bg-white">
          <div className="container">
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#siteNav">
              <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="siteNav">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <NavItem to="/">Trang chủ</NavItem>
                <NavItem to="/gioi-thieu">Giới thiệu</NavItem>
                <NavItem to="/tin-tuc">Tin tức</NavItem>
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
              <div>Địa chỉ: Số 39, đường số 1, xã Tân Thuận Đông, thành phố Cao Lãnh, tỉnh Đồng Tháp</div>
              <div>Điện thoại: 02773898112</div>
            </div>
            <div className="text-md-end">© {new Date().getFullYear()} Xã Tân Thuận Đông</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
