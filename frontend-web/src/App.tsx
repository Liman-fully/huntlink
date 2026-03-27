import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layouts/Layout';
import Dashboard from './pages/Dashboard';
import TalentMarket from './pages/TalentMarket';
import TalentSearch from './pages/TalentSearch';
import ResumeLibrary from './pages/ResumeLibrary';
import JobManagement from './pages/JobManagement';
import Messages from './pages/Messages';
import Profile from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="talent-market" element={<TalentMarket />} />
          <Route path="talent-search" element={<TalentSearch />} />
          <Route path="resume-library" element={<ResumeLibrary />} />
          <Route path="jobs" element={<JobManagement />} />
          <Route path="messages" element={<Messages />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
