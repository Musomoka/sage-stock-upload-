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
      <WireframeCard title="Total SKUs" subtitle="Unique stock items" accent="blue">
        <StatBlock value="~210" label="Across all pricelists" />
      </WireframeCard>
      <WireframeCard title="Pricelists" subtitle="Active price tiers" accent="amber">
        <StatBlock value="4" label="Retail + 3 Warehouses" />
      </WireframeCard>
      <WireframeCard title="Last Export" subtitle="CSV generated" accent="green">
        <StatBlock value="Today" label="✓ SWITCH PRICELIST.csv" />
      </WireframeCard>
      <WireframeCard title="Blocked Items" subtitle="Marked BLOCKED" accent="purple">
        <StatBlock value="~45" label="Needs review" />
      </WireframeCard>
    </div>

    {/* ── Pricelist Summary + Activity ── */}
    <div className="wf-grid wf-grid-2">
      <WireframeCard title="Pricelist Tiers" subtitle="Price levels across locations">
        <div className="wf-activity-list">
          {[
            { time: 'Retail',     msg: 'Highest pricing — walk-in customers',       type: 'upload' },
            { time: 'Warehouse',  msg: 'Lusaka — mid-tier trade pricing',           type: 'config' },
            { time: 'Warehouse',  msg: 'Kitwe — mid-tier trade pricing',            type: 'export' },
            { time: 'Jesmondine', msg: 'Special location pricing',                   type: 'fix' },
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
            { time: '10:32 AM', msg: 'Updated DEYE inverter prices',            type: 'upload' },
            { time: '09:15 AM', msg: 'Added new JINKO 620W panels',             type: 'config' },
            { time: 'Yesterday', msg: 'Marked 8 items as BLOCKED',              type: 'fix' },
            { time: 'Yesterday', msg: 'Exported SWITCH PRICELIST.csv',          type: 'export' },
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
        <button className="wf-btn wf-btn-primary">📥 Load from Sheet</button>
        <button className="wf-btn wf-btn-outline">➕ Add New SKU</button>
        <button className="wf-btn wf-btn-outline">📤 Export CSV</button>
        <button className="wf-btn wf-btn-outline">🔍 Find Blocked</button>
        <button className="wf-btn wf-btn-outline">📋 Copy to Clipboard</button>
      </div>
    </WireframeCard>
  </div>
);

export default Dashboard;
