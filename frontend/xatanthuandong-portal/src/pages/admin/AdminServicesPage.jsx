import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { api } from '../../lib/api'

export default function AdminServicesPage() {
  const [apps, setApps] = useState([])
  const [error, setError] = useState('')
  const [edit, setEdit] = useState({ id: '', status: 'Processing', note: '' })

  async function load() {
    setError('')
    try {
      const r = await api.get('/api/admin/services/applications')
      setApps(r.data || [])
    } catch {
      setError('Không tải được hồ sơ.')
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function updateStatus(e) {
    e.preventDefault()
    setError('')
    try {
      await api.put(`/api/admin/services/applications/${edit.id}/status`, { status: edit.status, note: edit.note })
      setEdit({ id: '', status: 'Processing', note: '' })
      await load()
    } catch (err) {
      setError(err?.response?.data?.message || 'Không cập nhật được trạng thái.')
    }
  }

  return (
    <div>
      <Helmet>
        <title>Hồ sơ dịch vụ | Admin Portal</title>
      </Helmet>

      <div className="section-head">
        <div>
          <div className="section-chip">Dịch vụ</div>
          <h2>Quản lý hồ sơ</h2>
        </div>
        <button className="btn btn-outline-primary" onClick={load} type="button">Tải lại</button>
      </div>

      {error ? <div className="alert alert-warning">{error}</div> : null}

      <div className="row g-3">
        <div className="col-12 col-lg-8">
          <div className="surface-table">
            <table className="table mb-0">
              <thead>
                <tr>
                  <th>Mã</th>
                  <th>Thủ tục</th>
                  <th>Người nộp</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {apps.map((x) => (
                  <tr key={x.id}>
                    <td className="fw-semibold">{x.id}</td>
                    <td>{x.serviceProcedureName}</td>
                    <td>{x.applicantName}</td>
                    <td><span className="badge text-bg-info">{x.status}</span></td>
                  </tr>
                ))}
                {apps.length === 0 ? <tr><td colSpan={4} className="text-muted p-4">Chưa có hồ sơ.</td></tr> : null}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="surface-card">
            <div className="fw-semibold mb-2">Cập nhật trạng thái</div>
            <form className="d-flex flex-column gap-2" onSubmit={updateStatus}>
              <input className="form-control" placeholder="Mã hồ sơ" value={edit.id} onChange={(e) => setEdit({ ...edit, id: e.target.value })} />
              <select className="form-select" value={edit.status} onChange={(e) => setEdit({ ...edit, status: e.target.value })}>
                <option value="Submitted">Submitted</option>
                <option value="Processing">Processing</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
              <textarea className="form-control" rows="3" placeholder="Ghi chú" value={edit.note} onChange={(e) => setEdit({ ...edit, note: e.target.value })} />
              <button className="btn btn-primary" type="submit" disabled={!edit.id}>Cập nhật</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
