import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/lib/AuthContext';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance as queryClient } from '@/lib/query-client';
import Business from './pages/Business';
import BusinessAnalytics from './pages/BusinessAnalytics';
import ScanStamp from './pages/ScanStamp';
import ScanLanding from './pages/ScanLanding';
import AppLanding from './pages/AppLanding';
import CustomerDashboard from './pages/CustomerDashboard';
import KnowledgeBaseAdmin from './pages/KnowledgeBaseAdmin';
import EmployeeDashboard from './pages/EmployeeDashboard';
import Landing from './pages/Landing';
import CustomerLanding from './pages/CustomerLanding';
import ForBusiness from './pages/ForBusiness';
import StartAuth from './pages/StartAuth';
import Impressum from './pages/Impressum';
import Datenschutz from './pages/Datenschutz';
import CookieBanner from './components/CookieBanner';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* ── Öffentliche Marketing-Seiten ── */}
            <Route path="/" element={<Landing />} />
            <Route path="/customer" element={<CustomerLanding />} />
            <Route path="/for-business" element={<ForBusiness />} />
            <Route path="/start" element={<StartAuth />} />
            <Route path="/scan/:businessId" element={<ScanLanding />} />
            <Route path="/app" element={<AppLanding />} />
            <Route path="/impressum" element={<Impressum />} />
            <Route path="/datenschutz" element={<Datenschutz />} />

            {/* ── App-Bereich (Login erforderlich) ── */}
            <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/" replace />} />}>
              <Route path="/Business" element={<Business />} />
              <Route path="/BusinessAnalytics" element={<BusinessAnalytics />} />
              <Route path="/dashboard" element={<CustomerDashboard />} />
              <Route path="/ScanStamp" element={<ScanStamp />} />
              <Route path="/admin/knowledge" element={<KnowledgeBaseAdmin />} />
              <Route path="/employee" element={<EmployeeDashboard />} />
            </Route>
          </Routes>
          <CookieBanner />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App