import { Helmet } from 'react-helmet-async'
import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { resolveApiUrl } from '../lib/url'

export default function GalleryPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 9

  useEffect(() => {
    let ignore = false

    async function load() {
      setLoading(true)
      setError('')
      try {
        const r = await api.get('/api/public/media', {
          params: { page, pageSize, t: Date.now() },
        })
        const payload = r.data

        if (!ignore) {
          if (Array.isArray(payload)) {
            setItems(payload)
            setTotal(payload.length)
            setTotalPages(1)
          } else {
            setItems(Array.isArray(payload?.items) ? payload.items : [])
            setTotal(Number(payload?.total || 0))
            setTotalPages(Number(payload?.totalPages || 1) || 1)
          }
        }
      } catch {
        if (!ignore) {
          setError('Không tải được thư viện ảnh.')
          setItems([])
          setTotal(0)
          setTotalPages(1)
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    load()
    return () => {
      ignore = true
    }
  }, [page])

  function formatDate(utc) {
    if (!utc) return ''
    try {
      return new Date(utc).toLocaleDateString('vi-VN')
    } catch {
      return ''
    }
  }

  return (
    <div className="container py-4 py-lg-5">
      <Helmet>
        <title>Thư viện | Xã Tân Thuận Đông</title>
      </Helmet>

      <div className="d-flex justify-content-between align-items-end mb-3">
        <div>
          <div className="badge text-bg-primary">Thư viện</div>
          <h1 className="h2 fw-bold mb-1">Hình ảnh</h1>
          <div className="text-muted">Hình ảnh hoạt động địa phương</div>
        </div>
        <div className="text-muted small">Tổng ảnh: {total}</div>
      </div>

      {error ? <div className="alert alert-warning">{error}</div> : null}

      <div className="row g-3">
        {items.map((x, idx) => (
          <div key={x.id} className="col-12 col-md-6 col-lg-4" data-aos="zoom-in" data-aos-delay={idx * 40}>
            <div className="nice-card bg-white">
              <div className="nice-card-img" style={{ backgroundImage: `url(${resolveApiUrl(x.url)})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              <div className="p-3">
                <div className="fw-semibold text-truncate" title={x.fileName}>{x.fileName || `Hình ảnh #${x.id}`}</div>
                <div className="text-muted small">Ngày đăng: {formatDate(x.uploadedAtUtc) || 'N/A'}</div>
              </div>
            </div>
          </div>
        ))}

        {!loading && items.length === 0 ? (
          <div className="col-12">
            <div className="nice-card bg-white p-4 text-muted">Chưa có ảnh trong thư viện. Vào trang admin để thêm ảnh mới.</div>
          </div>
        ) : null}

        {loading ? (
          <div className="col-12">
            <div className="nice-card bg-white p-4 text-muted">Đang tải thư viện ảnh...</div>
          </div>
        ) : null}
      </div>

      {!loading && totalPages > 1 ? (
        <nav className="mt-4" aria-label="Phân trang thư viện">
          <ul className="pagination justify-content-center flex-wrap gap-1">
            <li className={`page-item ${page <= 1 ? 'disabled' : ''}`}>
              <button className="page-link" type="button" onClick={() => setPage((p) => Math.max(1, p - 1))}>Trước</button>
            </li>

            {Array.from({ length: totalPages }).map((_, idx) => {
              const value = idx + 1
              return (
                <li key={value} className={`page-item ${value === page ? 'active' : ''}`}>
                  <button className="page-link" type="button" onClick={() => setPage(value)}>{value}</button>
                </li>
              )
            })}

            <li className={`page-item ${page >= totalPages ? 'disabled' : ''}`}>
              <button className="page-link" type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Sau</button>
            </li>
          </ul>
        </nav>
      ) : null}
    </div>
  )
}
