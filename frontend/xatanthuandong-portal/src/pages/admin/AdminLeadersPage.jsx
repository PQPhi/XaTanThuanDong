import { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { api } from '../../lib/api'
import { resolveApiUrl } from '../../lib/url'

const GROUPS = [
  { key: 'lanh-dao', label: 'Lãnh đạo' },
  { key: 'can-bo', label: 'Cán bộ' },
  { key: 'doan-the', label: 'Đoàn thể' },
]

export default function AdminLeadersPage() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({
    name: '',
    title: '',
    groupKey: 'lanh-dao',
    photoUrl: '',
    displayOrder: 0,
    isActive: true,
  })

  const activeGroupLabel = useMemo(() => GROUPS.find((g) => g.key === form.groupKey)?.label || form.groupKey, [form.groupKey])

  async function load() {
    setError('')
    try {
      const r = await api.get('/api/admin/content/leaders')
      setItems(r.data || [])
    } catch {
      setError('Không tải được danh sách.')
      setItems([])
    }
  }

  useEffect(() => {
    load()
  }, [])

  function startCreate() {
    setEditingId(null)
    setForm({ name: '', title: '', groupKey: 'lanh-dao', photoUrl: '', displayOrder: 0, isActive: true })
  }

  function startEdit(x) {
    setEditingId(x.id)
    setForm({
      name: x.name || '',
      title: x.title || '',
      groupKey: x.groupKey || 'lanh-dao',
      photoUrl: x.photoUrl || '',
      displayOrder: x.displayOrder ?? 0,
      isActive: Boolean(x.isActive),
    })
  }

  async function save(e) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const payload = {
        name: form.name.trim(),
        title: form.title.trim(),
        groupKey: form.groupKey,
        photoUrl: form.photoUrl || null,
        displayOrder: Number(form.displayOrder) || 0,
        isActive: Boolean(form.isActive),
      }

      if (!payload.name || !payload.title) {
        setError('Vui lòng nhập đầy đủ họ tên và chức vụ.')
        return
      }

      if (editingId) await api.put(`/api/admin/content/leaders/${editingId}`, payload)
      else await api.post('/api/admin/content/leaders', payload)

      startCreate()
      await load()
    } catch {
      setError('Không lưu được dữ liệu.')
    } finally {
      setSaving(false)
    }
  }

  async function remove(id) {
    if (!window.confirm('Xóa mục này?')) return
    setError('')
    try {
      await api.delete(`/api/admin/content/leaders/${id}`)
      await load()
    } catch {
      setError('Không xóa được.')
    }
  }

  async function uploadPhoto(file) {
    setError('')
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('topic', 'leaders')
      const r = await api.post('/api/admin/content/media/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setForm((f) => ({ ...f, photoUrl: r.data.url }))
    } catch {
      setError('Upload ảnh thất bại. Kiểm tra đăng nhập và định dạng ảnh.')
    } finally {
      setUploading(false)
    }
  }

  const grouped = useMemo(() => {
    const m = new Map()
    for (const x of items) {
      const k = x.groupKey || 'khac'
      if (!m.has(k)) m.set(k, [])
      m.get(k).push(x)
    }
    for (const [k, arr] of m) {
      arr.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
      m.set(k, arr)
    }
    return m
  }, [items])

  return (
    <div>
      <Helmet>
        <title>Lãnh đạo | Admin Portal</title>
      </Helmet>

      <div className="section-head">
        <div>
          <div className="section-chip">Lãnh đạo</div>
          <h2>Quản lý cán bộ / lãnh đạo</h2>
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
            <div className="fw-semibold mb-2">{editingId ? 'Cập nhật' : 'Thêm'} ({activeGroupLabel})</div>
            <form className="d-flex flex-column gap-2" onSubmit={save}>
              <input className="form-control" placeholder="Họ tên" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input className="form-control" placeholder="Chức vụ" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <div className="d-flex gap-2">
                <select className="form-select" value={form.groupKey} onChange={(e) => setForm({ ...form, groupKey: e.target.value })}>
                  {GROUPS.map((g) => <option key={g.key} value={g.key}>{g.label}</option>)}
                </select>
                <input className="form-control" style={{ maxWidth: 140 }} type="number" placeholder="Thứ tự" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: e.target.value })} />
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} id="leaderActive" />
                <label className="form-check-label" htmlFor="leaderActive">Hiển thị</label>
              </div>
              <div className="p-3 rounded-4" style={{ background: '#f6f8fb' }}>
                <div className="small text-muted mb-2">Ảnh đại diện</div>
                <div className="d-flex align-items-center gap-3 flex-wrap">
                  <div className="image-preview sm" style={form.photoUrl ? { backgroundImage: `url("${resolveApiUrl(form.photoUrl)}")` } : { background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)' }} />
                  <div className="d-flex flex-column gap-2">
                    <input className="form-control" placeholder="Photo URL" value={form.photoUrl} onChange={(e) => setForm({ ...form, photoUrl: e.target.value })} />
                    <input className="form-control" type="file" accept="image/*" onChange={(e) => uploadPhoto(e.target.files?.[0])} disabled={uploading} />
                    {uploading ? <div className="small text-muted">Đang upload...</div> : null}
                  </div>
                </div>
              </div>
              <div className="d-flex gap-2 mt-2">
                <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</button>
                {editingId ? <button className="btn btn-outline-secondary" type="button" onClick={startCreate}>Hủy</button> : null}
              </div>
            </form>
          </div>
        </div>
        <div className="col-12 col-lg-7">
          <div className="surface-table">
            <table className="table mb-0 align-middle">
              <thead>
                <tr>
                  <th>Ảnh</th>
                  <th>Họ tên</th>
                  <th>Chức vụ</th>
                  <th>Nhóm</th>
                  <th>Thứ tự</th>
                  <th>Hiển thị</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {[...grouped.entries()].flatMap(([, arr]) => arr.map((x) => (
                  <tr key={x.id}>
                    <td style={{ width: 80 }}><div className="image-preview xs" style={x.photoUrl ? { backgroundImage: `url("${resolveApiUrl(x.photoUrl)}")` } : { background: 'linear-gradient(135deg, #e2e8f0, #cbd5e1)' }} /></td>
                    <td className="fw-semibold">{x.name}</td>
                    <td className="text-muted">{x.title}</td>
                    <td><span className="badge text-bg-light">{x.groupKey}</span></td>
                    <td>{x.displayOrder ?? 0}</td>
                    <td>{x.isActive ? <span className="badge text-bg-success">On</span> : <span className="badge text-bg-secondary">Off</span>}</td>
                    <td className="text-end" style={{ whiteSpace: 'nowrap' }}>
                      <button className="btn btn-sm btn-outline-primary me-2" type="button" onClick={() => startEdit(x)}>Sửa</button>
                      <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => remove(x.id)}>Xóa</button>
                    </td>
                  </tr>
                )))}
                {items.length === 0 ? <tr><td colSpan={7} className="text-muted p-4">Chưa có dữ liệu.</td></tr> : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
