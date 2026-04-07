import { Helmet } from 'react-helmet-async'
import { useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'

function LeaderCard({ name, title, photoUrl }) {
  return (
    <div className="leader-card text-center">
      <div
        className="leader-img"
        style={{
          backgroundImage: `url(${photoUrl || '/hero/logo.png'})`,
        }}
      />
      <div className="fw-semibold mt-2">{name}</div>
      <div className="small text-muted">{title}</div>
    </div>
  )
}

function LeadersSection() {
  const [leaders, setLeaders] = useState([])

  useEffect(() => {
    api.get('/api/public/leaders')
      .then((r) => setLeaders(r.data || []))
      .catch(() => setLeaders([]))
  }, [])

  const sorted = useMemo(
    () => [...leaders].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)),
    [leaders]
  )

  return (
    <div className="row g-4">
      {sorted.map((x) => (
        <div key={x.id} className="col-6 col-lg-3">
          <LeaderCard {...x} />
        </div>
      ))}
    </div>
  )
}

export default function AboutPage() {
  return (
    <>
      <div className="container py-5">
        <Helmet>
          <title>Giới thiệu</title>
        </Helmet>

        {/* ===== BANNER ===== */}
        <div className="banner-about mb-5">
          <h1>Xã Tân Thuận Đông</h1>
          <p>Trang thông tin điện tử chính thức</p>
        </div>

        {/* ===== LÃNH ĐẠO ===== */}
        <h3 className="fw-bold mb-4 text-center">Ban lãnh đạo</h3>
        <LeadersSection />
      </div>

      {/* ===== STYLE XỊN ===== */}
      <style>{`
        /* ===== BANNER ===== */
        .banner-about {
          background: linear-gradient(135deg, #0d6efd, #00c6ff);
          border-radius: 20px;
          padding: 50px 20px;
          text-align: center;
          color: white;
          box-shadow: 0 15px 40px rgba(0,0,0,0.2);
          animation: fadeUp 1s ease;
        }

        .banner-about h1 {
          font-size: 36px;
          font-weight: 700;
        }

        /* ===== CARD ===== */
        .leader-card {
          background: white;
          border-radius: 20px;
          padding: 20px;
          transition: all 0.35s ease;
          box-shadow: 0 10px 25px rgba(0,0,0,0.08);
          cursor: pointer;
        }

        .leader-card:hover {
          transform: translateY(-10px) scale(1.03);
          box-shadow: 0 25px 50px rgba(0,0,0,0.2);
        }

        /* ===== HÌNH ===== */
        .leader-img {
          width: 140px;
          height: 140px;
          margin: auto;
          border-radius: 20px;
          background-size: cover;
          background-position: center;
          transition: 0.5s;
        }

        .leader-card:hover .leader-img {
          transform: scale(1.1);
        }

        /* ===== CLICK EFFECT ===== */
        .leader-card:active {
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
      `}</style>
    </>
  )
}