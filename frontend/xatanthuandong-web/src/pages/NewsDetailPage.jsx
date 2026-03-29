import { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useParams } from 'react-router-dom'
import { api } from '../lib/api'

function fmtDateTime(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
}

function RelatedItem({ a }) {
  return (
    <Link to={`/tin-tuc/${a.slug}`} className="text-decoration-none">
      <div className="d-flex gap-2 p-2 rounded-3 hover-lift" style={{ background: '#f6f8fb' }}>
        <div className="news-thumb" style={{ width: 84, height: 64, backgroundImage: `url(${a.thumbnailUrl || '/hero/1.png'})` }} />
        <div className="flex-grow-1">
          <div className="small text-muted d-flex justify-content-between gap-2">
            <span>{a.categoryName || ''}</span>
            <span>{fmtDateTime(a.publishedAtUtc)}</span>
          </div>
          <div className="small fw-semibold text-dark line-clamp-2">{a.title}</div>
        </div>
      </div>
    </Link>
  )
}

export default function NewsDetailPage() {
  const { slug } = useParams()
  const [article, setArticle] = useState(null)
  const [comments, setComments] = useState([])
  const [form, setForm] = useState({ authorName: '', authorEmail: '', content: '' })
  const [msg, setMsg] = useState('')
  const [related, setRelated] = useState([])
  const [searchQ, setSearchQ] = useState('')

  const shareUrl = useMemo(() => (typeof window !== 'undefined' ? window.location.href : ''), [])

  useEffect(() => {
    let alive = true
    api.get(`/api/public/articles/${slug}`).then((r) => {
      if (!alive) return
      setArticle(r.data)
      return Promise.all([
        api.get(`/api/public/articles/${r.data.id}/comments`),
        api.get('/api/public/articles', { params: { categoryId: r.data.categoryId } }),
      ])
    }).then((rs) => {
      if (!alive || !rs) return
      const [commentsRes, relatedRes] = rs
      setComments(commentsRes.data)
      // lọc ra bài hiện tại và lấy tối đa 6 bài gần nhất
      setRelated((relatedRes.data || []).filter((x) => x.slug !== slug).slice(0, 6))
    }).catch(() => {
      if (!alive) return
      setArticle(null)
      setComments([])
      setRelated([])
    })

    return () => { alive = false }
  }, [slug])

  async function submitComment(e) {
    e.preventDefault()
    if (!article) return
    setMsg('')
    try {
      await api.post(`/api/public/articles/${article.id}/comments`, form)
      setMsg('Bình luận đã gửi, đang chờ duyệt.')
      setForm({ authorName: '', authorEmail: '', content: '' })
    } catch {
      setMsg('Không gửi được bình luận. Vui lòng thử lại.')
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setMsg('Đã copy link chia sẻ!')
    } catch {
      setMsg('Không copy được link. Bạn thử copy thủ công trên thanh địa chỉ.')
    }
  }

  if (!article) {
    return (
      <div className="container py-5">
        <div className="p-4 bg-white border rounded-4">Không tìm thấy bài viết.</div>
      </div>
    )
  }

  return (
    <div className="container py-4 py-lg-5">
      <Helmet>
        <title>{article.title} | Xã Tân Thuận Đông</title>
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.summary || ''} />
        <meta property="og:url" content={shareUrl} />
        {article.thumbnailUrl ? <meta property="og:image" content={article.thumbnailUrl} /> : null}
      </Helmet>

      <div className="mb-3" data-aos="fade-up">
        <nav className="small text-muted">
          <Link to="/tin-tuc" className="text-decoration-none">Tin tức</Link> <span className="mx-1">/</span>
          <span>Bài viết</span>
        </nav>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-8" data-aos="fade-up">
          <div className="p-4 bg-white border rounded-4">
            {article.thumbnailUrl ? (
              <div className="news-cover" style={{ backgroundImage: `url(${article.thumbnailUrl})` }} />
            ) : null}

            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2 mt-3">
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <div className="badge text-bg-primary">{article.categoryName || 'Bài viết'}</div>
                {article.publishedAtUtc ? <span className="badge text-bg-light">{fmtDateTime(article.publishedAtUtc)}</span> : null}
              </div>
              <button className="btn btn-outline-primary btn-sm" onClick={copyLink} type="button">Chia sẻ (Copy link)</button>
            </div>

            <h1 className="h2 fw-bold mb-2 news-title">{article.title}</h1>
            {article.summary ? <div className="text-muted mb-3">{article.summary}</div> : null}

            <hr />
            <div className="content-html news-reader" dangerouslySetInnerHTML={{ __html: article.contentHtml }} />
          </div>
        </div>

        <div className="col-12 col-lg-4" data-aos="fade-left">
          <div className="p-4 bg-white border rounded-4 mb-4">
            <div className="fw-bold mb-2">Tìm tin nhanh</div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const v = searchQ.trim()
                if (!v) return
                window.location.href = `/tin-tuc?q=${encodeURIComponent(v)}`
              }}
              className="d-flex gap-2"
            >
              <input className="form-control" placeholder="Nhập từ khóa..." value={searchQ} onChange={(e) => setSearchQ(e.target.value)} />
              <button className="btn btn-primary" type="submit">Tìm</button>
            </form>
          </div>

          {related.length ? (
            <div className="p-4 bg-white border rounded-4 mb-4">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="fw-bold">Bài liên quan</div>
                <Link to={`/tin-tuc?categoryId=${article.categoryId}`} className="small text-decoration-none">Xem thêm</Link>
              </div>
              <div className="d-flex flex-column gap-2">
                {related.map((a) => <RelatedItem key={a.id} a={a} />)}
              </div>
            </div>
          ) : null}

          <div className="p-4 bg-white border rounded-4 mb-4">
            <div className="fw-bold mb-2">Bình luận</div>
            {comments.length === 0 ? <div className="text-muted">Chưa có bình luận.</div> : null}
            <div className="d-flex flex-column gap-2">
              {comments.map((c) => (
                <div key={c.id} className="p-2 rounded-3" style={{ background: '#f6f8fb' }}>
                  <div className="small fw-semibold">{c.authorName}</div>
                  <div className="small text-muted">{c.content}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-white border rounded-4">
            <div className="fw-bold mb-2">Gửi bình luận</div>
            <form onSubmit={submitComment} className="d-flex flex-column gap-2">
              <input className="form-control" placeholder="Họ tên" value={form.authorName} onChange={(e) => setForm({ ...form, authorName: e.target.value })} required />
              <input className="form-control" placeholder="Email (không bắt buộc)" value={form.authorEmail} onChange={(e) => setForm({ ...form, authorEmail: e.target.value })} />
              <textarea className="form-control" rows="4" placeholder="Nội dung" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
              <button className="btn btn-primary" type="submit">Gửi</button>
              {msg ? <div className="small text-muted">{msg}</div> : null}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
