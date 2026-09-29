import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Overview from './pages/Overview';
import Services from './pages/Services';
import ServiceDetails from './pages/ServiceDetails';
import Logs from './pages/Logs';
import Metrics from './pages/Metrics';
import Traces from './pages/Traces';
import Alerts from './pages/Alerts';
import AiAssistant from './pages/AiAssistant';

function RequireAuth({ children, isAuthenticated }: { children: React.JSX.Element, isAuthenticated: boolean }) {
  let location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
        
        <Route path="/" element={
          <RequireAuth isAuthenticated={isAuthenticated}>
            <Layout onLogout={() => setIsAuthenticated(false)} />
          </RequireAuth>
        }>
          <Route index element={<Overview />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:id" element={<ServiceDetails />} />
          <Route path="logs" element={<Logs />} />
          <Route path="metrics" element={<Metrics />} />
          <Route path="traces" element={<Traces />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="ai" element={<AiAssistant />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
