import { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { api } from '../../lib/api'

const ALL_ROLES = ['Admin', 'Editor', 'Viewer']

function RolePills({ roles }) {
  if (!roles?.length) return <span className="text-muted">—</span>
  return (
    <div className="d-flex flex-wrap gap-1">
      {roles.map((r) => (
        <span key={r} className={`badge ${r === 'Admin' ? 'text-bg-danger' : r === 'Editor' ? 'text-bg-primary' : 'text-bg-secondary'}`}>{r}</span>
      ))}
    </div>
  )
}

export default function AdminUsersPage() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [form, setForm] = useState({
    email: '',
    password: '',
    fullName: '',
    isActive: true,
    roles: ['Viewer'],
  })

  const isCreate = useMemo(() => !editingId, [editingId])

  async function load() {
    setError('')
    try {
      const r = await api.get('/api/admin/users')
      setItems(r.data || [])
    } catch {
      setError('Không tải được danh sách người dùng (cần quyền Admin).')
      setItems([])
    }
  }

  useEffect(() => {
    load()
  }, [])

  function startCreate() {
    setEditingId(null)
    setForm({ email: '', password: '', fullName: '', isActive: true, roles: ['Viewer'] })
  }

  function startEdit(x) {
    setEditingId(x.id)
    setForm({ email: x.email || '', password: '', fullName: x.fullName || '', isActive: Boolean(x.isActive), roles: x.roles?.length ? x.roles : ['Viewer'] })
  }

  function toggleRole(role) {
    setForm((f) => {
      const has = f.roles.includes(role)
      const next = has ? f.roles.filter((r) => r !== role) : [...f.roles, role]
      return { ...f, roles: next.length ? next : ['Viewer'] }
    })
  }

  async function save(e) {
    e.preventDefault()
    setError('')

    const payloadCommon = {
      fullName: form.fullName?.trim() || null,
      isActive: Boolean(form.isActive),
      roles: form.roles,
    }

    try {
      setSaving(true)
      if (isCreate) {
        if (!form.email.trim() || !form.password) {
          setError('Email và mật khẩu là bắt buộc khi tạo mới.')
          return
        }
        await api.post('/api/admin/users', {
          email: form.email.trim(),
          password: form.password,
          ...payloadCommon,
        })
      } else {
        await api.put(`/api/admin/users/${editingId}`, payloadCommon)
      }

      startCreate()
      await load()
    } catch (err) {
      setError(err?.response?.data?.message || 'Không lưu được người dùng.')
    } finally {
      setSaving(false)
    }
  }

  async function remove(id) {
    if (!window.confirm('Xóa tài khoản này?')) return
    setError('')
    try {
      await api.delete(`/api/admin/users/${id}`)
      await load()
    } catch (err) {
      setError(err?.response?.data?.message || 'Không xóa được.')
    }
  }

  return (
    <div>
      <Helmet>
        <title>Người dùng | Admin Portal</title>
      </Helmet>

      <div className="section-head">
        <div>
          <div className="section-chip">Người dùng</div>
          <h2>Quản lý tài khoản</h2>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary" onClick={load} type="button">Tải lại</button>
          <button className="btn btn-primary" onClick={startCreate} type="button">Thêm mới</button>
        </div>
      </div>

      {error ? <div className="alert alert-warning">{error}</div> : null}

      <div className="row g-3">
        <div className="col-12 col-lg-5">
          <div className="surface-card">
            <div className="fw-semibold mb-2">{isCreate ? 'Tạo tài khoản' : 'Cập nhật tài khoản'}</div>
            <form className="d-flex flex-column gap-2" onSubmit={save}>
              <input className="form-control" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} disabled={!isCreate} />
              {isCreate ? (
                <input className="form-control" type="password" placeholder="Mật khẩu" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              ) : (
                <div className="small text-muted">(Không đổi mật khẩu ở màn hình này)</div>
              )}
              <input className="form-control" placeholder="Họ và tên" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />

              <div className="p-3 rounded-4" style={{ background: '#f6f8fb' }}>
                <div className="small text-muted mb-2">Phân quyền</div>
                <div className="d-flex gap-2 flex-wrap">
                  {ALL_ROLES.map((r) => (
                    <button key={r} type="button" className={`btn btn-sm ${form.roles.includes(r) ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => toggleRole(r)}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-check">
                <input className="form-check-input" type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} id="userActive" />
                <label className="form-check-label" htmlFor="userActive">Kích hoạt</label>
              </div>

              <div className="d-flex gap-2 mt-2">
                <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</button>
                {!isCreate ? <button className="btn btn-outline-secondary" type="button" onClick={startCreate}>Hủy</button> : null}
              </div>
            </form>
          </div>
        </div>

        <div className="col-12 col-lg-7">
          <div className="surface-table">
            <table className="table mb-0 align-middle">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Họ tên</th>
                  <th>Quyền</th>
                  <th>Trạng thái</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {items.map((x) => (
                  <tr key={x.id}>
                    <td className="fw-semibold">{x.email}</td>
                    <td className="text-muted">{x.fullName || '—'}</td>
                    <td><RolePills roles={x.roles} /></td>
                    <td>{x.isActive ? <span className="badge text-bg-success">Active</span> : <span className="badge text-bg-secondary">Disabled</span>}</td>
                    <td className="text-end" style={{ whiteSpace: 'nowrap' }}>
                      <button className="btn btn-sm btn-outline-primary me-2" type="button" onClick={() => startEdit(x)}>Sửa</button>
                      <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => remove(x.id)}>Xóa</button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 ? <tr><td colSpan={5} className="text-muted p-4">Chưa có dữ liệu.</td></tr> : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
