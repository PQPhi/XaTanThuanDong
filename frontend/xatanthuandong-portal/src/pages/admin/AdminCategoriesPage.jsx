import { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { api } from '../../lib/api'

function slugify(str) {
  return (str || '')
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export default function AdminCategoriesPage() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [form, setForm] = useState({ name: '', slug: '', description: '', isActive: true })
  const isCreate = useMemo(() => !editingId, [editingId])

  async function load() {
    setError('')
    try {
      const r = await api.get('/api/admin/content/categories')
      setItems(r.data || [])
    } catch {
      setError('Không tải được danh mục.')
      setItems([])
    }
  }

  useEffect(() => {
    load()
  }, [])

  function startCreate() {
    setEditingId(null)
    setForm({ name: '', slug: '', description: '', isActive: true })
  }

  function startEdit(x) {
    setEditingId(x.id)
    setForm({ name: x.name || '', slug: x.slug || '', description: x.description || '', isActive: Boolean(x.isActive) })
  }

  async function save(e) {
    e.preventDefault()
    setError('')

    const payload = {
      name: form.name.trim(),
      slug: (form.slug || slugify(form.name)).trim(),
      description: form.description?.trim() || null,
      isActive: Boolean(form.isActive),
    }

    if (!payload.name) {
      setError('Tên danh mục là bắt buộc.')
      return
    }

    try {
      setSaving(true)
      if (isCreate) await api.post('/api/admin/content/categories', payload)
      else await api.put(`/api/admin/content/categories/${editingId}`, payload)
      startCreate()
      await load()
    } catch (err) {
      setError(err?.response?.data?.message || 'Không lưu được.')
    } finally {
      setSaving(false)
    }
  }

  async function remove(id) {
    if (!window.confirm('Xóa danh mục này?')) return
    setError('')
    try {
      await api.delete(`/api/admin/content/categories/${id}`)
      await load()
    } catch (err) {
      setError(err?.response?.data?.message || 'Không xóa được.')
    }
  }

  return (
    <div>
      <Helmet>
        <title>Danh mục | Admin Portal</title>
      </Helmet>

      <div className="section-head">
        <div>
          <div className="section-chip">Nội dung</div>
          <h2>Quản lý danh mục</h2>
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
            <div className="fw-semibold mb-2">{isCreate ? 'Tạo danh mục' : 'Cập nhật danh mục'}</div>
            <form className="d-flex flex-column gap-2" onSubmit={save}>
              <input className="form-control" placeholder="Tên" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: isCreate ? slugify(e.target.value) : form.slug })} />
              <input className="form-control" placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
              <textarea className="form-control" placeholder="Mô tả" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <div className="form-check">
                <input className="form-check-input" type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} id="catActive" />
                <label className="form-check-label" htmlFor="catActive">Kích hoạt</label>
              </div>
              <div className="d-flex gap-2 mt-1">
                <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</button>
                {!isCreate ? <button className="btn btn-outline-secondary" type="button" onClick={startCreate}>Hủy</button> : null}
              </div>
            </form>
          </div>
        </div>

        <div className="col-12 col-lg-7">
          <div className="surface-table">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Tên</th>
                  <th>Slug</th>
                  <th>Trạng thái</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {items.map((x) => (
                  <tr key={x.id}>
                    <td className="fw-semibold">{x.name}</td>
                    <td className="text-muted">{x.slug}</td>
                    <td>{x.isActive ? <span className="badge text-bg-success">On</span> : <span className="badge text-bg-secondary">Off</span>}</td>
                    <td className="text-end" style={{ whiteSpace: 'nowrap' }}>
                      <button className="btn btn-sm btn-outline-primary me-2" type="button" onClick={() => startEdit(x)}>Sửa</button>
                      <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => remove(x.id)}>Xóa</button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-muted p-4">Chưa có dữ liệu.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
