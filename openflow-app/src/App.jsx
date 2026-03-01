import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Results from './pages/Results';
import Team from './pages/Team';
import Calendar from './pages/Calendar';
import Office from './pages/Office';
import Memory from './pages/Memory';
import ContentPipeline from './pages/ContentPipeline';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/results" element={<Results />} />
          <Route path="/team" element={<Team />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/office" element={<Office />} />
          <Route path="/memory" element={<Memory />} />
          <Route path="/content" element={<ContentPipeline />} />
          <Route path="*" element={<div className="flex items-center justify-center h-full text-2xl text-muted font-bold">Coming Soon</div>} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
