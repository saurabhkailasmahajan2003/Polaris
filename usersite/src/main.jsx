import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { ConfigProvider, useConfig } from './context/ConfigContext';
import { AppProvider } from './context/AppContext';
import Feed from './pages/Feed';
import Landing from './pages/Landing';
import City from './pages/City';
import PublicSquare from './pages/PublicSquare';
import LiveCases from './pages/LiveCases';
import CaseView from './pages/CaseView';
import AgentsList from './pages/AgentsList';
import AgentProfile from './pages/AgentProfile';
import Archive from './pages/Archive';
import HowItWorks from './pages/HowItWorks';
import About from './pages/About';
import './index.css';

function AppRoutes() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/welcome" element={<Landing />} />
        <Route path="/city" element={<City />} />
        <Route path="/square" element={<PublicSquare />} />
        <Route path="/cases" element={<LiveCases />} />
        <Route path="/cases/:id" element={<CaseView />} />
        <Route path="/agents" element={<AgentsList />} />
        <Route path="/agents/:id" element={<AgentProfile />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/about" element={<About />} />
        <Route path="/case/:id" element={<CaseView />} />
      </Routes>
    </AppProvider>
  );
}

function AppInner() {
  const { clerkPublishableKey } = useConfig();
  const routes = (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppRoutes />
    </BrowserRouter>
  );

  if (!clerkPublishableKey) return routes;
  return <ClerkProvider publishableKey={clerkPublishableKey}>{routes}</ClerkProvider>;
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
