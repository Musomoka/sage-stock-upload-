import React from 'react';

interface HeaderProps {
  activeView: string;
}

const viewLabels: Record<string, string> = {
  dashboard: '📊 Dashboard',
  import:    '📥 Edit Prices & Export CSV',
  data:      '📋 Data Table',
  export:    '📤 Export CSV',
  settings:  '⚙️ Settings',
};

const Header: React.FC<HeaderProps> = ({ activeView }) => (
  <header className="app-header">
    <div className="header-brand">
      <span className="brand-icon">⚡</span>
      <span className="brand-name">CSV Mapper</span>
    </div>
    <div className="header-breadcrumb">
      {viewLabels[activeView] || 'Dashboard'}
    </div>
    <div className="header-actions">
      <button className="wf-btn wf-btn-sm wf-btn-outline" title="Refresh">
        🔄
      </button>
      <button className="wf-btn wf-btn-sm wf-btn-outline" title="Help">
        ❓
      </button>
    </div>
  </header>
);

export default Header;
