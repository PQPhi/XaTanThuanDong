import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { api } from '../../lib/api'
import { saveToken } from '../../lib/auth'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@xatanthuandong.local')
  const [password, setPassword] = useState('Admin@123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function login(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const r = await api.post('/api/auth/login', { email, password })
      saveToken(r.data.token)
      navigate('/admin/dashboard', { replace: true })
    } catch (err) {
      setError(err?.response?.data?.message || 'Đăng nhập thất bại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-screen">
      <Helmet>
        <title>Đăng nhập | Admin Portal</title>
      </Helmet>

      <div className="login-card">
        <div className="login-kicker">Cổng quản trị</div>
        <h1>Xa Tan Thuan Dong</h1>
        <p>Đăng nhập để quản lý nội dung, media, thủ tục và hồ sơ dịch vụ.</p>

        <form onSubmit={login} className="d-flex flex-column gap-2 mt-3">
          <input
            className="form-control"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="form-control"
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn btn-primary mt-2" type="submit" disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
          {error ? <div className="small text-danger">{error}</div> : null}
          <div className="small text-muted mt-2">Demo: admin@xatanthuandong.local / Admin@123</div>
        </form>
      </div>
    </div>
  )
}
