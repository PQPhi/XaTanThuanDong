import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
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
import { api } from '../../lib/api'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const METRICS = [
  { key: 'articles', label: 'Bài viết', tone: 'primary' },
  { key: 'published', label: 'Đã xuất bản', tone: 'success' },
  { key: 'commentsPending', label: 'Bình luận chờ duyệt', tone: 'warning' },
  { key: 'procedures', label: 'Thủ tục', tone: 'info' },
  { key: 'applications', label: 'Hồ sơ', tone: 'secondary' },
]

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState(null)
  const [error, setError] = useState('')

  async function load() {
    setError('')
    try {
      const r = await api.get('/api/admin/dashboard/summary')
      setSummary(r.data)
    } catch {
      setError('Không tải được dữ liệu dashboard.')
      setSummary(null)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const chartData = {
    labels: METRICS.map((x) => x.label),
    datasets: [
      {
        label: 'Số lượng',
        data: METRICS.map((x) => summary?.[x.key] || 0),
        backgroundColor: ['#0059ff', '#00a870', '#efaa00', '#1e86ff', '#44506b'],
        borderRadius: 12,
      },
    ],
  }

  return (
    <div>
      <Helmet>
        <title>Dashboard | Admin Portal</title>
      </Helmet>

      <div className="section-head">
        <div>
          <div className="section-chip">Dashboard</div>
          <h2>Tổng quan hệ thống</h2>
        </div>
        <button className="btn btn-outline-primary" onClick={load} type="button">Tải lại</button>
      </div>

      {error ? <div className="alert alert-warning">{error}</div> : null}

      <div className="metric-grid">
        {METRICS.map((x) => (
          <div key={x.key} className="metric-card">
            <div className={`metric-dot ${x.tone}`} />
            <div className="metric-label">{x.label}</div>
            <div className="metric-value">{summary?.[x.key] ?? '—'}</div>
          </div>
        ))}
      </div>

      <div className="surface-card mt-3">
        <div className="fw-semibold mb-3">Biểu đồ nhanh</div>
        <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
      </div>
    </div>
  )
}
