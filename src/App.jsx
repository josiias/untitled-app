import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Business from './pages/Business';
import ScanStamp from './pages/ScanStamp';
import ScanLanding from './pages/ScanLanding';
import AppLanding from './pages/AppLanding';
import CustomerDashboard from './pages/CustomerDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/Business" replace />} />
        <Route path="/Business" element={<Business />} />
        <Route path="/ScanStamp" element={<ScanStamp />} />
        <Route path="/scan/:businessId" element={<ScanLanding />} />
        <Route path="/app" element={<AppLanding />} />
        <Route path="/dashboard" element={<CustomerDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App