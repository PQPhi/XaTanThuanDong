import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { api } from '../lib/api'

export default function ServicesPage() {
  const [procedures, setProcedures] = useState([])
  const [selected, setSelected] = useState(null)
  const [appForm, setAppForm] = useState({ applicantName: '', applicantEmail: '', applicantPhone: '', address: '' })
  const [created, setCreated] = useState(null)

  const [lookupId, setLookupId] = useState('')
  const [lookup, setLookup] = useState(null)

  useEffect(() => {
    api.get('/api/public/services/procedures').then((r) => {
      setProcedures(r.data)
      setSelected(r.data[0] || null)
    })
  }, [])

  async function submitApplication(e) {
    e.preventDefault()
    if (!selected) return
    const payload = { serviceProcedureId: selected.id, ...appForm }
    const r = await api.post('/api/public/services/applications', payload)
    setCreated(r.data)
  }

  async function doLookup(e) {
    e.preventDefault()
    setLookup(null)
    const r = await api.get(`/api/public/services/applications/${lookupId}`)
    setLookup(r.data)
  }

  return (
    <div className="container py-4 py-lg-5">
      <Helmet>
        <title>Dịch vụ hành chính | Xã Tân Thuận Đông</title>
      </Helmet>

      <div className="row g-4">
        <div className="col-12 col-lg-5" data-aos="fade-up">
          <div className="p-4 bg-white border rounded-4">
            <div className="badge text-bg-primary mb-2">Dịch vụ hành chính</div>
            <h1 className="h3 fw-bold mb-3">Thủ tục</h1>
            <div className="list-group">
              {procedures.map((p) => (
                <button
                  key={p.id}
                  className={`list-group-item list-group-item-action ${selected?.id === p.id ? 'active' : ''}`}
                  onClick={() => setSelected(p)}
                  type="button"
                >
                  <div className="fw-semibold">{p.name}</div>
                  <div className="small opacity-75">{p.processingTime || '—'}</div>
                </button>
              ))}
              {procedures.length === 0 ? <div className="text-muted">Chưa có thủ tục.</div> : null}
            </div>
          </div>

          <div className="p-4 bg-white border rounded-4 mt-4" data-aos="fade-up" data-aos-delay="120">
            <div className="fw-bold mb-2">Tra cứu trạng thái hồ sơ</div>
            <form className="d-flex gap-2" onSubmit={doLookup}>
              <input className="form-control" placeholder="Nhập mã hồ sơ" value={lookupId} onChange={(e) => setLookupId(e.target.value)} />
              <button className="btn btn-outline-primary" type="submit">Tra cứu</button>
            </form>
            {lookup ? (
              <div className="mt-3 small">
                <div><span className="text-muted">Thủ tục:</span> {lookup.serviceProcedureName}</div>
                <div><span className="text-muted">Trạng thái:</span> <span className="fw-semibold">{lookup.status}</span></div>
                {lookup.note ? <div><span className="text-muted">Ghi chú:</span> {lookup.note}</div> : null}
              </div>
            ) : null}
          </div>
        </div>

        <div className="col-12 col-lg-7" data-aos="fade-left">
          <div className="p-4 bg-white border rounded-4">
            <h2 className="h5 fw-bold mb-2">Chi tiết thủ tục</h2>
            {selected ? (
              <>
                <div className="fw-semibold">{selected.name}</div>
                {selected.description ? <div className="text-muted mt-1">{selected.description}</div> : null}
                <hr />
                <div className="row g-3 small">
                  <div className="col-12 col-md-6"><span className="text-muted">Thời gian:</span> {selected.processingTime || '—'}</div>
                  <div className="col-12 col-md-6"><span className="text-muted">Lệ phí:</span> {selected.fee || '—'}</div>
                  <div className="col-12"><span className="text-muted">Hồ sơ cần có:</span> {selected.requiredDocuments || '—'}</div>
                </div>
              </>
            ) : (
              <div className="text-muted">Chọn một thủ tục để xem chi tiết.</div>
            )}
          </div>

          <div className="p-4 bg-white border rounded-4 mt-4">
            <div className="fw-bold mb-2">Nộp hồ sơ trực tuyến</div>
            <form onSubmit={submitApplication} className="row g-2">
              <div className="col-12 col-md-6">
                <input className="form-control" placeholder="Họ tên" value={appForm.applicantName} onChange={(e) => setAppForm({ ...appForm, applicantName: e.target.value })} required />
              </div>
              <div className="col-12 col-md-6">
                <input className="form-control" placeholder="SĐT" value={appForm.applicantPhone} onChange={(e) => setAppForm({ ...appForm, applicantPhone: e.target.value })} />
              </div>
              <div className="col-12">
                <input className="form-control" placeholder="Email" value={appForm.applicantEmail} onChange={(e) => setAppForm({ ...appForm, applicantEmail: e.target.value })} />
              </div>
              <div className="col-12">
                <input className="form-control" placeholder="Địa chỉ" value={appForm.address} onChange={(e) => setAppForm({ ...appForm, address: e.target.value })} />
              </div>
              <div className="col-12">
                <button className="btn btn-primary" type="submit" disabled={!selected}>Nộp hồ sơ</button>
              </div>
            </form>

            {created ? (
              <div className="alert alert-success mt-3 mb-0">
                Đã tạo hồ sơ. Mã hồ sơ: <b>{created.applicationId}</b> (trạng thái: {created.status})
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
