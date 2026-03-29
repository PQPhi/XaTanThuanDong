import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { clearToken, initAuthFromStorage } from '../../lib/auth'

function SideItem({ to, children }) {
  return (
    <NavLink className={({ isActive }) => `list-group-item list-group-item-action ${isActive ? 'active' : ''}`} to={to}>
      {children}
    </NavLink>
  )
}

export default function AdminLayout() {
  const navigate = useNavigate()

  useEffect(() => {
    const token = initAuthFromStorage()
    if (!token) navigate('/admin/login', { replace: true })
  }, [navigate])

  return (
    <div className="min-vh-100 bg-light">
      <div className="container-fluid">
        <div className="row">
          <aside className="col-12 col-md-3 col-lg-2 p-0 border-end bg-white min-vh-100">
            <div className="p-3 border-bottom fw-bold">Quản trị</div>
            <div className="list-group list-group-flush">
              <SideItem to="/admin/dashboard">Dashboard</SideItem>
              <SideItem to="/admin/articles">Tin tức</SideItem>
              <SideItem to="/admin/leaders">Lãnh đạo</SideItem>
              <SideItem to="/admin/services">Dịch vụ & Hồ sơ</SideItem>
            </div>
            <div className="p-3">
              <button
                className="btn btn-outline-danger w-100"
                onClick={() => {
                  clearToken()
                  navigate('/admin/login', { replace: true })
                }}
              >
                Đăng xuất
              </button>
            </div>
          </aside>

          <section className="col-12 col-md-9 col-lg-10 p-3 p-md-4">
            <Outlet />
          </section>
        </div>
      </div>
    </div>
  )
}
