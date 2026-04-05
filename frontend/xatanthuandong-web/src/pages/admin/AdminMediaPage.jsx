import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { api } from '../../lib/api'

export default function AdminMediaPage() {
  const [items, setItems] = useState([])
  const [topic, setTopic] = useState('')
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)

  async function load() {
    setError('')
    try {
      const r = await api.get('/api/admin/content/media', { params: topic ? { topic } : {} })
      setItems(r.data || [])
    } catch {
      setError('Không tải được media.')
      setItems([])
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function upload(file) {
    if (!file) return
    setError('')
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      if (topic) fd.append('topic', topic)
      await api.post('/api/admin/content/media/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      await load()
    } catch (err) {
      setError(err?.response?.data?.message || 'Upload thất bại.')
    } finally {
      setUploading(false)
    }
  }

  async function copy(url) {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      // ignore
    }
  }

  return (
    <div>
      <Helmet>
        <title>Media | Admin</title>
      </Helmet>

      <div className="d-flex align-items-end justify-content-between mb-3">
        <div>
          <div className="badge text-bg-primary">Media</div>
          <h1 className="h3 fw-bold mb-0">Upload & Thư viện</h1>
        </div>
        <button className="btn btn-outline-primary" onClick={load} type="button">Tải lại</button>
      </div>

      {error ? <div className="alert alert-warning">{error}</div> : null}

      <div className="p-4 bg-white border rounded-4 mb-3">
        <div className="row g-2 align-items-end">
          <div className="col-12 col-md-4">
            <label className="form-label">Topic (tuỳ chọn)</label>
            <input className="form-control" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="vd: articles / leaders" />
          </div>
          <div className="col-12 col-md-5">
            <label className="form-label">Chọn ảnh</label>
            <input className="form-control" type="file" accept="image/*" disabled={uploading} onChange={(e) => upload(e.target.files?.[0])} />
            {uploading ? <div className="small text-muted mt-1">Đang upload...</div> : null}
          </div>
          <div className="col-12 col-md-3">
            <button className="btn btn-secondary w-100" type="button" onClick={load}>Lọc / Tải lại</button>
          </div>
        </div>
      </div>

      <div className="row g-3">
        {items.map((x) => (
          <div key={x.id} className="col-6 col-md-4 col-lg-3">
            <div className="bg-white border rounded-4 overflow-hidden h-100">
              <div style={{ aspectRatio: '1 / 1', backgroundImage: `url(${x.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              <div className="p-2">
                <div className="small text-muted text-truncate" title={x.fileName}>{x.fileName}</div>
                <div className="d-flex gap-2 mt-2">
                  <a className="btn btn-sm btn-outline-primary" href={x.url} target="_blank" rel="noreferrer">Mở</a>
                  <button className="btn btn-sm btn-outline-secondary" type="button" onClick={() => copy(x.url)}>Copy URL</button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 ? (
          <div className="col-12">
            <div className="text-muted p-4 bg-white border rounded-4">Chưa có ảnh.</div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
