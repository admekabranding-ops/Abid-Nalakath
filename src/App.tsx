import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicPortfolio } from './pages/PublicPortfolio';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { VisualEditor } from './pages/admin/editor/VisualEditor';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Portfolio Route */}
        <Route path="/" element={<PublicPortfolio />} />

        {/* Local Admin Access Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/editor" element={<VisualEditor />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/*" element={<AdminDashboard />} />

        {/* Catch-all redirect to public portfolio */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
