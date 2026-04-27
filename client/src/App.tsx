import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { DiscordCallback } from './pages/DiscordCallback';
import { DashboardLayout } from './components/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { Schedule } from './pages/Schedule';
import { Insights } from './pages/Insights';
import { Settings } from './pages/Settings';
import { SleepLog } from './pages/SleepLog';
import { MoodJournal } from './pages/MoodJournal';
import { GameDetails } from './pages/GameDetails';
import { OwnerDashboard } from './pages/owner/OwnerDashboard';
import { CommunityDetails } from './pages/owner/CommunityDetails';
import { StaffPortal } from './pages/StaffPortal';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/discord/callback" element={<DiscordCallback />} />
        
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="insights" element={<Insights />} />
          <Route path="settings" element={<Settings />} />
          <Route path="sleep" element={<SleepLog />} />
          <Route path="mood" element={<MoodJournal />} />
          <Route path="games/:guildId" element={<GameDetails />} />
          
          {/* Owner Portal */}
          <Route path="owner" element={<OwnerDashboard />} />
          <Route path="owner/:guildId" element={<CommunityDetails />} />

          {/* Staff Portal */}
          <Route path="staff" element={<StaffPortal />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
