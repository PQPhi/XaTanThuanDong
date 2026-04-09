import { useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { api } from '../../lib/api'
import { resolveApiUrl } from '../../lib/url'

export default function AdminMediaPage() {
  const [items, setItems] = useState([])
  const [filterTopic, setFilterTopic] = useState('')
  const [uploadTopic, setUploadTopic] = useState('gallery')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadTitle, setUploadTitle] = useState('')
  const [savingId, setSavingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [replacingId, setReplacingId] = useState(null)
  const [editingTopic, setEditingTopic] = useState({})
  const [editingTitle, setEditingTitle] = useState({})
  const uploadInputRef = useRef(null)

  function suggestTitle(name) {
    if (!name) return ''
    const idx = name.lastIndexOf('.')
    return idx > 0 ? name.slice(0, idx) : name
  }

  async function load(nextFilterTopic = filterTopic) {
    setError('')
    try {
      const r = await api.get('/api/admin/content/media', {
        params: nextFilterTopic ? { topic: nextFilterTopic } : {},
      })
      setItems(r.data || [])
    } catch (err) {
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        setError('Phiên đăng nhập đã hết hạn hoặc không đủ quyền. Vui lòng đăng nhập lại.')
      } else {
        setError('Không tải được media.')
      }
      setItems([])
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function upload() {
    if (!selectedFile) {
      setError('Vui lòng chọn file ảnh trước khi tải lên.')
      return
    }
    setError('')
    setNotice('')
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', selectedFile)
      if (uploadTopic) fd.append('topic', uploadTopic)
      if (uploadTitle.trim()) fd.append('title', uploadTitle.trim())
      await api.post('/api/admin/content/media/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setSelectedFile(null)
      setUploadTitle('')
      if (uploadInputRef.current) uploadInputRef.current.value = ''
      setNotice('Tải ảnh lên thành công.')

      const nextFilter = (uploadTopic || '').trim()
      setFilterTopic(nextFilter)
      await load(nextFilter)
    } catch (err) {
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        setError('Bạn chưa đăng nhập hoặc không có quyền upload ảnh.')
      } else {
        const serverMsg = err?.response?.data?.message
        const status = err?.response?.status
        setError(serverMsg ? `${serverMsg} (HTTP ${status || 'N/A'})` : `Upload thất bại (HTTP ${status || 'N/A'}).`)
      }
    } finally {
      setUploading(false)
    }
  }

  async function copy(url) {
    try {
      await navigator.clipboard.writeText(resolveApiUrl(url))
    } catch {
      // ignore
    }
  }

  async function saveTopic(item) {
    setError('')
    setNotice('')
    setSavingId(item.id)
    try {
      await api.put(`/api/admin/content/media/${item.id}`, {
        topic: (editingTopic[item.id] ?? '').trim(),
        title: (editingTitle[item.id] ?? '').trim(),
      })
      setNotice('Cập nhật thông tin ảnh thành công.')
      await load()
    } catch (err) {
      setError(err?.response?.data?.message || 'Không cập nhật được topic.')
    } finally {
      setSavingId(null)
    }
  }

  async function removeItem(item) {
    const ok = window.confirm(`Xóa ảnh ${item.title || item.fileName}?`)
    if (!ok) return

    setError('')
    setNotice('')
    setDeletingId(item.id)
    try {
      await api.delete(`/api/admin/content/media/${item.id}`)
      setNotice('Đã xóa ảnh.')
      await load()
    } catch (err) {
      setError(err?.response?.data?.message || 'Xóa ảnh thất bại.')
    } finally {
      setDeletingId(null)
    }
  }

  async function replaceFile(item, file) {
    if (!file) return

    setError('')
    setNotice('')
    setReplacingId(item.id)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('topic', (editingTopic[item.id] ?? item.topic ?? '').trim())
      fd.append('title', (editingTitle[item.id] ?? item.title ?? '').trim())
      await api.post(`/api/admin/content/media/${item.id}/replace`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setNotice('Đã thay ảnh thành công.')
      await load()
    } catch (err) {
      setError(err?.response?.data?.message || 'Thay ảnh thất bại.')
    } finally {
      setReplacingId(null)
    }
  }

  return (
    <div>
      <Helmet>
        <title>Media | Admin Portal</title>
      </Helmet>

      <div className="section-head">
        <div>
          <div className="section-chip">Media</div>
          <h2>Upload & thư viện ảnh</h2>
        </div>
        <button className="btn btn-outline-primary" onClick={load} type="button">Tải lại</button>
      </div>

      {error ? <div className="alert alert-warning">{error}</div> : null}
      {notice ? <div className="alert alert-success">{notice}</div> : null}

      <div className="surface-card mb-3">
        <div className="row g-2 align-items-end">
          <div className="col-12 col-md-4">
            <label className="form-label">Upload topic</label>
            <div className="d-flex gap-2">
              <input
                className="form-control"
                value={uploadTopic}
                onChange={(e) => setUploadTopic(e.target.value)}
                placeholder="gallery / articles / leaders / ..."
              />
              <button
                className="btn btn-outline-primary"
                type="button"
                onClick={() => setUploadTopic('gallery')}
              >
                gallery
              </button>
            </div>
            <div className="form-text">Topic dùng để phân nhóm nội bộ (ví dụ: banner, su-kien, thong-bao). Trang người dùng /thu-vien hiện hiển thị tất cả ảnh.</div>
          </div>
          <div className="col-12 col-md-5">
            <label className="form-label">Chọn ảnh</label>
            <input
              ref={uploadInputRef}
              className="form-control"
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.gif,.bmp,.jfif,image/*"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0] || null
                setSelectedFile(file)
                setUploadTitle(suggestTitle(file?.name || ''))
              }}
            />
            {selectedFile ? <div className="small text-muted mt-1">Đã chọn: {selectedFile.name}</div> : null}
            {uploading ? <div className="small text-muted mt-1">Đang upload...</div> : null}
          </div>
          <div className="col-12 col-md-3">
            <div className="d-grid gap-2">
              <button className="btn btn-primary" type="button" onClick={upload} disabled={uploading || !selectedFile}>
                {uploading ? 'Đang tải lên...' : 'Upload ảnh'}
              </button>
              <button className="btn btn-secondary" type="button" onClick={() => load()}>Tải lại</button>
            </div>
          </div>
        </div>

        <div className="row g-2 mt-1">
          <div className="col-12 col-md-9">
            <label className="form-label">Tiêu đề ảnh</label>
            <input
              className="form-control"
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
              placeholder="Ví dụ: Hoạt động tại xã"
              disabled={uploading || !selectedFile}
            />
            <div className="form-text">Tiêu đề dùng để hiển thị cho người xem. Tên file vật lý sẽ do hệ thống quản lý.</div>
          </div>
        </div>

        <div className="row g-2 align-items-end mt-1">
          <div className="col-12 col-md-6">
            <label className="form-label">Lọc danh sách theo topic</label>
            <input
              className="form-control"
              value={filterTopic}
              onChange={(e) => setFilterTopic(e.target.value)}
              placeholder="Để trống để xem tất cả"
            />
          </div>
          <div className="col-12 col-md-6 d-flex gap-2">
            <button className="btn btn-outline-secondary" type="button" onClick={() => load(filterTopic)}>Lọc</button>
            <button
              className="btn btn-outline-dark"
              type="button"
              onClick={async () => {
                setFilterTopic('')
                await load('')
              }}
            >
              Xem tất cả
            </button>
          </div>
        </div>
      </div>

      <div className="media-grid">
        {items.map((x) => (
          <div key={x.id} className="media-card">
            <div className="media-thumb" style={{ backgroundImage: `url("${resolveApiUrl(x.url)}")` }} />
            <div className="p-3">
              <div className="fw-semibold text-truncate" title={x.title || x.fileName}>{x.title || x.fileName}</div>
              <div className="small text-muted text-truncate" title={x.fileName}>Tệp: {x.fileName}</div>
              <div className="small text-muted">Topic hiện tại: {x.topic || '(trống)'}</div>
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
                <button
                  className="btn btn-sm btn-success"
                  type="button"
                  onClick={() => saveTopic(x)}
                  disabled={savingId === x.id}
                >
                  {savingId === x.id ? 'Đang lưu' : 'Lưu'}
                </button>
              </div>
              <div className="d-flex gap-2 mt-2 flex-wrap">
                <a className="btn btn-sm btn-outline-primary" href={resolveApiUrl(x.url)} target="_blank" rel="noreferrer">Mở</a>
                <button className="btn btn-sm btn-outline-secondary" type="button" onClick={() => copy(x.url)}>Copy URL</button>
                <label className="btn btn-sm btn-outline-warning mb-0">
                  {replacingId === x.id ? 'Đang thay...' : 'Thay ảnh'}
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,.gif,.bmp,.jfif,image/*"
                    hidden
                    disabled={replacingId === x.id}
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      replaceFile(x, file)
                      e.target.value = ''
                    }}
                  />
                </label>
                <button
                  className="btn btn-sm btn-outline-danger"
                  type="button"
                  onClick={() => removeItem(x)}
                  disabled={deletingId === x.id || replacingId === x.id}
                >
                  {deletingId === x.id ? 'Đang xóa' : 'Xóa'}
                </button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 ? <div className="text-muted p-4 bg-white border rounded-4">Chưa có ảnh.</div> : null}
      </div>
    </div>
  )
}
