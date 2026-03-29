import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { api } from '../../lib/api'

export default function AdminArticlesPage() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  async function load() {
    setError('')
    try {
      const r = await api.get('/api/admin/content/articles')
      setItems(r.data)
    } catch {
      setError('Không tải được danh sách. Hãy đăng nhập lại.')
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div>
      <Helmet>
        <title>Tin tức | Admin</title>
      </Helmet>

      <div className="d-flex align-items-end justify-content-between mb-3">
        <div>
          <div className="badge text-bg-primary">Tin tức</div>
          <h1 className="h3 fw-bold mb-0">Bài viết</h1>
        </div>
        <button className="btn btn-outline-primary" onClick={load}>Tải lại</button>
      </div>

      {error ? <div className="alert alert-warning">{error}</div> : null}

      <div className="bg-white border rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table mb-0">
            <thead>
              <tr>
                <th>Tiêu đề</th>
                <th>Danh mục</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {items.map((x) => (
                <tr key={x.id}>
                  <td className="fw-semibold">{x.title}</td>
                  <td>{x.categoryName}</td>
                  <td><span className={`badge ${x.status === 'Published' ? 'text-bg-success' : 'text-bg-secondary'}`}>{x.status}</span></td>
                </tr>
              ))}
              {items.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-muted p-4">Chưa có dữ liệu.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
