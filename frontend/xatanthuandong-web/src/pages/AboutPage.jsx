import { Helmet } from 'react-helmet-async'
import { useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'

const QUICK_STATS = [
  { label: 'Diện tích', value: '16,27 km²' },
  { label: 'Dân số', value: '11.000 - 14.000' },
  { label: 'Năm thành lập', value: '1981' },
  { label: 'Thế mạnh', value: 'Xoài - Lúa - Du lịch' },
]

const DETAIL_BLOCKS = [
  {
    title: 'Lịch sử hình thành',
    content:
      'Xã được thành lập ngày 05/01/1981 theo Quyết định 4-CP. Từ vùng bãi bồi ven sông Tiền, địa phương đã phát triển mạnh về nông nghiệp và dịch vụ.',
  },
  {
    title: 'Vị trí địa lý',
    content:
      'Xã nằm phía Đông Nam thành phố Cao Lãnh, giáp sông Tiền. Vị trí này giúp kết nối giao thương, phát triển nông nghiệp và du lịch sinh thái.',
  },
  {
    title: 'Điều kiện tự nhiên',
    content:
      'Đất phù sa được bồi đắp thường xuyên, hệ thống kênh rạch dày đặc và khí hậu ôn hòa là điều kiện thuận lợi cho cây ăn trái và thủy sản.',
  },
  {
    title: 'Cơ cấu dân cư',
    content:
      'Dân cư chủ yếu là người Kinh, bên cạnh cộng đồng Khmer và Hoa, tạo nên bản sắc văn hóa đa dạng và thân thiện.',
  },
]

const DEVELOPMENT_GOALS = [
  'Nông nghiệp công nghệ cao gắn với chuỗi giá trị',
  'Du lịch sinh thái miệt vườn gắn bảo tồn văn hóa',
  'Nâng cấp hạ tầng giao thông và chuyển đổi số',
  'Nâng cao chất lượng giáo dục, y tế và an sinh',
]

function LeaderCard({ name, title, photoUrl }) {
  return (
    <div className="leader-card">
      <div
        className="leader-img"
        style={{ backgroundImage: `url(${photoUrl || '/hero/logo.png'})` }}
      />
      <h5 className="leader-name">{name}</h5>
      <p className="leader-title">{title}</p>
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
    <div className="row g-4 justify-content-center">
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
      <Helmet>
        <title>Giới thiệu Xã Tân Thuận Đông</title>
      </Helmet>

      <header className="about-hero">
        <div className="hero-noise" />
        <div className="hero-ring ring-1" />
        <div className="hero-ring ring-2" />

        <div className="hero-content-wrap container">
          <div className="hero-copy reveal-up">
            <p className="hero-kicker">Portal thông tin địa phương</p>
            <h1>Xã Tân Thuận Đông</h1>
            <p className="hero-lead">
              Vùng đất bên sông Tiền với bản sắc nông nghiệp, văn hóa miền Tây và
              định hướng phát triển bền vững.
            </p>
          </div>

          <div className="hero-stats reveal-up" style={{ animationDelay: '120ms' }}>
            {QUICK_STATS.map((item) => (
              <article key={item.label} className="stat-card">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </article>
            ))}
          </div>
        </div>
      </header>

      <main className="about-main container">
        <section className="overview-grid section-shell reveal-up" style={{ animationDelay: '80ms' }}>
          <div className="overview-image">
            <img src="/hero/anhttd.jpg" alt="Xã Tân Thuận Đông" />
          </div>

          <div className="overview-copy">
            <h2>Giới thiệu tổng quan</h2>
            <p>
              Xã Tân Thuận Đông thuộc thành phố Cao Lãnh, tỉnh Đồng Tháp. Đây là
              vùng đất có hệ thống sông ngòi chằng chịt, đất phù sa màu mỡ và truyền
              thống nông nghiệp lâu đời.
            </p>
            <p>
              Nhờ lợi thế vị trí gần sông Tiền, địa phương đang kết hợp nông nghiệp,
              dịch vụ và du lịch để tạo động lực phát triển mới, hướng đến chất lượng
              sống cao hơn cho người dân.
            </p>

            <div className="overview-tags">
              <span>Miệt vườn</span>
              <span>Sông nước</span>
              <span>Nông nghiệp sạch</span>
              <span>Chuyển đổi số</span>
            </div>
          </div>
        </section>

        <section className="details-layout section-shell reveal-up" style={{ animationDelay: '160ms' }}>
          <div className="details-head">
            <h2>Thông tin chi tiết</h2>
            <p>
              Các thông tin cốt lõi về lịch sử, vị trí, tài nguyên và dân cư của địa
              phương được trình bày theo bố cục dễ theo dõi.
            </p>
          </div>

          <div className="details-grid">
            {DETAIL_BLOCKS.map((item, idx) => (
              <article
                key={item.title}
                className="detail-card"
                style={{ animationDelay: `${220 + idx * 90}ms` }}
              >
                <h3>{item.title}</h3>
                <p>{item.content}</p>
              </article>
            ))}

            <article className="detail-card detail-list" style={{ animationDelay: '520ms' }}>
              <h3>Cơ sở hạ tầng</h3>
              <ul>
                <li>Đường giao thông nhựa và bê tông được nâng cấp đồng bộ</li>
                <li>Kênh rạch giúp vận chuyển nông sản linh hoạt</li>
                <li>Hạ tầng điện, nước, internet phủ rộng</li>
                <li>Hệ thống trường học và y tế ngày càng hoàn thiện</li>
              </ul>
            </article>

            <article className="detail-card detail-list" style={{ animationDelay: '610ms' }}>
              <h3>Kinh tế xã hội</h3>
              <ul>
                <li>Nông nghiệp chủ lực: xoài, lúa, nhãn</li>
                <li>Thủy sản nước ngọt: cá, tôm càng xanh</li>
                <li>Dịch vụ và du lịch miệt vườn tăng trưởng tích cực</li>
              </ul>
            </article>

            <article className="detail-card detail-list goals" style={{ animationDelay: '700ms' }}>
              <h3>Định hướng phát triển</h3>
              <ul>
                {DEVELOPMENT_GOALS.map((goal) => (
                  <li key={goal}>{goal}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className="section-shell reveal-up" style={{ animationDelay: '220ms' }}>
          <h2 className="leaders-title">Ban Lãnh Đạo</h2>
          <p className="leaders-subtitle">
            Đội ngũ lãnh đạo đồng hành cùng người dân trong công tác quản lý, phát
            triển kinh tế xã hội và xây dựng chính quyền số.
          </p>

          <div className="leaders-wrap">
            <LeadersSection />
          </div>
        </section>
      </main>

      <style>{`
        .about-hero {
          --about-ink: #1e293b;
          --about-soft: #475569;
          --about-brand: #0f766e;
          --about-accent: #f59e0b;
          position: relative;
          min-height: 470px;
          margin-bottom: 32px;
          color: #f8fafc;
          background:
            radial-gradient(circle at 12% 25%, rgba(20, 184, 166, 0.35), transparent 40%),
            radial-gradient(circle at 88% 18%, rgba(245, 158, 11, 0.3), transparent 36%),
            linear-gradient(140deg, rgba(15, 118, 110, 0.95), rgba(30, 41, 59, 0.95)),
            url('/images/ttd-banner.jpg') center / cover no-repeat;
          overflow: hidden;
          border-radius: 0 0 34px 34px;
        }

        .hero-noise {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px);
          background-size: 3px 3px;
          mix-blend-mode: soft-light;
          opacity: 0.25;
          pointer-events: none;
        }

        .hero-ring {
          position: absolute;
          border: 1px solid rgba(255, 255, 255, 0.28);
          border-radius: 999px;
          pointer-events: none;
          animation: pulse-ring 7s ease-in-out infinite;
        }

        .ring-1 {
          width: 280px;
          height: 280px;
          top: -84px;
          right: -60px;
        }

        .ring-2 {
          width: 180px;
          height: 180px;
          bottom: 46px;
          left: -54px;
          animation-delay: 1.2s;
        }

        .hero-content-wrap {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 22px;
          align-items: end;
          min-height: 470px;
          padding-top: 64px;
          padding-bottom: 46px;
        }

        .hero-copy h1 {
          margin-bottom: 14px;
          font-size: clamp(34px, 4.2vw, 56px);
          line-height: 1.08;
          font-weight: 800;
          letter-spacing: 0.3px;
          text-wrap: balance;
        }

        .hero-kicker {
          width: fit-content;
          margin-bottom: 10px;
          padding: 6px 14px;
          border-radius: 999px;
          background: rgba(248, 250, 252, 0.2);
          font-size: 13px;
          letter-spacing: 1.1px;
          text-transform: uppercase;
          backdrop-filter: blur(4px);
        }

        .hero-lead {
          max-width: 62ch;
          margin: 0;
          color: rgba(248, 250, 252, 0.92);
          font-size: 17px;
          line-height: 1.75;
        }

        .hero-stats {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .stat-card {
          padding: 16px;
          border-radius: 18px;
          background: rgba(15, 23, 42, 0.38);
          border: 1px solid rgba(248, 250, 252, 0.2);
          backdrop-filter: blur(8px);
          transform: translateY(0);
          transition: transform 0.35s ease, border-color 0.35s ease, background 0.35s ease;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          border-color: rgba(245, 158, 11, 0.56);
          background: rgba(15, 23, 42, 0.58);
        }

        .stat-card span {
          display: block;
          margin-bottom: 4px;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.7px;
          color: rgba(226, 232, 240, 0.86);
        }

        .stat-card strong {
          font-size: 21px;
          color: #fff7ed;
          line-height: 1.3;
        }

        .about-main {
          padding-bottom: 52px;
        }

        .section-shell {
          margin-bottom: 30px;
          padding: 28px;
          border-radius: 24px;
          background: linear-gradient(170deg, #ffffff, #f8fafc);
          box-shadow: 0 14px 34px rgba(15, 23, 42, 0.08);
          border: 1px solid #e2e8f0;
        }

        .overview-grid {
          display: grid;
          grid-template-columns: 0.95fr 1.05fr;
          gap: 28px;
          align-items: stretch;
        }

        .overview-image {
          border-radius: 22px;
          overflow: hidden;
          min-height: 340px;
        }

        .overview-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1.02);
          transition: transform 0.7s ease;
        }

        .overview-image:hover img {
          transform: scale(1.08);
        }

        .overview-copy h2,
        .details-head h2,
        .leaders-title {
          margin-bottom: 12px;
          color: #0f172a;
          font-size: clamp(28px, 2.8vw, 36px);
          font-weight: 800;
        }

        .overview-copy p,
        .details-head p,
        .leaders-subtitle {
          color: #334155;
          line-height: 1.75;
          font-size: 16px;
        }

        .overview-tags {
          margin-top: 16px;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .overview-tags span {
          display: inline-flex;
          align-items: center;
          padding: 8px 14px;
          border-radius: 999px;
          background: linear-gradient(110deg, #0f766e, #0ea5a4);
          color: #f0fdfa;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.2px;
        }

        .details-layout {
          background: linear-gradient(165deg, #ecfeff 0%, #ffffff 35%, #fff7ed 100%);
        }

        .details-head {
          margin-bottom: 18px;
          max-width: 72ch;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .detail-card {
          border-radius: 18px;
          padding: 20px;
          background: #ffffff;
          border: 1px solid #dbeafe;
          box-shadow: 0 10px 20px rgba(15, 23, 42, 0.06);
          animation: reveal 0.7s ease both;
        }

        .detail-card h3 {
          margin-bottom: 10px;
          font-size: 20px;
          color: #0f766e;
          font-weight: 750;
        }

        .detail-card p,
        .detail-card li {
          margin: 0;
          color: #334155;
          line-height: 1.7;
        }

        .detail-list ul {
          margin: 0;
          padding-left: 18px;
          display: grid;
          gap: 8px;
        }

        .goals {
          border-color: #fdba74;
          background: linear-gradient(180deg, #fff7ed 0%, #ffffff 100%);
        }

        .leaders-title {
          text-align: center;
        }

        .leaders-subtitle {
          margin: 0 auto 24px;
          max-width: 70ch;
          text-align: center;
        }

        .leaders-wrap .leader-card {
          height: 100%;
          background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
          border: 1px solid #e2e8f0;
          box-shadow: 0 10px 20px rgba(15, 23, 42, 0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .leaders-wrap .leader-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 18px 30px rgba(15, 23, 42, 0.13);
        }

        .leaders-wrap .leader-img {
          border-radius: 16px;
          border: 2px solid rgba(15, 118, 110, 0.2);
          box-shadow: 0 12px 24px rgba(15, 23, 42, 0.18);
        }

        .leaders-wrap .leader-name {
          color: #0f172a;
          margin-bottom: 4px;
        }

        .leaders-wrap .leader-title {
          color: #475569;
          margin: 0;
        }

        .reveal-up {
          animation: reveal 0.75s ease both;
        }

        @keyframes reveal {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse-ring {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.08);
            opacity: 0.4;
          }
        }

        @media (max-width: 991px) {
          .hero-content-wrap {
            grid-template-columns: 1fr;
            align-items: center;
            gap: 18px;
            padding-top: 60px;
          }

          .hero-lead {
            max-width: none;
          }

          .overview-grid {
            grid-template-columns: 1fr;
          }

          .overview-image {
            min-height: 260px;
          }

          .details-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 575px) {
          .about-hero {
            min-height: 420px;
            border-radius: 0 0 24px 24px;
          }

          .hero-copy h1 {
            font-size: 33px;
          }

          .hero-stats {
            grid-template-columns: 1fr;
          }

          .section-shell {
            padding: 20px;
          }

          .detail-card {
            padding: 16px;
          }
        }
      `}</style>
    </>
  )
}