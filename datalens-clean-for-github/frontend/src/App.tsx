import { useState } from 'react';
import { LayoutDashboard, Database, Activity, FilePlus, Settings, Bell, Search, UserCircle } from 'lucide-react';
import DashboardOverview from './components/Dashboard/Overview';
import DatasetUploader from './components/Upload/DatasetUploader';

function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'upload'>('dashboard');

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Database size={18} color="white" />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em' }}>DataLens<span style={{ color: 'var(--accent-primary)' }}>.ai</span></span>
        </div>
        
        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Analytics</div>
        <button 
          className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
          onClick={() => setCurrentView('dashboard')}
        >
          <LayoutDashboard size={18} />
          Overview
        </button>
        <button 
          className="nav-item"
          onClick={() => {}}
        >
          <Activity size={18} />
          Insights
        </button>
        
        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginTop: '1.5rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Data</div>
        <button 
          className={`nav-item ${currentView === 'upload' ? 'active' : ''}`}
          onClick={() => setCurrentView('upload')}
        >
          <FilePlus size={18} />
          Upload Dataset
        </button>
        <button 
          className="nav-item"
        >
          <Database size={18} />
          Sources
        </button>

        <div style={{ marginTop: 'auto' }}>
          <button className="nav-item">
            <Settings size={18} />
            Settings
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Ask AI or search metrics..." 
                style={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.5rem 1rem 0.5rem 2.5rem',
                  color: 'var(--text-primary)',
                  width: '300px',
                  outline: 'none'
                }} 
              />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button style={{ color: 'var(--text-secondary)' }}><Bell size={20} /></button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.75rem', borderRadius: '20px', cursor: 'pointer' }}>
              <UserCircle size={24} color="var(--accent-primary)" />
              <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Admin User</span>
            </div>
          </div>
        </header>

        <div className="content-scroll">
          {currentView === 'dashboard' ? <DashboardOverview /> : <DatasetUploader />}
        </div>
      </main>
    </div>
  );
}

export default App;
