import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import DataPanel from './DataPanel';
import SettingsPanel from './SettingsPanel';

interface AppProps {
  isOffice: boolean;
}

type ViewKey = 'dashboard' | 'import' | 'data' | 'settings';

const App: React.FC<AppProps> = ({ isOffice }) => {
  const [activeView, setActiveView] = useState<ViewKey>('dashboard');

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard />;
      case 'import':    return <DataPanel />;
      case 'data':      return <DataPanel variant="table" />;
      case 'settings':  return <SettingsPanel />;
      default:          return <Dashboard />;
    }
  };

  if (!isOffice) {
    // Standalone wireframe preview mode
    return (
      <div className="app-standalone">
        <div className="standalone-banner">
          🧪 Wireframe Preview — Open in Excel as an Add-in for full functionality
        </div>
        <div className="app-shell">
          <Sidebar activeView={activeView} onNavigate={setActiveView} />
          <div className="app-main">
            <Header activeView={activeView} />
            <div className="app-content">{renderView()}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-taskpane">
      <Header activeView={activeView} />
      <div className="taskpane-content">{renderView()}</div>
      <Sidebar activeView={activeView} onNavigate={setActiveView} compact />
    </div>
  );
};

export default App;
