import { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'

function fmtDate(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  } catch {
    return ''
  }
}

export default function TopicArticlesPage({ title, badge, description, categorySlug }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [category, setCategory] = useState(null)

  useEffect(() => {
    let alive = true

    async function load() {
      setLoading(true)
      setError('')
      try {
        const catsRes = await api.get('/api/public/categories')
        const foundCategory = (catsRes.data || []).find((x) => x.slug === categorySlug) || null
        if (alive) setCategory(foundCategory)

        if (!foundCategory) {
          if (alive) setItems([])
          return
        }

        const articlesRes = await api.get('/api/public/articles', {
          params: { categoryId: foundCategory.id, t: Date.now() },
        })
        if (!alive) return
        setItems(Array.isArray(articlesRes.data) ? articlesRes.data : [])
      } catch {
        if (!alive) return
        setError('Không tải được bài viết.')
        setItems([])
      } finally {
        if (alive) setLoading(false)
      }
    }

    load()
    return () => {
      alive = false
    }
  }, [categorySlug])

  const featured = useMemo(() => items[0] || null, [items])
  const list = useMemo(() => items.slice(1), [items])

  return (
    <div className="container py-4 py-lg-5">
      <Helmet>
        <title>{title} | Xã Tân Thuận Đông</title>
      </Helmet>

      <div className="mb-3">
        <div className="badge text-bg-primary">{badge}</div>
        <h1 className="h2 fw-bold mb-1">{title}</h1>
        <div className="text-muted">{description}</div>
      </div>

      {error ? <div className="alert alert-warning">{error}</div> : null}

      {!loading && !category ? (
        <div className="alert alert-info">
          Chưa có danh mục "{title}" trong hệ thống. Vào trang quản trị để tạo danh mục có slug <strong>{categorySlug}</strong>.
        </div>
      ) : null}

      {featured ? (
        <div className="p-0 bg-white border rounded-4 overflow-hidden mb-4">
          <Link to={`/tin-tuc/${featured.slug}`} className="text-decoration-none">
            <div className="featured-hero" style={{ minHeight: 280, backgroundImage: `url(${featured.thumbnailUrl || '/hero/2.png'})` }}>
              <div className="featured-overlay">
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <span className="badge text-bg-light">Nổi bật</span>
                  <span className="badge text-bg-primary">{category?.name || featured.categoryName}</span>
                  {featured.publishedAtUtc ? <span className="badge text-bg-light">{fmtDate(featured.publishedAtUtc)}</span> : null}
                </div>
                <div className="display-6 fw-bold mt-2 mb-2 text-white">{featured.title}</div>
                {featured.summary ? <div className="text-white-50 line-clamp-2">{featured.summary}</div> : null}
              </div>
            </div>
          </Link>
        </div>
      ) : null}

      {loading ? <div className="p-4 bg-white border rounded-4 text-muted">Đang tải bài viết...</div> : null}

      {!loading && list.length === 0 && featured ? (
        <div className="text-muted p-4 bg-white border rounded-4">Chưa có thêm bài viết khác trong mục này.</div>
      ) : null}

      {!loading && !items.length ? (
        <div className="text-muted p-4 bg-white border rounded-4">Chưa có bài viết nào trong mục này.</div>
      ) : null}

      {list.length ? (
        <div className="row g-3 mt-1">
          {list.map((item) => (
            <div key={item.id} className="col-12 col-md-6 col-lg-4">
              <Link className="text-decoration-none" to={`/tin-tuc/${item.slug}`}>
                <div className="card nice-card h-100">
                  <div className="card-img-top nice-card-img" style={{ backgroundImage: `url(${item.thumbnailUrl || '/hero/1.png'})` }} />
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between gap-2 mb-1">
                      <div className="small text-muted">{category?.name || item.categoryName}</div>
                      <div className="small text-muted">{fmtDate(item.publishedAtUtc)}</div>
                    </div>
                    <div className="fw-semibold text-dark line-clamp-2">{item.title}</div>
                    {item.summary ? <div className="small text-muted line-clamp-2 mt-1">{item.summary}</div> : null}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
