import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { api } from '../../lib/api'

import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function AdminDashboardPage() {
  const [data, setData] = useState(null)

  useEffect(() => {
    api.get('/api/admin/dashboard/summary').then((r) => setData(r.data))
  }, [])

  const chartData = {
    labels: ['Tin tức', 'Đã xuất bản', 'Bình luận chờ duyệt', 'Thủ tục', 'Hồ sơ'],
    datasets: [
      {
        label: 'Số lượng',
        data: data ? [data.articles, data.published, data.commentsPending, data.procedures, data.applications] : [0, 0, 0, 0, 0],
        backgroundColor: ['#0d6efd', '#20c997', '#ffc107', '#6f42c1', '#0dcaf0'],
        borderRadius: 10,
      },
    ],
  }

  return (
    <div>
      <Helmet>
        <title>Dashboard | Admin</title>
      </Helmet>

      <div className="d-flex align-items-end justify-content-between mb-3">
        <div>
          <div className="badge text-bg-primary">Dashboard</div>
          <h1 className="h3 fw-bold mb-0">Tổng quan</h1>
        </div>
      </div>

      <div className="row g-3 mb-3">
        {[{ k: 'articles', t: 'Bài viết' }, { k: 'published', t: 'Đã xuất bản' }, { k: 'commentsPending', t: 'Bình luận chờ' }, { k: 'applications', t: 'Hồ sơ' }].map((x) => (
          <div key={x.k} className="col-12 col-md-6 col-lg-3">
            <div className="p-3 bg-white border rounded-4">
              <div className="small text-muted">{x.t}</div>
              <div className="h3 fw-bold mb-0">{data ? data[x.k] : '—'}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-white border rounded-4">
        <div className="fw-bold mb-2">Biểu đồ</div>
        <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
      </div>
    </div>
  )
}
