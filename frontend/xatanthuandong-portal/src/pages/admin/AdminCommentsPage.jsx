import { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { api } from '../../lib/api'

export default function AdminCommentsPage() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('pending')

  const approvedParam = useMemo(() => {
    if (filter === 'all') return undefined
    return filter === 'approved'
  }, [filter])

  async function load() {
    setError('')
    try {
      const r = await api.get('/api/admin/content/comments', { params: approvedParam === undefined ? {} : { approved: approvedParam } })
      setItems(r.data || [])
    } catch {
      setError('Không tải được bình luận.')
      setItems([])
    }
  }

  useEffect(() => {
    load()
  }, [filter])

  async function approve(id) {
    setError('')
    try {
      await api.put(`/api/admin/content/comments/${id}/approve`)
      await load()
    } catch {
      setError('Không duyệt được.')
    }
  }

  async function remove(id) {
    if (!window.confirm('Xóa bình luận này?')) return
    setError('')
    try {
      await api.delete(`/api/admin/content/comments/${id}`)
      await load()
    } catch {
      setError('Không xóa được.')
    }
  }

  return (
    <div>
      <Helmet>
        <title>Bình luận | Admin Portal</title>
      </Helmet>

      <div className="section-head">
        <div>
          <div className="section-chip">Bình luận</div>
          <h2>Duyệt bình luận</h2>
        </div>
        <div className="d-flex gap-2">
          <select className="form-select" style={{ maxWidth: 220 }} value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đã duyệt</option>
            <option value="all">Tất cả</option>
          </select>
          <button className="btn btn-outline-primary" onClick={load} type="button">Tải lại</button>
        </div>
      </div>

      {error ? <div className="alert alert-warning">{error}</div> : null}

      <div className="surface-table">
        <table className="table mb-0 align-middle">
          <thead>
            <tr>
              <th>Tác giả</th>
              <th>Nội dung</th>
              <th>Thời gian</th>
              <th>Trạng thái</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((x) => (
              <tr key={x.id}>
                <td>
                  <div className="fw-semibold">{x.authorName}</div>
                  <div className="small text-muted">{x.authorEmail}</div>
                </td>
                <td style={{ minWidth: 360 }}>
                  <div className="text-muted" style={{ whiteSpace: 'pre-wrap' }}>{x.content}</div>
                </td>
                <td className="text-muted">{new Date(x.createdAtUtc).toLocaleString()}</td>
                <td>{x.isApproved ? <span className="badge text-bg-success">Approved</span> : <span className="badge text-bg-warning">Pending</span>}</td>
                <td className="text-end" style={{ whiteSpace: 'nowrap' }}>
                  {!x.isApproved ? <button className="btn btn-sm btn-primary me-2" type="button" onClick={() => approve(x.id)}>Duyệt</button> : null}
                  <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => remove(x.id)}>Xóa</button>
                </td>
              </tr>
            ))}
            {items.length === 0 ? <tr><td colSpan={5} className="text-muted p-4">Chưa có dữ liệu.</td></tr> : null}
          </tbody>
        </table>
      </div>
    </div>
  )
}
