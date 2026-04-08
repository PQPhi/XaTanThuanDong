import { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { api } from '../../lib/api'

export default function AdminProceduresPage() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [form, setForm] = useState({
    name: '',
    description: '',
    requiredDocuments: '',
    processingTime: '',
    fee: '',
    formTemplateUrl: '',
    isActive: true,
  })

  const isCreate = useMemo(() => !editingId, [editingId])

  async function load() {
    setError('')
    try {
      const r = await api.get('/api/admin/services/procedures')
      setItems(r.data || [])
    } catch {
      setError('Không tải được thủ tục.')
      setItems([])
    }
  }

  useEffect(() => {
    load()
  }, [])

  function startCreate() {
    setEditingId(null)
    setForm({ name: '', description: '', requiredDocuments: '', processingTime: '', fee: '', formTemplateUrl: '', isActive: true })
  }

  function startEdit(x) {
    setEditingId(x.id)
    setForm({
      name: x.name || '',
      description: x.description || '',
      requiredDocuments: x.requiredDocuments || '',
      processingTime: x.processingTime || '',
      fee: x.fee || '',
      formTemplateUrl: x.formTemplateUrl || '',
      isActive: Boolean(x.isActive),
    })
  }

  async function save(e) {
    e.preventDefault()
    setError('')

    const payload = {
      name: form.name.trim(),
      description: form.description?.trim() || null,
      requiredDocuments: form.requiredDocuments?.trim() || null,
      processingTime: form.processingTime?.trim() || null,
      fee: form.fee?.trim() || null,
      formTemplateUrl: form.formTemplateUrl?.trim() || null,
      isActive: Boolean(form.isActive),
    }

    if (!payload.name) {
      setError('Tên thủ tục là bắt buộc.')
      return
    }

    try {
      setSaving(true)
      if (isCreate) await api.post('/api/admin/services/procedures', payload)
      else await api.put(`/api/admin/services/procedures/${editingId}`, payload)
      startCreate()
      await load()
    } catch (err) {
      setError(err?.response?.data?.message || 'Không lưu được.')
    } finally {
      setSaving(false)
    }
  }

  async function remove(id) {
    if (!window.confirm('Xóa thủ tục này?')) return
    setError('')
    try {
      await api.delete(`/api/admin/services/procedures/${id}`)
      await load()
    } catch (err) {
      setError(err?.response?.data?.message || 'Không xóa được.')
    }
  }

  return (
    <div>
      <Helmet>
        <title>Thủ tục | Admin Portal</title>
      </Helmet>

      <div className="section-head">
        <div>
          <div className="section-chip">Thủ tục</div>
          <h2>Quản lý thủ tục hành chính</h2>
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
            <div className="fw-semibold mb-2">{isCreate ? 'Tạo thủ tục' : 'Cập nhật thủ tục'}</div>
            <form className="d-flex flex-column gap-2" onSubmit={save}>
              <input className="form-control" placeholder="Tên" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <textarea className="form-control" placeholder="Mô tả" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <textarea className="form-control" placeholder="Giấy tờ cần thiết" rows={3} value={form.requiredDocuments} onChange={(e) => setForm({ ...form, requiredDocuments: e.target.value })} />
              <div className="row g-2">
                <div className="col-6"><input className="form-control" placeholder="Thời gian xử lý" value={form.processingTime} onChange={(e) => setForm({ ...form, processingTime: e.target.value })} /></div>
                <div className="col-6"><input className="form-control" placeholder="Phí" value={form.fee} onChange={(e) => setForm({ ...form, fee: e.target.value })} /></div>
              </div>
              <input className="form-control" placeholder="Link mẫu đơn (URL)" value={form.formTemplateUrl} onChange={(e) => setForm({ ...form, formTemplateUrl: e.target.value })} />
              <div className="form-check">
                <input className="form-check-input" type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} id="procActive" />
                <label className="form-check-label" htmlFor="procActive">Kích hoạt</label>
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
                  <th>Tên</th>
                  <th>Trạng thái</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {items.map((x) => (
                  <tr key={x.id}>
                    <td className="fw-semibold">{x.name}</td>
                    <td>{x.isActive ? <span className="badge text-bg-success">On</span> : <span className="badge text-bg-secondary">Off</span>}</td>
                    <td className="text-end" style={{ whiteSpace: 'nowrap' }}>
                      <button className="btn btn-sm btn-outline-primary me-2" type="button" onClick={() => startEdit(x)}>Sửa</button>
                      <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => remove(x.id)}>Xóa</button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 ? <tr><td colSpan={3} className="text-muted p-4">Chưa có dữ liệu.</td></tr> : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
