import React from 'react';

interface DashboardProps {
  isOffice: boolean;
  onNavigate: (view: 'dashboard' | 'import' | 'data' | 'settings' | 'export') => void;
}

/* ── Wireframe card with dashed border & placeholder pattern ── */
const WireframeCard: React.FC<{
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  accent?: 'blue' | 'green' | 'amber' | 'purple';
}> = ({ title, subtitle, children, accent = 'blue' }) => (
  <div className={`wf-card wf-accent-${accent}`}>
    <div className="wf-card-header">
      <h3 className="wf-card-title">{title}</h3>
      {subtitle && <p className="wf-card-subtitle">{subtitle}</p>}
    </div>
    <div className="wf-card-body">{children}</div>
  </div>
);

/* ── Stat block ── */
const StatBlock: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div className="wf-stat">
    <span className="wf-stat-value">{value}</span>
    <span className="wf-stat-label">{label}</span>
  </div>
);

/* ── Placeholder chart bar ── */
const PlaceholderChart: React.FC = () => (
  <div className="wf-chart-placeholder">
    {[80, 55, 70, 90, 45, 65, 75].map((h, i) => (
      <div key={i} className="wf-bar" style={{ height: `${h}%` }}>
        <span className="wf-bar-label">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
      </div>
    ))}
  </div>
);

/* ── Dashboard ── */
const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => (
  <div className="dashboard">
    {/* ── KPI Row ── */}
    <div className="wf-grid wf-grid-4">
      <WireframeCard title="Total Records" subtitle="Rows of data" accent="blue">
        <StatBlock value="—" label="Load a range to see data" />
      </WireframeCard>
      <WireframeCard title="Columns" subtitle="Available source columns" accent="amber">
        <StatBlock value="—" label="Detected from headers" />
      </WireframeCard>
      <WireframeCard title="Last Export" subtitle="CSV generated" accent="green">
        <StatBlock value="—" label="Export to create a file" />
      </WireframeCard>
      <WireframeCard title="Filtered Rows" subtitle="Excluded by rules" accent="purple">
        <StatBlock value="—" label="Configure filters to exclude" />
      </WireframeCard>
    </div>

    {/* ── Column Summary + Activity ── */}
    <div className="wf-grid wf-grid-2">
      <WireframeCard title="CSV Presets" subtitle="Saved column layouts">
        <div className="wf-activity-list">
          {[
            { time: '—',   msg: 'Select an Excel range in the Export CSV view',    type: 'upload' },
            { time: '—',   msg: 'Drag columns into your desired CSV order',        type: 'config' },
            { time: '—',   msg: 'Set text or number format per column',            type: 'export' },
            { time: '—',   msg: 'Save your layout as a reusable preset',           type: 'fix' },
          ].map((a, i) => (
            <div key={i} className={`wf-activity-item wf-activity-${a.type}`}>
              <span className="wf-activity-time">{a.time}</span>
              <span className="wf-activity-msg">{a.msg}</span>
            </div>
          ))}
        </div>
      </WireframeCard>

      <WireframeCard title="Recent Changes" accent="green">
        <div className="wf-activity-list">
          {[
            { time: '—', msg: 'No recent activity yet',                          type: 'upload' },
          ].map((a, i) => (
            <div key={i} className={`wf-activity-item wf-activity-${a.type}`}>
              <span className="wf-activity-time">{a.time}</span>
              <span className="wf-activity-msg">{a.msg}</span>
            </div>
          ))}
        </div>
      </WireframeCard>
    </div>

    {/* ── Quick Actions ── */}
    <WireframeCard title="⚡ Quick Actions" accent="blue">
      <div className="wf-actions-row">
        <button className="wf-btn wf-btn-primary" onClick={() => onNavigate('export')}>
          📤 Export CSV
        </button>
        <button className="wf-btn wf-btn-outline" onClick={() => onNavigate('data')}>
          📋 Price Table
        </button>
        <button className="wf-btn wf-btn-outline" onClick={() => onNavigate('settings')}>
          ⚙️ Settings
        </button>
      </div>
    </WireframeCard>
  </div>
);

export default Dashboard;
