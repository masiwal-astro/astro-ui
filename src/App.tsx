import { Route, Routes } from 'react-router-dom';
import { AuthPage } from './pages/AuthPage';
import { LandingPage } from './pages/LandingPage';
import { NotFound } from './pages/NotFound';
import { SanctuaryPage } from './pages/SanctuaryPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<AuthPage intent="login" />} />
      <Route path="/signup" element={<AuthPage intent="signup" />} />
      <Route path="/app" element={<SanctuaryPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
