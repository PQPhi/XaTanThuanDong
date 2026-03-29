import { Helmet } from 'react-helmet-async'
import { useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'

function Section({ title, children }) {
  return (
    <section className="p-4 bg-white rounded-4 border mb-4" data-aos="fade-up">
      <h2 className="h5 fw-bold mb-2">{title}</h2>
      <div className="text-muted">{children}</div>
    </section>
  )
}

function LeaderCard({ name, title, photoUrl }) {
  return (
    <div className="text-center p-3 bg-white border rounded-4 h-100 hover-lift">
      <div
        className="mx-auto mb-2"
        style={{
          width: 140,
          height: 140,
          borderRadius: 18,
          backgroundImage: `url(${photoUrl || '/hero/logo.png'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          border: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 12px 26px rgba(11,18,32,0.08)',
        }}
      />
      <div className="fw-semibold text-dark">{name}</div>
      <div className="small text-muted">{title}</div>
    </div>
  )
}

function LeadersSection() {
  const tabs = [
    { key: 'chung', label: 'Giới thiệu chung' },
    { key: 'nhiemvu', label: 'Nhiệm vụ quyền hạn' },
    { key: 'lanh-dao', label: 'Thông tin lãnh đạo' },
    { key: 'lienhe', label: 'Liên hệ' },
  ]

  const [active, setActive] = useState('lanh-dao')
  const [leaders, setLeaders] = useState([])

  useEffect(() => {
    api.get('/api/public/leaders', { params: { groupKey: 'lanh-dao' } })
      .then((r) => setLeaders(r.data || []))
      .catch(() => setLeaders([]))
  }, [])

  const sortedLeaders = useMemo(() => [...leaders].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)), [leaders])

  return (
    <section className="p-4 bg-white rounded-4 border mb-4" data-aos="fade-up">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
        <h2 className="h5 fw-bold mb-0">Thông tin lãnh đạo</h2>
        <div className="small text-muted">(Quản trị có thể cập nhật danh sách và hình ảnh)</div>
      </div>

      <ul className="nav nav-tabs mt-3">
        {tabs.map((t) => (
          <li key={t.key} className="nav-item">
            <button
              type="button"
              className={`nav-link ${active === t.key ? 'active' : ''}`}
              onClick={() => setActive(t.key)}
            >
              {t.label}
            </button>
          </li>
        ))}
      </ul>

      <div className="pt-3">
        {active === 'lanh-dao' ? (
          <div className="row g-3">
            {sortedLeaders.map((x) => (
              <div key={x.id} className="col-12 col-sm-6 col-lg-3">
                <LeaderCard name={x.name} title={x.title} photoUrl={x.photoUrl} />
              </div>
            ))}
            {sortedLeaders.length === 0 ? (
              <div className="text-muted">Chưa có dữ liệu lãnh đạo.</div>
            ) : null}
          </div>
        ) : active === 'lienhe' ? (
          <div className="text-muted">
            <div><b>Địa chỉ:</b> Số 39, đường số 1, xã Tân Thuận Đông, thành phố Cao Lãnh, tỉnh Đồng Tháp</div>
            <div><b>Điện thoại:</b> 02773898112</div>
            <div><b>Email:</b> <a href="mailto:tanthuandongxa@gmail.com">tanthuandongxa@gmail.com</a></div>
            <div><b>Website:</b> <a href="https://xatanthuandong.tpcaolanh.dongthap.gov.vn" target="_blank" rel="noreferrer">xatanthuandong.tpcaolanh.dongthap.gov.vn</a></div>
          </div>
        ) : (
          <div className="text-muted">
            Nội dung mục <b>{tabs.find((x) => x.key === active)?.label}</b> (có thể bổ sung theo thực tế).
          </div>
        )}
      </div>
    </section>
  )
}

export default function AboutPage() {
  return (
    <div className="container py-4 py-lg-5">
      <Helmet>
        <title>Giới thiệu | Xã Tân Thuận Đông</title>
      </Helmet>

      <div className="mb-3" data-aos="fade-up">
        <div className="badge text-bg-primary">Giới thiệu</div>
        <h1 className="h2 fw-bold mb-1">Tổng quan về Xã Tân Thuận Đông</h1>
        <div className="text-muted">
          Xã Tân Thuận Đông thuộc thành phố Cao Lãnh, tỉnh Đồng Tháp. Đây là địa bàn mang đậm dấu ấn lịch sử khai phá
          và phát triển của vùng Đồng bằng sông Cửu Long.
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <LeadersSection />

          <Section title="Lịch sử hình thành và phát triển">
            <p>
              Xã Tân Thuận Đông, thuộc thành phố Cao Lãnh, tỉnh Đồng Tháp, là một vùng đất mang đậm dấu ấn lịch sử của
              quá trình khai phá và phát triển vùng Đồng bằng sông Cửu Long. Trải qua nhiều giai đoạn biến động của lịch
              sử dân tộc, xã đã từng bước hình thành, ổn định và phát triển như ngày hôm nay.
            </p>

            <div className="d-flex flex-column gap-3">
              <div>
                <div className="fw-semibold text-dark">1) Giai đoạn hình thành ban đầu (cuối thế kỷ XIX – đầu thế kỷ XX)</div>
                <div className="small">
                  Vào khoảng cuối thế kỷ XIX, đầu thế kỷ XX, khu vực Tân Thuận Đông ngày nay vẫn còn là vùng đất hoang sơ,
                  nhiều lau sậy, kênh rạch chằng chịt và chịu ảnh hưởng mạnh của lũ theo mùa. Tuy nhiên, chính điều kiện tự
                  nhiên đặc trưng này lại mang đến nguồn phù sa dồi dào, tạo tiền đề thuận lợi cho sản xuất nông nghiệp.
                </div>
                <div className="small mt-2">
                  Trong giai đoạn này, nhiều cư dân từ các vùng lân cận đã di cư đến đây để khai hoang, lập nghiệp. Họ tiến
                  hành đào kênh, đắp bờ, cải tạo đất để trồng lúa và hoa màu. Những cụm dân cư đầu tiên dần hình thành dọc
                  theo các tuyến kênh rạch, tạo nên nền tảng ban đầu cho sự phát triển của địa phương.
                </div>
              </div>

              <div>
                <div className="fw-semibold text-dark">2) Giai đoạn trước năm 1975</div>
                <div className="small">
                  Trước năm 1975, Tân Thuận Đông là khu vực nông thôn còn nhiều khó khăn. Điều kiện cơ sở hạ tầng chưa phát
                  triển, giao thông chủ yếu dựa vào đường thủy. Người dân sinh sống chủ yếu bằng nghề trồng lúa, chăn nuôi
                  nhỏ lẻ và khai thác tự nhiên.
                </div>
                <div className="small mt-2">
                  Trong bối cảnh chiến tranh, đời sống của người dân gặp nhiều trở ngại, kinh tế chậm phát triển. Tuy nhiên,
                  tinh thần đoàn kết, cần cù lao động đã giúp người dân duy trì cuộc sống và từng bước ổn định sản xuất.
                </div>
              </div>

              <div>
                <div className="fw-semibold text-dark">3) Giai đoạn sau năm 1975 – ổn định và tổ chức lại</div>
                <div className="small">
                  Sau sự kiện Thống nhất đất nước năm 1975, địa phương bước vào giai đoạn ổn định và tái thiết. Chính quyền
                  tiến hành tổ chức lại hệ thống hành chính, xây dựng các đơn vị quản lý phù hợp với tình hình thực tế.
                </div>
                <div className="small mt-2">
                  Trong thời kỳ này, nhiều chương trình khai hoang, phục hóa đất được triển khai nhằm mở rộng diện tích sản
                  xuất. Người dân được khuyến khích tham gia các hợp tác xã nông nghiệp, góp phần nâng cao hiệu quả sản xuất
                  và ổn định đời sống.
                </div>
              </div>

              <div>
                <div className="fw-semibold text-dark">4) Giai đoạn Đổi mới (1986 – 2000)</div>
                <div className="small">
                  Sau khi thực hiện chính sách Đổi Mới 1986, nền kinh tế của xã Tân Thuận Đông bắt đầu có những chuyển biến
                  rõ rệt. Người dân được trao quyền chủ động hơn trong sản xuất, từ đó mạnh dạn áp dụng khoa học kỹ thuật vào
                  canh tác.
                </div>
                <div className="small mt-2">
                  Năng suất lúa tăng lên đáng kể, đời sống người dân dần được cải thiện. Ngoài ra, các hoạt động chăn nuôi
                  và nuôi trồng thủy sản cũng bắt đầu phát triển, góp phần đa dạng hóa nguồn thu nhập.
                </div>
              </div>

              <div>
                <div className="fw-semibold text-dark">5) Giai đoạn phát triển và hoàn thiện (từ năm 2000 đến nay)</div>
                <div className="small">
                  Bước sang thế kỷ XXI, xã Tân Thuận Đông từng bước được kiện toàn về tổ chức hành chính và phát triển toàn
                  diện. Hệ thống cơ sở hạ tầng được đầu tư mạnh mẽ: đường giao thông nông thôn được bê tông hóa; hệ thống điện,
                  nước sinh hoạt được phủ rộng; trường học và trạm y tế được xây dựng, nâng cấp.
                </div>
                <div className="small mt-2">
                  Đặc biệt, từ khoảng năm 2010 trở lại đây, xã tích cực tham gia chương trình xây dựng nông thôn mới. Nhờ đó,
                  bộ mặt nông thôn ngày càng khang trang, hiện đại hơn.
                </div>
                <div className="small mt-2">
                  Kinh tế địa phương cũng có sự chuyển dịch tích cực, không chỉ phụ thuộc vào trồng lúa mà còn phát triển
                  cây ăn trái, nuôi trồng thủy sản, các hoạt động kinh doanh nhỏ và dịch vụ. Đời sống vật chất và tinh thần
                  của người dân ngày càng được nâng cao, tỷ lệ hộ nghèo giảm đáng kể.
                </div>
              </div>

              <div>
                <div className="fw-semibold text-dark">6) Vai trò và định hướng phát triển</div>
                <div className="small">
                  Ngày nay, xã Tân Thuận Đông không chỉ là một địa phương thuần nông mà còn đang từng bước chuyển mình theo
                  hướng hiện đại hóa, gắn với phát triển bền vững. Với vị trí gần trung tâm thành phố Cao Lãnh, xã có nhiều
                  điều kiện thuận lợi để phát triển kinh tế, giao thương và nâng cao chất lượng cuộc sống cho người dân.
                </div>
                <div className="small mt-2">
                  Trong tương lai, xã hướng đến: phát triển nông nghiệp công nghệ cao; nâng cao chất lượng giáo dục và y tế;
                  hoàn thiện cơ sở hạ tầng; xây dựng đời sống văn hóa bền vững.
                </div>
              </div>
            </div>
          </Section>

          <Section title="Vị trí địa lý">
            <ul className="mb-0">
              <li>Thuộc địa bàn thành phố Cao Lãnh, tỉnh Đồng Tháp.</li>
              <li>Khu vực có kênh rạch và tuyến giao thông kết nối thuận tiện cho giao thương.</li>
              <li>Điểm nhấn địa phương: Chợ Cù Lao (có thể bổ sung nội dung chi tiết).</li>
            </ul>
          </Section>

          <Section title="Điều kiện tự nhiên">
            <ul className="mb-0">
              <li>Đặc trưng vùng đồng bằng sông nước, chịu ảnh hưởng lũ theo mùa.</li>
              <li>Phù sa dồi dào tạo điều kiện thuận lợi cho sản xuất nông nghiệp.</li>
            </ul>
          </Section>

          <Section title="Cơ cấu dân cư">
            <ul className="mb-0">
              <li>Dân cư hình thành và phát triển theo các tuyến kênh rạch, cụm dân cư.</li>
              <li>Sinh kế đa dạng: trồng lúa, chăn nuôi, nuôi trồng thủy sản, kinh doanh – dịch vụ.</li>
            </ul>
          </Section>

          <Section title="Cơ sở hạ tầng">
            <ul className="mb-0">
              <li>Giao thông nông thôn bê tông hóa, nâng cấp kết nối.</li>
              <li>Phủ rộng điện, nước sinh hoạt; nâng cấp trường học và trạm y tế.</li>
              <li>Tham gia xây dựng nông thôn mới từ khoảng năm 2010 trở lại đây.</li>
            </ul>
          </Section>
        </div>

        <div className="col-12 col-lg-4" data-aos="fade-left">
          <div className="p-4 bg-white rounded-4 border">
            <div className="fw-bold mb-2">Thông tin nhanh</div>
            <div className="small text-muted">
              <div><span className="text-muted">Đơn vị hành chính:</span> TP. Cao Lãnh, Đồng Tháp</div>
              <div><span className="text-muted">Định hướng:</span> Nông nghiệp – dịch vụ – phát triển bền vững</div>
              <div><span className="text-muted">Điểm nhấn:</span> Chợ Cù Lao</div>
            </div>
          </div>

          <div className="p-4 bg-white rounded-4 border mt-4">
            <div className="fw-bold mb-2">Liên kết nhanh</div>
            <div className="d-grid gap-2">
              <a className="btn btn-outline-primary" href="/tin-tuc">Xem Tin tức</a>
              <a className="btn btn-outline-primary" href="/dich-vu">Dịch vụ hành chính</a>
              <a className="btn btn-outline-primary" href="/thu-vien">Thư viện</a>
              <a className="btn btn-outline-primary" href="/lien-he">Liên hệ</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
