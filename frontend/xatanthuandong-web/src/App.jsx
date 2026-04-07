import { Navigate, Route, Routes } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

import SiteLayout from './components/layout/SiteLayout.jsx'
import AdminLayout from './components/layout/AdminLayout.jsx'

import HomePage from './pages/HomePage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import NewsListPage from './pages/NewsListPage.jsx'
import NewsDetailPage from './pages/NewsDetailPage.jsx'
import ServicesPage from './pages/ServicesPage.jsx'
import GalleryPage from './pages/GalleryPage.jsx'
import ContactPage from './pages/ContactPage.jsx'

import AdminLoginPage from './pages/admin/AdminLoginPage.jsx'
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx'
import AdminArticlesPage from './pages/admin/AdminArticlesPage.jsx'
import AdminServicesPage from './pages/admin/AdminServicesPage.jsx'
import AdminLeadersPage from './pages/admin/AdminLeadersPage.jsx'

import './App.scss'

export default function App() {
  return (
    <>
      <Helmet>
        <title>Xã Tân Thuận Đông</title>
        <meta name="description" content="Cổng thông tin điện tử xã Tân Thuận Đông: tin tức, dịch vụ hành chính, thư viện hình ảnh và liên hệ." />
      </Helmet>

      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/gioi-thieu" element={<AboutPage />} />
          <Route path="/tin-tuc" element={<NewsListPage />} />
          <Route path="/tin-tuc/:slug" element={<NewsDetailPage />} />
          <Route path="/dich-vu" element={<ServicesPage />} />
          <Route path="/thu-vien" element={<GalleryPage />} />
          <Route path="/lien-he" element={<ContactPage />} />
        </Route>

        <Route path="/admin/login" element={<AdminLoginPage />} />

        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/articles" element={<AdminArticlesPage />} />
          <Route path="/admin/services" element={<AdminServicesPage />} />
          <Route path="/admin/leaders" element={<AdminLeadersPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
