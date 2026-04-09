import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { api } from '../../lib/api'
import { resolveApiUrl } from '../../lib/url'

export default function AdminMediaPage() {
  const [items, setItems] = useState([])
  const [topic, setTopic] = useState('')
  const [title, setTitle] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [savingId, setSavingId] = useState(null)
  const [editingTitle, setEditingTitle] = useState({})
  const [editingTopic, setEditingTopic] = useState({})

  function suggestTitle(name) {
    if (!name) return ''
    const idx = name.lastIndexOf('.')
    return idx > 0 ? name.slice(0, idx) : name
  }

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
      if (title.trim()) fd.append('title', title.trim())
      await api.post('/api/admin/content/media/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setSelectedFile(null)
      setTitle('')
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

  async function saveMeta(item) {
    setError('')
    setSavingId(item.id)
    try {
      await api.put(`/api/admin/content/media/${item.id}`, {
        title: (editingTitle[item.id] ?? item.title ?? '').trim(),
        topic: (editingTopic[item.id] ?? item.topic ?? '').trim(),
      })
      await load()
    } catch (err) {
      setError(err?.response?.data?.message || 'Không lưu được tiêu đề/topic.')
    } finally {
      setSavingId(null)
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
            <input
              className="form-control"
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0]
                setSelectedFile(file || null)
                setTitle(suggestTitle(file?.name || ''))
              }}
            />
            {selectedFile ? <div className="small text-muted mt-1">Đã chọn: {selectedFile.name}</div> : null}
            {uploading ? <div className="small text-muted mt-1">Đang upload...</div> : null}
          </div>
          <div className="col-12 col-md-3">
            <label className="form-label">Tiêu đề ảnh</label>
            <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="vd: Hoạt động tại xã" disabled={uploading} />
          </div>
          <div className="col-12 col-md-3">
            <div className="d-grid gap-2">
              <button className="btn btn-primary" type="button" disabled={uploading || !selectedFile} onClick={() => upload(selectedFile)}>
                {uploading ? 'Đang upload...' : 'Upload ảnh'}
              </button>
              <button className="btn btn-secondary" type="button" onClick={load}>Lọc / Tải lại</button>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        {items.map((x) => (
          <div key={x.id} className="col-6 col-md-4 col-lg-3">
            <div className="bg-white border rounded-4 overflow-hidden h-100">
              <div style={{ aspectRatio: '1 / 1', backgroundImage: `url("${resolveApiUrl(x.url)}")`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              <div className="p-2">
                <div className="fw-semibold text-truncate" title={x.title || `Hình ảnh #${x.id}`}>{x.title || `Hình ảnh #${x.id}`}</div>
                <div className="small text-muted text-truncate" title={x.fileName}>Tệp: {x.fileName}</div>
                <div className="d-flex gap-2 mt-2">
                  <input
                    className="form-control form-control-sm"
                    value={editingTitle[x.id] ?? x.title ?? ''}
                    onChange={(e) => setEditingTitle((prev) => ({ ...prev, [x.id]: e.target.value }))}
                    placeholder="Tiêu đề"
                  />
                </div>
                <div className="d-flex gap-2 mt-2">
                  <input
                    className="form-control form-control-sm"
                    value={editingTopic[x.id] ?? x.topic ?? ''}
                    onChange={(e) => setEditingTopic((prev) => ({ ...prev, [x.id]: e.target.value }))}
                    placeholder="Topic"
                  />
                  <button className="btn btn-sm btn-success" type="button" onClick={() => saveMeta(x)} disabled={savingId === x.id}>
                    {savingId === x.id ? 'Đang lưu' : 'Lưu'}
                  </button>
                </div>
                <div className="d-flex gap-2 mt-2">
                  <a className="btn btn-sm btn-outline-primary" href={resolveApiUrl(x.url)} target="_blank" rel="noreferrer">Mở</a>
                  <button className="btn btn-sm btn-outline-secondary" type="button" onClick={() => copy(resolveApiUrl(x.url))}>Copy URL</button>
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
