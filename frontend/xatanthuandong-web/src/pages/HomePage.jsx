import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'

import { api } from '../lib/api'

const HERO_SLIDES = [
  {
    img: '/hero/0.png',
    title: 'Chợ Cù Lao – Nét đặc trưng Tân Thuận Đông',
    desc: 'Không gian chợ địa phương, gắn với đời sống sinh hoạt và văn hoá.',
    cta: { label: 'Khám phá Tin tức', to: '/tin-tuc?q=chợ%20cù%20lao' },
  },
  {
    img: '/hero/1.png',
    title: 'Tin tức địa phương',
    desc: 'Cập nhật thông báo, hoạt động – sự kiện nhanh chóng.',
    cta: { label: 'Xem Tin tức', to: '/tin-tuc' },
  },
  {
    img: '/hero/2.png',
    title: 'Dịch vụ hành chính trực tuyến',
    desc: 'Tra cứu thủ tục, nộp hồ sơ và theo dõi trạng thái trực tuyến.',
    cta: { label: 'Xem Dịch vụ', to: '/dich-vu' },
  },
  {
    img: '/hero/3.png',
    title: 'Thư viện hình ảnh',
    desc: 'Góc nhìn về cảnh quan và hoạt động của địa phương.',
    cta: { label: 'Xem Thư viện', to: '/thu-vien' },
  },
]

const CONTACT = {
  hotline: '0277 389 8112',
  phoneDisplay: '0277 389 8112',
  email: 'ubnd.tanthuandong@dongthap.gov.vn',
  facebookUrl: 'https://www.facebook.com/xatannhuandong.dongthap',
}

export default function HomePage() {
  const [articles, setArticles] = useState([])

  useEffect(() => {
    api.get('/api/public/articles').then((r) => setArticles(r.data)).catch(() => setArticles([]))
  }, [])

  const top = useMemo(() => articles.slice(0, 6), [articles])

  return (
    <>
      <section className="hero-wrap">
        <div className="container py-4 py-lg-5">
          <div className="row g-4 align-items-center">
            <div className="col-12" data-aos="fade-up">
              <div className="badge text-bg-primary mb-3">Cổng thông tin điện tử</div>
              <h1 className="display-5 fw-bold mb-2">Xã Tân Thuận Đông</h1>
              <p className="lead text-muted mb-0">
                Nơi nổi tiếng với <b>Chợ Cù Lao</b> – điểm sinh hoạt, giao thương đặc trưng của địa phương.
                Cập nhật tin tức, thủ tục hành chính và kênh liên hệ trực tuyến.
              </p>
              <div className="d-flex gap-2 flex-wrap mt-3">
                <Link className="btn btn-primary btn-lg" to="/tin-tuc">Xem tin tức</Link>
                <Link className="btn btn-outline-primary btn-lg" to="/dich-vu">Dịch vụ hành chính</Link>
              </div>
            </div>

            <div className="col-12" data-aos="fade-up" data-aos-delay="120">
              <div className="hero-card shadow-sm position-relative">
                <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  navigation
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 3500, disableOnInteraction: false }}
                  loop
                >
                  {HERO_SLIDES.map((s) => (
                    <SwiperSlide key={s.img}>
                      <div className="hero-slide" style={{ backgroundImage: `url(${s.img})` }}>
                        <div className="hero-slide-inner">
                          <div className="h4 fw-bold mb-1">{s.title}</div>
                          <div className="opacity-75">{s.desc}</div>
                          <div className="mt-3">
                            <Link className="btn btn-light btn-sm" to={s.cta.to}>{s.cta.label}</Link>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>

            <div className="col-12" data-aos="fade-up" data-aos-delay="180">
              <div className="hero-contact-strip">
                <div className="fw-semibold">Liên hệ nhanh:</div>
                <div className="d-flex gap-2 flex-wrap align-items-center">
                  <a className="hero-contact-btn" href={`tel:${CONTACT.hotline}`} aria-label={`Gọi hotline ${CONTACT.phoneDisplay}`} title={`Gọi hotline ${CONTACT.phoneDisplay}`}>
                    <span className="hero-contact-ico">☎</span>
                    <span className="small">Hotline</span>
                  </a>
                  <a className="hero-contact-btn" href={`mailto:${CONTACT.email}`} aria-label={`Gửi email ${CONTACT.email}`} title={`Gửi email ${CONTACT.email}`}>
                    <span className="hero-contact-ico">✉</span>
                    <span className="small">Email</span>
                  </a>
                  <a className="hero-contact-btn" href={CONTACT.facebookUrl} target="_blank" rel="noreferrer" aria-label="Mở Facebook Xã Tân Thuận Đông" title="Facebook Xã Tân Thuận Đông">
                    <span className="hero-contact-ico">f</span>
                    <span className="small">Facebook</span>
                  </a>
                </div>
                <div className="small text-muted ms-auto">Hotline: {CONTACT.phoneDisplay} • {CONTACT.email}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-white">
        <div className="container">
          <div className="row g-3" data-aos="fade-up">
            {[
              { label: 'Chợ Cù Lao', value: 'Điểm nhấn văn hoá – giao thương' },
              { label: 'Thủ tục hành chính', value: 'Tra cứu & nộp hồ sơ' },
              { label: 'Tin tức', value: 'Thông báo • Sự kiện • Văn bản' },
              { label: 'Thư viện', value: 'Hình ảnh địa phương' },
            ].map((x) => (
              <div key={x.label} className="col-12 col-md-6 col-lg-3">
                <div className="stat-card p-3 p-lg-4 h-100">
                  <div className="fw-bold mb-1">{x.label}</div>
                  <div className="text-muted">{x.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="d-flex align-items-end justify-content-between mb-3">
            <div>
              <h2 className="h3 fw-bold mb-1" data-aos="fade-up">Tin tức mới nhất</h2>
              <div className="text-muted" data-aos="fade-up" data-aos-delay="100">Cập nhật từ UBND xã và hoạt động địa phương</div>
            </div>
            <Link className="btn btn-outline-primary" to="/tin-tuc">Xem tất cả</Link>
          </div>

          <div className="row g-4">
            {top.map((a, idx) => (
              <div key={a.id} className="col-12 col-md-6 col-lg-4" data-aos="zoom-in" data-aos-delay={idx * 60}>
                <Link className="text-decoration-none" to={`/tin-tuc/${a.slug}`}>
                  <div className="card nice-card h-100">
                    <div className="card-img-top nice-card-img" style={{ backgroundImage: `url(${a.thumbnailUrl || '/hero/0.png'})` }} />
                    <div className="card-body">
                      <div className="small text-muted mb-1">{a.categoryName}</div>
                      <div className="fw-semibold text-dark">{a.title}</div>
                      {a.summary ? <div className="text-muted mt-2 line-clamp-2">{a.summary}</div> : null}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
