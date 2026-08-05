import React from 'react';

type ViewKey = 'dashboard' | 'import' | 'data' | 'settings' | 'export';

interface SidebarProps {
  activeView: ViewKey;
  onNavigate: (view: ViewKey) => void;
  compact?: boolean;
}

const navItems: { key: ViewKey; icon: string; label: string }[] = [
  { key: 'dashboard', icon: '📊', label: 'Dashboard' },
  { key: 'export',    icon: '📤', label: 'Export CSV' },
  { key: 'import',    icon: '📥', label: 'Edit & Export' },
  { key: 'data',      icon: '📋', label: 'Price Table' },
  { key: 'settings',  icon: '⚙️', label: 'Settings' },
];

const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate, compact }) => (
  <nav className={`sidebar ${compact ? 'sidebar-compact' : ''}`}>
    <div className={`sidebar-brand ${compact ? 'sidebar-brand-compact' : ''}`}>
      <span className="brand-icon-large">🐂</span>
      {!compact && <span className="brand-title">CSV Mapper</span>}
    </div>
    <ul className="sidebar-nav">
      {navItems.map((item) => (
        <li key={item.key}>
          <button
            className={`sidebar-link ${activeView === item.key ? 'active' : ''}`}
            onClick={() => onNavigate(item.key)}
            title={item.label}
          >
            <span className="sidebar-icon">{item.icon}</span>
            {!compact && <span className="sidebar-label">{item.label}</span>}
          </button>
        </li>
      ))}
    </ul>
    <div className={`sidebar-footer ${compact ? 'sidebar-footer-compact' : ''}`}>
      <div className="sidebar-status">
        <span className="status-dot online" />
        {!compact && <span className="status-text">Ready</span>}
      </div>
    </div>
  </nav>
);

export default Sidebar;
