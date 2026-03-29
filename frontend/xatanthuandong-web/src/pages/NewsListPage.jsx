import { useEffect, useMemo, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../lib/api'

function fmtDate(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' })
  } catch {
    return ''
  }
}

function Featured({ item }) {
  if (!item) return null
  return (
    <div className="p-0 bg-white border rounded-4 overflow-hidden" data-aos="fade-up">
      <Link to={`/tin-tuc/${item.slug}`} className="text-decoration-none">
        <div className="featured-hero" style={{ backgroundImage: `url(${item.thumbnailUrl || '/hero/0.png'})` }}>
          <div className="featured-overlay">
            <div className="d-flex align-items-center gap-2">
              <span className="badge text-bg-light">Nổi bật</span>
              {item.categoryName ? <span className="badge text-bg-primary">{item.categoryName}</span> : null}
            </div>
            <div className="display-6 fw-bold mt-2 mb-2 text-white">{item.title}</div>
            {item.summary ? <div className="text-white-50 line-clamp-2">{item.summary}</div> : null}
          </div>
        </div>
      </Link>
    </div>
  )
}

function SmallCard({ item }) {
  return (
    <Link className="text-decoration-none" to={`/tin-tuc/${item.slug}`}>
      <div className="card nice-card h-100">
        <div className="card-img-top nice-card-img" style={{ backgroundImage: `url(${item.thumbnailUrl || '/hero/1.png'})` }} />
        <div className="card-body">
          <div className="d-flex align-items-center justify-content-between gap-2 mb-1">
            <div className="small text-muted">{item.categoryName}</div>
            <div className="small text-muted">{fmtDate(item.publishedAtUtc)}</div>
          </div>
          <div className="fw-semibold text-dark line-clamp-2">{item.title}</div>
        </div>
      </div>
    </Link>
  )
}

function GridCard({ item }) {
  return (
    <Link className="text-decoration-none" to={`/tin-tuc/${item.slug}`}>
      <div className="card nice-card h-100">
        <div className="card-img-top nice-card-img" style={{ backgroundImage: `url(${item.thumbnailUrl || '/hero/1.png'})` }} />
        <div className="card-body">
          <div className="d-flex align-items-center justify-content-between gap-2 mb-1">
            <div className="small text-muted">{item.categoryName}</div>
            <div className="small text-muted">{fmtDate(item.publishedAtUtc)}</div>
          </div>
          <div className="fw-semibold text-dark line-clamp-2">{item.title}</div>
          {item.summary ? <div className="small text-muted line-clamp-2 mt-1">{item.summary}</div> : null}
        </div>
      </div>
    </Link>
  )
}

function Trending({ items }) {
  return (
    <div className="p-4 bg-white border rounded-4" data-aos="fade-left">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <div className="fw-bold">Đang được quan tâm</div>
        <span className="badge text-bg-light">Top</span>
      </div>
      <div className="d-flex flex-column gap-2">
        {items.map((a, i) => (
          <Link key={a.id} to={`/tin-tuc/${a.slug}`} className="text-decoration-none">
            <div className="d-flex gap-2 align-items-start hover-lift p-2 rounded-3" style={{ background: '#f6f8fb' }}>
              <div className="trend-rank">{i + 1}</div>
              <div>
                <div className="small text-muted">{a.categoryName}</div>
                <div className="small fw-semibold text-dark line-clamp-2">{a.title}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

function SpotlightSlider({ items }) {
  const [i, setI] = useState(0)
  const safeItems = items || []

  useEffect(() => {
    if (!safeItems.length) return undefined
    const t = window.setInterval(() => setI((v) => (v + 1) % safeItems.length), 4500)
    return () => window.clearInterval(t)
  }, [safeItems.length])

  if (!safeItems.length) return null

  const current = safeItems[i]

  return (
    <div className="p-0 bg-white border rounded-4 overflow-hidden" data-aos="fade-up" data-aos-delay="40">
      <div className="d-flex align-items-center justify-content-between p-3 border-bottom" style={{ background: '#fff' }}>
        <div className="fw-bold">Tin nổi bật</div>
        <div className="d-flex gap-2 align-items-center">
          <button className="btn btn-outline-primary btn-sm" type="button" onClick={() => setI((v) => (v - 1 + safeItems.length) % safeItems.length)}>
            Trước
          </button>
          <button className="btn btn-outline-primary btn-sm" type="button" onClick={() => setI((v) => (v + 1) % safeItems.length)}>
            Sau
          </button>
        </div>
      </div>

      <Link to={`/tin-tuc/${current.slug}`} className="text-decoration-none">
        <div className="featured-hero" style={{ minHeight: 260, backgroundImage: `url(${current.thumbnailUrl || '/hero/2.png'})` }}>
          <div className="featured-overlay">
            <div className="d-flex align-items-center gap-2">
              {current.categoryName ? <span className="badge text-bg-primary">{current.categoryName}</span> : null}
              <span className="badge text-bg-light">{fmtDate(current.publishedAtUtc)}</span>
            </div>
            <div className="h4 fw-bold mt-2 mb-2 text-white">{current.title}</div>
            {current.summary ? <div className="text-white-50 line-clamp-2">{current.summary}</div> : null}
          </div>
        </div>
      </Link>

      <div className="p-3" style={{ background: '#fff' }}>
        <div className="d-flex gap-2 overflow-auto" style={{ scrollSnapType: 'x mandatory' }}>
          {safeItems.map((a, idx) => (
            <button
              key={a.id}
              type="button"
              className={`btn btn-sm ${idx === i ? 'btn-primary' : 'btn-outline-primary'}`}
              style={{ whiteSpace: 'nowrap', scrollSnapAlign: 'start' }}
              onClick={() => setI(idx)}
              title={a.title}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function NewsListPage() {
  const [params, setParams] = useSearchParams()
  const [q, setQ] = useState(params.get('q') || '')
  const [categoryId, setCategoryId] = useState(params.get('categoryId') || '')
  const [sort, setSort] = useState(params.get('sort') || 'new') // new | old
  const [fromDate, setFromDate] = useState(params.get('from') || '') // YYYY-MM-DD
  const [toDate, setToDate] = useState(params.get('to') || '')
  const [suggestions, setSuggestions] = useState([])
  const suggestTimerRef = useRef(null)

  const [categories, setCategories] = useState([])
  const [articles, setArticles] = useState([])
  const [visible, setVisible] = useState(10)
  const [autoLoad, setAutoLoad] = useState(true)
  const [view, setView] = useState('grid') // 'grid' | 'list'

  useEffect(() => {
    api.get('/api/public/categories').then((r) => setCategories(r.data)).catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    return () => {
      if (suggestTimerRef.current) window.clearTimeout(suggestTimerRef.current)
    }
  }, [])

  useEffect(() => {
    const p = new URLSearchParams()
    if (q) p.set('q', q)
    if (categoryId) p.set('categoryId', categoryId)
    if (sort && sort !== 'new') p.set('sort', sort)
    if (fromDate) p.set('from', fromDate)
    if (toDate) p.set('to', toDate)
    setParams(p, { replace: true })

    const qs = {}
    if (q) qs.q = q
    if (categoryId) qs.categoryId = categoryId

    const hasAdvanced = Boolean(fromDate || toDate)
    if (fromDate) qs.fromUtc = new Date(`${fromDate}T00:00:00Z`).toISOString()
    if (toDate) qs.toUtc = new Date(`${toDate}T23:59:59Z`).toISOString()

    const url = hasAdvanced ? '/api/public/articles/search' : '/api/public/articles'

    api.get(url, { params: qs }).then((r) => {
      let data = r.data || []
      data = [...data].sort((a, b) => {
        const ta = a.publishedAtUtc ? new Date(a.publishedAtUtc).getTime() : 0
        const tb = b.publishedAtUtc ? new Date(b.publishedAtUtc).getTime() : 0
        return sort === 'old' ? ta - tb : tb - ta
      })
      setArticles(data)
      setVisible(10)
    }).catch(() => {
      setArticles([])
      setVisible(10)
    })
  }, [q, categoryId, fromDate, toDate, sort, setParams])

  // Gợi ý tìm kiếm (debounce)
  useEffect(() => {
    if (suggestTimerRef.current) window.clearTimeout(suggestTimerRef.current)

    const keyword = q.trim()
    if (keyword.length < 2) {
      setSuggestions([])
      return
    }

    suggestTimerRef.current = window.setTimeout(() => {
      api.get('/api/public/articles/suggest', { params: { q: keyword } })
        .then((r) => setSuggestions(r.data || []))
        .catch(() => setSuggestions([]))
    }, 250)
  }, [q])

  // Tải thêm khi người dùng cuộn gần cuối trang (infinite scroll)
  useEffect(() => {
    if (!autoLoad) return
    const canLoadMore = articles.length > 5 + visible
    if (!canLoadMore) return

    let ticking = false
    function onScroll() {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(() => {
        ticking = false
        const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 420
        if (nearBottom) setVisible((v) => v + 10)
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [autoLoad, articles.length, visible])

  const featured = useMemo(() => articles[0] || null, [articles])
  const topStories = useMemo(() => articles.slice(1, 5), [articles])
  const latest = useMemo(() => articles.slice(5, 5 + visible), [articles, visible])
  const trending = useMemo(() => articles.slice(0, 5), [articles])
  const catMap = useMemo(() => new Map(categories.map((c) => [String(c.id), c.name])), [categories])
  const spotlight = useMemo(() => articles.slice(0, 6), [articles])

  return (
    <div className="container py-4 py-lg-5">
      <Helmet>
        <title>Tin tức | Xã Tân Thuận Đông</title>
      </Helmet>

      <div className="mb-3" data-aos="fade-up">
        <div className="badge text-bg-primary">Tin tức</div>
        <h1 className="h2 fw-bold mb-1">Bản tin địa phương</h1>
        <div className="text-muted">Cập nhật tin nổi bật, mới nhất và thông báo từ UBND xã</div>
      </div>

      <div className="bg-white border rounded-4 p-3 mb-4" data-aos="fade-up" data-aos-delay="60">
        <div className="d-flex flex-column flex-lg-row gap-2 align-items-lg-center justify-content-between">
          <div className="d-flex gap-2 flex-wrap" style={{ alignItems: 'flex-start' }}>
            <div style={{ minWidth: 260 }}>
              <input
                className="form-control"
                placeholder="Tìm kiếm tin tức..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              {suggestions.length ? (
                <div className="list-group position-absolute mt-1" style={{ zIndex: 20, width: 260 }}>
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className="list-group-item list-group-item-action"
                      onClick={() => {
                        setQ(s)
                        setSuggestions([])
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <select className="form-select" style={{ minWidth: 220 }} value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              <option value="">Tất cả danh mục</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select className="form-select" style={{ minWidth: 200 }} value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="new">Mới nhất</option>
              <option value="old">Cũ hơn</option>
            </select>

            <input
              type="date"
              className="form-control"
              style={{ minWidth: 170 }}
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              title="Từ ngày"
            />
            <input
              type="date"
              className="form-control"
              style={{ minWidth: 170 }}
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              title="Đến ngày"
            />

            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => {
                setQ('')
                setCategoryId('')
                setFromDate('')
                setToDate('')
                setSort('new')
                setSuggestions([])
              }}
            >
              Xóa lọc
            </button>
          </div>

          <div className="d-flex align-items-center gap-3 flex-wrap justify-content-lg-end">
            <div className="btn-group" role="group" aria-label="Chế độ hiển thị">
              <button
                type="button"
                className={`btn btn-sm ${view === 'grid' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setView('grid')}
              >
                Lưới
              </button>
              <button
                type="button"
                className={`btn btn-sm ${view === 'list' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setView('list')}
              >
                Danh sách
              </button>
            </div>

            <label className="form-check form-switch d-flex align-items-center gap-2 m-0">
              <input
                className="form-check-input"
                type="checkbox"
                checked={autoLoad}
                onChange={(e) => setAutoLoad(e.target.checked)}
              />
              <span className="small text-muted">Tải thêm khi cuộn</span>
            </label>

            <div className="small text-muted">
              Gợi ý: <Link to="/tin-tuc?q=chợ%20cù%20lao">Chợ Cù Lao</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <Featured item={featured} />

          <div className="mt-4">
            <SpotlightSlider items={spotlight} />
          </div>

          {topStories.length ? (
            <div className="mt-4" data-aos="fade-up" data-aos-delay="80">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="fw-bold">Tin đáng chú ý</div>
                <span className="small text-muted">Top 4</span>
              </div>
              <div className="row g-3">
                {topStories.map((a) => (
                  <div key={a.id} className="col-12 col-md-6">
                    <SmallCard item={{ ...a, categoryName: catMap.get(String(a.categoryId)) || a.categoryName }} />
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-4" data-aos="fade-up" data-aos-delay="120">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <div className="fw-bold">Mới nhất</div>
              <span className="small text-muted">{articles.length} bài</span>
            </div>

            {view === 'grid' ? (
              <div className="row g-3">
                {latest.map((a, idx) => (
                  <div key={a.id} className="col-12 col-sm-6 col-lg-4" data-aos="fade-up" data-aos-delay={idx * 20}>
                    <GridCard item={{ ...a, categoryName: catMap.get(String(a.categoryId)) || a.categoryName }} />
                  </div>
                ))}

                {articles.length === 0 ? (
                  <div className="col-12">
                    <div className="p-4 bg-white border rounded-4 text-muted">Chưa có bài viết phù hợp.</div>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {latest.map((a, idx) => (
                  <Link key={a.id} className="text-decoration-none" to={`/tin-tuc/${a.slug}`}>
                    <div className="d-flex gap-3 p-3 bg-white border rounded-4 hover-lift" data-aos="fade-up" data-aos-delay={idx * 25}>
                      <div className="news-thumb" style={{ backgroundImage: `url(${a.thumbnailUrl || '/hero/1.png'})` }} />
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap">
                          <div className="small text-muted mb-1">{catMap.get(String(a.categoryId)) || a.categoryName}</div>
                          <div className="small text-muted mb-1">{fmtDate(a.publishedAtUtc)}</div>
                        </div>
                        <div className="fw-semibold text-dark mb-1">{a.title}</div>
                        {a.summary ? <div className="text-muted line-clamp-2">{a.summary}</div> : null}
                      </div>
                    </div>
                  </Link>
                ))}

                {articles.length === 0 ? (
                  <div className="p-4 bg-white border rounded-4 text-muted">Chưa có bài viết phù hợp.</div>
                ) : null}
              </div>
            )}

            {articles.length > 5 + visible ? (
              <div className="d-grid mt-3">
                <button className="btn btn-outline-primary" onClick={() => setVisible((v) => v + 10)} type="button">
                  Tải thêm
                </button>
                {autoLoad ? <div className="text-center small text-muted mt-2">Đang bật tải thêm khi cuộn</div> : null}
              </div>
            ) : null}
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="sticky-lg-top" style={{ top: 110 }}>
            <Trending items={trending} />

            <div className="p-4 bg-white border rounded-4 mt-4" data-aos="fade-left">
              <div className="fw-bold mb-2">Danh mục</div>
              <div className="list-group">
                <button className={`list-group-item list-group-item-action ${categoryId === '' ? 'active' : ''}`} onClick={() => setCategoryId('')} type="button">
                  Tất cả
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    className={`list-group-item list-group-item-action ${String(c.id) === String(categoryId) ? 'active' : ''}`}
                    onClick={() => setCategoryId(String(c.id))}
                    type="button"
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 bg-white border rounded-4 mt-4" data-aos="fade-left">
              <div className="fw-bold mb-2">Dịch vụ nhanh</div>
              <div className="d-grid gap-2">
                <Link className="btn btn-outline-primary" to="/dich-vu">Nộp hồ sơ trực tuyến</Link>
                <Link className="btn btn-outline-primary" to="/dich-vu">Tra cứu trạng thái</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
