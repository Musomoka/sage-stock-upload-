import React from 'react';

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
const Dashboard: React.FC = () => (
  <div className="dashboard">
    {/* ── KPI Row ── */}
    <div className="wf-grid wf-grid-4">
      <WireframeCard title="Total Items" subtitle="Stock records" accent="blue">
        <StatBlock value="1,248" label="+12 this week" />
      </WireframeCard>
      <WireframeCard title="Pending Uploads" subtitle="Awaiting sync" accent="amber">
        <StatBlock value="34" label="3 overdue" />
      </WireframeCard>
      <WireframeCard title="Last Sync" subtitle="Sage integration" accent="green">
        <StatBlock value="2h ago" label="✓ Success" />
      </WireframeCard>
      <WireframeCard title="Errors" subtitle="Validation failures" accent="purple">
        <StatBlock value="2" label="Needs review" />
      </WireframeCard>
    </div>

    {/* ── Chart + Activity ── */}
    <div className="wf-grid wf-grid-2">
      <WireframeCard title="Weekly Upload Activity" subtitle="Stock items uploaded per day">
        <PlaceholderChart />
      </WireframeCard>

      <WireframeCard title="Recent Activity" accent="green">
        <div className="wf-activity-list">
          {[
            { time: '10:32 AM', msg: 'Uploaded 45 items → Sage Cloud',  type: 'upload' },
            { time: '09:15 AM', msg: 'Validated column mapping',        type: 'config' },
            { time: 'Yesterday', msg: 'Exported report to Excel sheet', type: 'export' },
            { time: 'Yesterday', msg: '2 validation errors fixed',      type: 'fix' },
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
        <button className="wf-btn wf-btn-primary">📥 Import CSV</button>
        <button className="wf-btn wf-btn-outline">🔗 Connect Sage</button>
        <button className="wf-btn wf-btn-outline">📤 Upload All</button>
        <button className="wf-btn wf-btn-outline">📊 Export Report</button>
        <button className="wf-btn wf-btn-outline">🗑 Clear Sheet</button>
      </div>
    </WireframeCard>
  </div>
);

export default Dashboard;
