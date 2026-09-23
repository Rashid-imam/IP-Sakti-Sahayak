import { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Network, Scale, Search } from 'lucide-react';

import TopBar from './components/TopBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import AskSaktiAI from './pages/Ask-Sakti-ai';
import KnowYourProduct from './pages/knowYourProduct';
import DictionaryPage from './pages/DictionaryPage';
import KnowledgeGraph from './pages/KnowledgeGraph';
import Library from './pages/Library';
import Community from './pages/CommunityPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/signupPage';  
import DashboardPage from './pages/DashboardPage';
import TKDLPage from './pages/TKDLpage';
import PatentSearchPage from './pages/PatentSearchPage';
import ChatBot from './components/ChatBot';

function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}

function Shell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [largeText, setLargeText] = useState(false);

  return (
    <div className={largeText ? 'text-large min-h-screen bg-paper text-ink' : 'min-h-screen bg-paper text-ink'}>
      {/* <TopBar onTextSize={() => setLargeText((value) => !value)} /> */}
      <Navbar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <main id="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ask-sakti-ai" element={<AskSaktiAI />} />
          <Route path="/knowProduct" element={<KnowYourProduct />} />
          <Route path="/dictionary" element={<DictionaryPage />} />
          <Route path="/knowledgeGraph" element={<KnowledgeGraph />} />
          <Route path="/resources" element={<Library />} />
          <Route path="/library" element={<Navigate to="/resources" replace />} />
          <Route path="/help-support" element={<Navigate to="/resources" replace />} />
          <Route path="/community" element={<Community />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/tkdl" element={<TKDLPage />} />
          <Route path="/patent-search" element={<PatentSearchPage />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
}

export default App;
