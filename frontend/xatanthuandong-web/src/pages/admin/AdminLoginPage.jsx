import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { api } from '../../lib/api'
import { saveToken } from '../../lib/auth'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@xatanthuandong.local')
  const [password, setPassword] = useState('Admin@123')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function login(e) {
    e.preventDefault()
    setError('')
    try {
      const r = await api.post('/api/auth/login', { email, password })
      saveToken(r.data.token)
      navigate('/admin/dashboard', { replace: true })
    } catch {
      setError('Đăng nhập thất bại.')
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <Helmet>
        <title>Đăng nhập | Quản trị</title>
      </Helmet>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 col-lg-4">
            <div className="p-4 bg-white border rounded-4 shadow-sm" data-aos="zoom-in">
              <div className="fw-bold mb-1">Đăng nhập quản trị</div>
              <div className="text-muted small mb-3">Xã Tân Thuận Đông</div>
              <form className="d-flex flex-column gap-2" onSubmit={login}>
                <input className="form-control" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input className="form-control" type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className="btn btn-primary" type="submit">Đăng nhập</button>
                {error ? <div className="small text-danger">{error}</div> : null}
                <div className="small text-muted mt-2">
                  Demo: admin@xatanthuandong.local / Admin@123
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
