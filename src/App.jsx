import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Business from './pages/Business';
import ScanStamp from './pages/ScanStamp';
import ScanLanding from './pages/ScanLanding';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/Business" replace />} />
        <Route path="/Business" element={<Business />} />
        <Route path="/ScanStamp" element={<ScanStamp />} />
        <Route path="/scan/:businessId" element={<ScanLanding />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App