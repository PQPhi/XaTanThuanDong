import { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { api } from '../../lib/api'

export default function AdminArticlesPage() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')

  async function load() {
    setError('')
    try {
      const r = await api.get('/api/admin/content/articles')
      setItems(r.data || [])
    } catch {
      setError('Không tải được danh sách bài viết.')
      setItems([])
    }
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return items.filter((x) => {
      const okStatus = status === 'all' ? true : x.status === status
      const okSearch = !q
        ? true
        : [x.title, x.slug, x.categoryName].filter(Boolean).join(' ').toLowerCase().includes(q)
      return okStatus && okSearch
    })
  }, [items, search, status])

  async function remove(id) {
    if (!window.confirm('Xóa bài viết này?')) return
    setError('')
    try {
      await api.delete(`/api/admin/content/articles/${id}`)
      await load()
    } catch (err) {
      setError(err?.response?.data?.message || 'Không xóa được bài viết.')
    }
  }

  return (
    <div>
      <Helmet>
        <title>Bài viết | Admin Portal</title>
      </Helmet>

      <div className="section-head">
        <div>
          <div className="section-chip">Nội dung</div>
          <h2>Quản lý bài viết</h2>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary" type="button" onClick={load}>Tải lại</button>
          <Link className="btn btn-primary" to="/admin/articles/new">Thêm bài viết</Link>
        </div>
      </div>

      {error ? <div className="alert alert-warning">{error}</div> : null}

      <div className="surface-card mb-3">
        <div className="row g-2">
          <div className="col-12 col-md-8">
            <input
              className="form-control"
              placeholder="Tìm theo tiêu đề, slug, danh mục..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-4">
            <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all">Tất cả trạng thái</option>
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </select>
          </div>
        </div>
      </div>

      <div className="surface-table">
        <table className="table align-middle mb-0">
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Danh mục</th>
              <th>Trạng thái</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filtered.map((x) => (
              <tr key={x.id}>
                <td>
                  <div className="fw-semibold">{x.title}</div>
                  <div className="small text-muted">{x.slug}</div>
                </td>
                <td>{x.categoryName}</td>
                <td>
                  <span className={`badge ${x.status === 'Published' ? 'text-bg-success' : 'text-bg-secondary'}`}>
                    {x.status}
                  </span>
                </td>
                <td className="text-end" style={{ whiteSpace: 'nowrap' }}>
                  <Link className="btn btn-sm btn-outline-primary me-2" to={`/admin/articles/${x.id}/edit`}>Sửa</Link>
                  <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => remove(x.id)}>Xóa</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-muted p-4">Không có dữ liệu phù hợp.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  )
}
