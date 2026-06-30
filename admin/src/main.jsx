import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { ConfigProvider, useConfig } from './context/ConfigContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import EventsManager from './pages/EventsManager';
import CasesMonitor from './pages/CasesMonitor';
import CaseDetail from './pages/CaseDetail';
import VerdictsReview from './pages/VerdictsReview';
import AgentsManager from './pages/AgentsManager';
import './index.css';

function AppInner() {
  const { clerkPublishableKey } = useConfig();
  const content = (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/events" element={<EventsManager />} />
          <Route path="/cases" element={<CasesMonitor />} />
          <Route path="/cases/:id" element={<CaseDetail />} />
          <Route path="/verdicts" element={<VerdictsReview />} />
          <Route path="/agents" element={<AgentsManager />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );

  if (!clerkPublishableKey) return content;
  return <ClerkProvider publishableKey={clerkPublishableKey}>{content}</ClerkProvider>;
}

function App() {
  return (
    <ConfigProvider>
      <AppInner />
    </ConfigProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
