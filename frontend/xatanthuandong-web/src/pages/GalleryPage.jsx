import { Helmet } from 'react-helmet-async'

const demo = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  title: `Hình ảnh hoạt động ${i + 1}`,
  color: i % 3 === 0 ? '#0d6efd' : i % 3 === 1 ? '#20c997' : '#6f42c1',
}))

export default function GalleryPage() {
  return (
    <div className="container py-4 py-lg-5">
      <Helmet>
        <title>Thư viện | Xã Tân Thuận Đông</title>
      </Helmet>

      <div className="d-flex justify-content-between align-items-end mb-3">
        <div>
          <div className="badge text-bg-primary">Thư viện</div>
          <h1 className="h2 fw-bold mb-1">Hình ảnh</h1>
          <div className="text-muted">Gallery theo chủ đề (demo)</div>
        </div>
      </div>

      <div className="row g-3">
        {demo.map((x, idx) => (
          <div key={x.id} className="col-12 col-md-6 col-lg-4" data-aos="zoom-in" data-aos-delay={idx * 40}>
            <div className="nice-card bg-white">
              <div className="nice-card-img" style={{ backgroundImage: `linear-gradient(135deg, ${x.color}, rgba(0,0,0,0.25))` }} />
              <div className="p-3">
                <div className="fw-semibold">{x.title}</div>
                <div className="text-muted small">Chủ đề: Hoạt động địa phương</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
