import { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Editor } from '@tinymce/tinymce-react'
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

export default function AdminArticleEditorPage({ mode }) {
  const { id } = useParams()
  const navigate = useNavigate()

  const [cats, setCats] = useState([])
  const [items, setItems] = useState([]) // used to fetch detail from list endpoint
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const isEdit = useMemo(() => mode === 'edit', [mode])

  const [form, setForm] = useState({
    categoryId: 0,
    title: '',
    slug: '',
    summary: '',
    contentHtml: '',
    status: 'Draft',
    thumbnailUrl: '',
  })

  async function loadCategories() {
    const r = await api.get('/api/admin/content/categories')
    setCats(r.data || [])
  }

  async function loadArticlesList() {
    const r = await api.get('/api/admin/content/articles')
    setItems(r.data || [])
  }

  useEffect(() => {
    ;(async () => {
      setError('')
      try {
        await Promise.all([loadCategories(), loadArticlesList()])
      } catch {
        setError('Không tải được dữ liệu. Hãy đăng nhập lại.')
      }
    })()
  }, [])

  useEffect(() => {
    if (!isEdit) return
    if (!items.length) return

    const intId = Number(id)
    const found = items.find((x) => x.id === intId)
    if (!found) return

    setForm((f) => ({
      ...f,
      categoryId: found.categoryId,
      title: found.title || '',
      slug: found.slug || '',
      summary: found.summary || '',
      contentHtml: found.contentHtml || f.contentHtml,
      status: found.status || 'Draft',
      thumbnailUrl: found.thumbnailUrl || '',
    }))
  }, [isEdit, items, id])

  useEffect(() => {
    if (!form.categoryId && cats.length) setForm((f) => ({ ...f, categoryId: cats[0].id }))
  }, [cats, form.categoryId])

  async function uploadImage(file) {
    if (!file) return null
    const fd = new FormData()
    fd.append('file', file)
    fd.append('topic', 'articles')
    const r = await api.post('/api/admin/content/media/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    return r.data.url
  }

  async function uploadThumb(file) {
    setError('')
    setUploading(true)
    try {
      const url = await uploadImage(file)
      if (url) setForm((f) => ({ ...f, thumbnailUrl: url }))
    } catch (err) {
      setError(err?.response?.data?.message || 'Upload ảnh thất bại.')
    } finally {
      setUploading(false)
    }
  }

  async function save(e) {
    e.preventDefault()
    setError('')

    const payload = {
      categoryId: Number(form.categoryId),
      title: form.title.trim(),
      slug: (form.slug || slugify(form.title)).trim(),
      summary: form.summary?.trim() || null,
      contentHtml: form.contentHtml || '',
      status: form.status,
      thumbnailUrl: form.thumbnailUrl || null,
    }

    if (!payload.title) {
      setError('Tiêu đề là bắt buộc.')
      return
    }

    try {
      setSaving(true)
      if (isEdit) await api.put(`/api/admin/content/articles/${Number(id)}`, payload)
      else await api.post('/api/admin/content/articles', payload)

      navigate('/admin/articles', { replace: true })
    } catch (err) {
      setError(err?.response?.data?.message || 'Không lưu được bài viết.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <Helmet>
        <title>{isEdit ? 'Sửa bài viết' : 'Tạo bài viết'} | Admin</title>
      </Helmet>

      <div className="d-flex align-items-end justify-content-between mb-3">
        <div>
          <div className="badge text-bg-primary">Tin tức</div>
          <h1 className="h3 fw-bold mb-0">{isEdit ? 'Sửa bài viết' : 'Tạo bài viết'}</h1>
        </div>
        <div className="d-flex gap-2">
          <Link className="btn btn-outline-secondary" to="/admin/articles">Quay lại</Link>
        </div>
      </div>

      {error ? <div className="alert alert-warning">{error}</div> : null}

      <form className="d-flex flex-column gap-3" onSubmit={save}>
        <div className="p-4 bg-white border rounded-4">
          <div className="row g-2">
            <div className="col-12 col-md-8">
              <label className="form-label">Tiêu đề</label>
              <input className="form-control" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: isEdit ? form.slug : slugify(e.target.value) })} />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label">Danh mục</label>
              <select className="form-select" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })}>
                {cats.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-8">
              <label className="form-label">Slug</label>
              <input className="form-control" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label">Trạng thái</label>
              <select className="form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>
            <div className="col-12">
              <label className="form-label">Tóm tắt</label>
              <textarea className="form-control" rows={3} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
            </div>
          </div>
        </div>

        <div className="p-4 bg-white border rounded-4">
          <div className="fw-bold mb-2">Nội dung</div>
          <Editor
            value={form.contentHtml}
            onEditorChange={(v) => setForm({ ...form, contentHtml: v })}
            init={{
              height: 520,
              menubar: true,
              plugins: 'lists link image table code preview autolink media',
              toolbar: 'undo redo | blocks | bold italic underline | alignleft aligncenter alignright | bullist numlist | link image media | table | code | preview',
              images_upload_handler: async (blobInfo) => {
                const file = blobInfo.blob()
                const url = await uploadImage(file)
                return url
              },
            }}
          />
          <div className="small text-muted mt-2">Gợi ý: bạn có thể kéo thả ảnh vào editor (sẽ upload lên /uploads).</div>
        </div>

        <div className="p-4 bg-white border rounded-4">
          <div className="fw-bold mb-2">Ảnh đại diện</div>
          <div className="d-flex align-items-center gap-3 flex-wrap">
            <div style={{ width: 160, height: 90, borderRadius: 16, backgroundImage: `url(${form.thumbnailUrl || '/hero/0.png'})`, backgroundSize: 'cover', backgroundPosition: 'center', border: '1px solid rgba(0,0,0,0.06)' }} />
            <div className="d-flex flex-column gap-2" style={{ minWidth: 320 }}>
              <input className="form-control" placeholder="Thumbnail URL" value={form.thumbnailUrl} onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })} />
              <input className="form-control" type="file" accept="image/*" disabled={uploading} onChange={(e) => uploadThumb(e.target.files?.[0])} />
              {uploading ? <div className="small text-muted">Đang upload...</div> : null}
            </div>
          </div>
        </div>

        <div className="d-flex gap-2">
          <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu bài viết'}</button>
          <button className="btn btn-outline-secondary" type="button" onClick={() => navigate('/admin/articles')}>Hủy</button>
        </div>
      </form>
    </div>
  )
}
