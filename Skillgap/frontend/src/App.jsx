import React, { useState } from 'react';
import './index.css';
import { ModalProvider } from './components/ModalContext';
import Dashboard from './components/Dashboard';
import SkillGraph from './components/SkillGraph';
import Roadmap from './components/Roadmap';
import Challenges from './components/Challenges';
import Mentor from './components/Mentor';
import Portfolio from './components/Portfolio';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <ModalProvider>
      <div className="app-container">

        <nav className="sidebar">
          <div style={{ marginBottom: '40px' }}>
            <h1 className="title-gradient" style={{ fontSize: '1.8rem', letterSpacing: '-0.5px' }}>SkillGraph</h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>AI Career Intelligence</p>
          </div>

          <div className="nav-list">
            <a href="#" className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
              <span style={{ marginRight: '12px' }}>🏠</span> Dashboard
            </a>
            <a href="#" className={`nav-item ${activeTab === 'skillgraph' ? 'active' : ''}`} onClick={() => setActiveTab('skillgraph')}>
              <span style={{ marginRight: '12px' }}>📊</span> Skill Graph
            </a>
            <a href="#" className={`nav-item ${activeTab === 'roadmap' ? 'active' : ''}`} onClick={() => setActiveTab('roadmap')}>
              <span style={{ marginRight: '12px' }}>🗺️</span> Roadmap
            </a>
            <a href="#" className={`nav-item ${activeTab === 'challenges' ? 'active' : ''}`} onClick={() => setActiveTab('challenges')}>
              <span style={{ marginRight: '12px' }}>⚡</span> Challenges
            </a>
            <a href="#" className={`nav-item ${activeTab === 'mentor' ? 'active' : ''}`} onClick={() => setActiveTab('mentor')}>
              <span style={{ marginRight: '12px' }}>🤖</span> AI Mentor
            </a>
            <a href="#" className={`nav-item ${activeTab === 'portfolio' ? 'active' : ''}`} onClick={() => setActiveTab('portfolio')}>
              <span style={{ marginRight: '12px' }}>🏆</span> Portfolio
            </a>
          </div>
        </nav>


        <main className="main-content">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'skillgraph' && <SkillGraph />}
          {activeTab === 'roadmap' && <Roadmap />}
          {activeTab === 'challenges' && <Challenges />}
          {activeTab === 'mentor' && <Mentor />}
          {activeTab === 'portfolio' && <Portfolio />}
        </main>

      </div>
    </ModalProvider>
  );
}

export default App;
