import { useEffect, useMemo } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { clearToken, initAuthFromStorage } from '../../lib/auth'

const MENU = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/articles', label: 'Nội dung' },
  { to: '/admin/categories', label: 'Danh mục' },
  { to: '/admin/media', label: 'Media' },
  { to: '/admin/comments', label: 'Bình luận' },
  { to: '/admin/leaders', label: 'Lãnh đạo' },
  { to: '/admin/procedures', label: 'Thủ tục' },
  { to: '/admin/services', label: 'Hồ sơ dịch vụ' },
  { to: '/admin/users', label: 'Người dùng' },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const token = initAuthFromStorage()
    if (!token) navigate('/admin/login', { replace: true })
  }, [navigate])

  const currentTitle = useMemo(() => {
    return MENU.find((x) => location.pathname.startsWith(x.to))?.label || 'Admin Portal'
  }, [location.pathname])

  return (
    <div className="portal-shell">
      <aside className="portal-sidebar">
        <div className="brand-block">
          <div className="brand-kicker">Xa Tan Thuan Dong</div>
          <div className="brand-title">Admin Portal</div>
        </div>

        <nav className="menu-block">
          {MENU.map((x) => (
            <NavLink
              key={x.to}
              to={x.to}
              className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
            >
              {x.label}
            </NavLink>
          ))}
        </nav>

        <button
          className="danger-ghost"
          type="button"
          onClick={() => {
            clearToken()
            navigate('/admin/login', { replace: true })
          }}
        >
          Đăng xuất
        </button>
      </aside>

      <div className="portal-main">
        <header className="portal-topbar">
          <h1>{currentTitle}</h1>
          <div className="topbar-note">Bảng điều khiển quản trị nội dung và dịch vụ công</div>
        </header>

        <main className="portal-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
