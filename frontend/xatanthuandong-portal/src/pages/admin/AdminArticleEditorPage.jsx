import { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Editor } from '@tinymce/tinymce-react'
import { api } from '../../lib/api'
import { resolveApiUrl } from '../../lib/url'

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

function injectSecondaryImage(contentHtml, imageUrl) {
  if (!imageUrl) return contentHtml || ''
  if ((contentHtml || '').includes(imageUrl)) return contentHtml || ''
  return `${contentHtml || ''}<p><img src="${imageUrl}" alt="Ảnh minh họa" /></p>`
}

export default function AdminArticleEditorPage({ mode }) {
  const { id } = useParams()
  const navigate = useNavigate()

  const [cats, setCats] = useState([])
  const [items, setItems] = useState([])
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
    secondaryImageUrl: '',
  })

  async function loadCategories() {
    const r = await api.get('/api/admin/content/categories')
    setCats(r.data || [])
  }

  async function loadArticles() {
    const r = await api.get('/api/admin/content/articles')
    setItems(r.data || [])
  }

  async function loadDetail(articleId) {
    const r = await api.get(`/api/admin/content/articles/${articleId}`)
    return r.data
  }

  useEffect(() => {
    ;(async () => {
      setError('')
      try {
        await Promise.all([loadCategories(), loadArticles()])
      } catch {
        setError('Không tải được dữ liệu ban đầu.')
      }
    })()
  }, [])

  useEffect(() => {
    if (!isEdit || !items.length) return

    const intId = Number(id)
    const found = items.find((x) => x.id === intId)
    if (!found) return

    loadDetail(intId)
      .then((detail) => {
        setForm((f) => ({
          ...f,
          categoryId: detail.categoryId,
          title: detail.title || '',
          slug: detail.slug || '',
          summary: detail.summary || '',
          contentHtml: detail.contentHtml || '',
          status: detail.status || 'Draft',
          thumbnailUrl: detail.thumbnailUrl || '',
        }))
      })
      .catch(() => {
        setError('Không tải được chi tiết bài viết.')
      })
  }, [isEdit, items, id])

  useEffect(() => {
    if (!form.categoryId && cats.length) {
      setForm((f) => ({ ...f, categoryId: cats[0].id }))
    }
  }, [cats, form.categoryId])

  async function uploadImage(file, topic = 'articles') {
    if (!file) return null
    const fd = new FormData()
    fd.append('file', file)
    fd.append('topic', topic)
    const r = await api.post('/api/admin/content/media/upload', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return r.data.url
  }

  async function uploadThumb(file) {
    setError('')
    setUploading(true)
    try {
      const url = await uploadImage(file, 'articles-thumb')
      if (url) setForm((f) => ({ ...f, thumbnailUrl: url }))
    } catch (err) {
      setError(err?.response?.data?.message || 'Upload ảnh đại diện thất bại.')
    } finally {
      setUploading(false)
    }
  }

  async function uploadSecondary(file) {
    setError('')
    setUploading(true)
    try {
      const url = await uploadImage(file, 'articles-secondary')
      if (url) setForm((f) => ({ ...f, secondaryImageUrl: url }))
    } catch (err) {
      setError(err?.response?.data?.message || 'Upload ảnh thứ 2 thất bại.')
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
      contentHtml: injectSecondaryImage(form.contentHtml, form.secondaryImageUrl),
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
        <title>{isEdit ? 'Sửa bài viết' : 'Tạo bài viết'} | Admin Portal</title>
      </Helmet>

      <div className="section-head">
        <div>
          <div className="section-chip">Nội dung</div>
          <h2>{isEdit ? 'Sửa bài viết' : 'Tạo bài viết mới'}</h2>
        </div>
        <Link className="btn btn-outline-secondary" to="/admin/articles">Quay lại</Link>
      </div>

      {error ? <div className="alert alert-warning">{error}</div> : null}

      <form className="d-flex flex-column gap-3" onSubmit={save}>
        <div className="surface-card">
          <div className="row g-2">
            <div className="col-12 col-md-8">
              <label className="form-label">Tiêu đề</label>
              <input className="form-control" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value, slug: isEdit ? f.slug : slugify(e.target.value) }))} />
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

        <div className="surface-card">
          <div className="fw-semibold mb-2">Nội dung bài viết</div>
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
                const url = await uploadImage(file, 'articles-content')
                return url
              },
            }}
          />
          <div className="small text-muted mt-2">Kéo thả ảnh vào editor hoặc dùng khối upload bên dưới.</div>
        </div>

        <div className="surface-card">
          <div className="fw-semibold mb-2">Ảnh đại diện và ảnh thứ 2</div>
          <div className="row g-3">
            <div className="col-12 col-lg-6">
              <div className="small text-muted mb-2">Ảnh đại diện</div>
              <div className="image-duo">
                <div className="image-preview" style={form.thumbnailUrl ? { backgroundImage: `url(${resolveApiUrl(form.thumbnailUrl)})` } : { background: 'linear-gradient(135deg, #dbeafe, #e0f2fe)' }} />
                <div className="d-flex flex-column gap-2">
                  <input className="form-control" placeholder="Thumbnail URL" value={form.thumbnailUrl} onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })} />
                  <input className="form-control" type="file" accept="image/*" disabled={uploading} onChange={(e) => uploadThumb(e.target.files?.[0])} />
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-6">
              <div className="small text-muted mb-2">Ảnh thứ 2 (tự chèn vào cuối nội dung khi lưu)</div>
              <div className="image-duo">
                <div className="image-preview" style={form.secondaryImageUrl ? { backgroundImage: `url(${resolveApiUrl(form.secondaryImageUrl)})` } : { background: 'linear-gradient(135deg, #ede9fe, #f5f3ff)' }} />
                <div className="d-flex flex-column gap-2">
                  <input className="form-control" placeholder="Secondary image URL" value={form.secondaryImageUrl} onChange={(e) => setForm({ ...form, secondaryImageUrl: e.target.value })} />
                  <input className="form-control" type="file" accept="image/*" disabled={uploading} onChange={(e) => uploadSecondary(e.target.files?.[0])} />
                </div>
              </div>
            </div>
          </div>
          {uploading ? <div className="small text-muted mt-2">Đang upload ảnh...</div> : null}
        </div>

        <div className="d-flex gap-2">
          <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu bài viết'}</button>
          <button className="btn btn-outline-secondary" type="button" onClick={() => navigate('/admin/articles')}>Hủy</button>
        </div>
      </form>
    </div>
  )
}
