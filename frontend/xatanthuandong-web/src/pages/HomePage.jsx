import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import { api } from '../lib/api'

const HERO_SLIDES = [
  { img: '/hero/0.png', title: 'Chợ Cù Lao – Nét đặc trưng Tân Thuận Đông' },
  { img: '/hero/1.png', title: 'Cổng thông tin điện tử Xã Tân Thuận Đông' },
  { img: '/hero/2.png', title: 'Cập nhật tin tức – thông báo nhanh chóng' },
]

export default function HomePage() {
  const [articles, setArticles] = useState([])

  useEffect(() => {
    api.get('/api/public/articles')
      .then((r) => setArticles(r.data))
      .catch(() => setArticles([]))
  }, [])

  const top = useMemo(() => articles.slice(0, 6), [articles])

  return (
    <>
      {/* ===== BANNER ===== */}
      <section className="banner">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          autoplay={{ delay: 3000 }}
          loop
          pagination={{ clickable: true }}
        >
          {HERO_SLIDES.map((s, i) => (
            <SwiperSlide key={i}>
              <div
                className="banner-slide"
                style={{ backgroundImage: `url(${s.img})` }}
              >
                <div className="overlay">
                  <h1 className="banner-text">{s.title}</h1>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* ===== CHỮ CHẠY ===== */}
      <div className="marquee">
        <div className="marquee-content">
          🔥 Chào mừng bạn đến với Cổng thông tin điện tử Xã Tân Thuận Đông • Cập nhật tin tức mới nhất • Phục vụ người dân nhanh chóng
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="container mt-5">
        <div className="row g-4">

          {/* SIDEBAR */}
          <div className="col-md-3">
            <div className="sidebar shadow-sm">
              <h5 className="fw-bold mb-3">Danh mục</h5>
              <ul>
                <li><Link to="#">Giới thiệu</Link></li>
                <li><Link to="#">Tin tức</Link></li>
                <li><Link to="#">Thông báo</Link></li>
                <li><Link to="#">Văn bản</Link></li>
                <li><Link to="#">Liên hệ</Link></li>
              </ul>
            </div>
          </div>

          {/* NEWS */}
          <div className="col-md-9">
            <h4 className="fw-bold mb-4">Tin tức mới nhất</h4>

            <div className="row g-4">
              {top.map((a) => (
                <div key={a.id} className="col-md-6">
                  <Link to={`/tin-tuc/${a.slug}`} className="news-card">
                    
                    <div className="img-wrap">
                      <img src={a.thumbnailUrl || '/hero/0.png'} />
                    </div>

                    <div className="p-3">
                      <h6>{a.title}</h6>
                      <p>{a.summary}</p>
                    </div>

                  </Link>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ===== STYLE XỊN ===== */}
      <style>{`
        /* ===== BANNER ===== */
        .banner-slide {
          height: 420px;
          background-size: cover;
          background-position: center;
          border-radius: 18px;
          overflow: hidden;
          position: relative;
        }

        .overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .banner-text {
          color: white;
          font-size: 38px;
          font-weight: 700;
          text-align: center;
          animation: fadeUp 1s ease;
        }

        /* ===== MARQUEE ===== */
        .marquee {
          background: #ff3b3b;
          color: white;
          overflow: hidden;
          margin-top: 10px;
        }

        .marquee-content {
          white-space: nowrap;
          animation: marquee 15s linear infinite;
          padding: 10px;
        }

        /* ===== SIDEBAR ===== */
        .sidebar {
          background: white;
          border-radius: 16px;
          padding: 15px;
        }

        .sidebar ul {
          list-style: none;
          padding: 0;
        }

        .sidebar li {
          padding: 8px 0;
          transition: 0.25s;
        }

        .sidebar li:hover {
          transform: translateX(6px);
          color: #0d6efd;
        }

        /* ===== CARD ===== */
        .news-card {
          display: block;
          background: white;
          border-radius: 20px;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          transition: all 0.35s ease;
          box-shadow: 0 10px 25px rgba(0,0,0,0.08);
        }

        .img-wrap {
          overflow: hidden;
        }

        .img-wrap img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          transition: 0.5s;
        }

        /* zoom ảnh */
        .news-card:hover img {
          transform: scale(1.15);
        }

        /* card bay */
        .news-card:hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow: 0 25px 50px rgba(0,0,0,0.2);
        }

        .news-card h6 {
          font-size: 18px;
          font-weight: 600;
          transition: 0.3s;
        }

        .news-card:hover h6 {
          color: #0d6efd;
        }

        .news-card p {
          font-size: 14px;
          color: #666;
        }

        /* click effect */
        .news-card:active {
          transform: scale(0.97);
        }

        /* ===== ANIMATION ===== */
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes marquee {
          from { transform: translateX(100%) }
          to { transform: translateX(-100%) }
        }
      `}</style>
    </>
  )
}