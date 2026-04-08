import { Navigate, Route, Routes } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import AdminLayout from './components/layout/AdminLayout'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminArticlesPage from './pages/admin/AdminArticlesPage'
import AdminArticleEditorPage from './pages/admin/AdminArticleEditorPage'
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage'
import AdminMediaPage from './pages/admin/AdminMediaPage'
import AdminCommentsPage from './pages/admin/AdminCommentsPage'
import AdminLeadersPage from './pages/admin/AdminLeadersPage'
import AdminProceduresPage from './pages/admin/AdminProceduresPage'
import AdminServicesPage from './pages/admin/AdminServicesPage'
import AdminUsersPage from './pages/admin/AdminUsersPage'
import './App.css'

function App() {
  return (
    <>
      <Helmet>
        <title>Admin Portal | Xa Tan Thuan Dong</title>
      </Helmet>
      <Routes>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/categories" element={<AdminCategoriesPage />} />
          <Route path="/admin/articles" element={<AdminArticlesPage />} />
          <Route path="/admin/articles/new" element={<AdminArticleEditorPage mode="create" />} />
          <Route path="/admin/articles/:id/edit" element={<AdminArticleEditorPage mode="edit" />} />
          <Route path="/admin/media" element={<AdminMediaPage />} />
          <Route path="/admin/comments" element={<AdminCommentsPage />} />
          <Route path="/admin/leaders" element={<AdminLeadersPage />} />
          <Route path="/admin/procedures" element={<AdminProceduresPage />} />
          <Route path="/admin/services" element={<AdminServicesPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </>
  )
}

export default App
