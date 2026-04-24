import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Business from './pages/Business';
import BusinessAnalytics from './pages/BusinessAnalytics';
import ScanStamp from './pages/ScanStamp';
import ScanLanding from './pages/ScanLanding';
import AppLanding from './pages/AppLanding';
import CustomerDashboard from './pages/CustomerDashboard';
import KnowledgeBaseAdmin from './pages/KnowledgeBaseAdmin';
import Landing from './pages/Landing';
import CustomerLanding from './pages/CustomerLanding';
import ForBusiness from './pages/ForBusiness';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/customer" element={<CustomerLanding />} />
        <Route path="/for-business" element={<ForBusiness />} />
        <Route path="/Business" element={<Business />} />
        <Route path="/BusinessAnalytics" element={<BusinessAnalytics />} />
        <Route path="/ScanStamp" element={<ScanStamp />} />
        <Route path="/scan/:businessId" element={<ScanLanding />} />
        <Route path="/app" element={<AppLanding />} />
        <Route path="/dashboard" element={<CustomerDashboard />} />
        <Route path="/admin/knowledge" element={<KnowledgeBaseAdmin />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App