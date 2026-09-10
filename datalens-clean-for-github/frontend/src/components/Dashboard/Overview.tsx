
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, DollarSign, Activity, Sparkles } from 'lucide-react';

const mockChartData = [
  { name: 'May 1', value: 200 },
  { name: 'May 6', value: 250 },
  { name: 'May 11', value: 210 },
  { name: 'May 16', value: 280 },
  { name: 'May 21', value: 220 },
  { name: 'May 26', value: 350 }, // Anomaly
  { name: 'May 31', value: 290 },
];

export default function DashboardOverview() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="text-h2">Executive Overview</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-secondary">May 1 - May 31, 2025</button>
          <button className="btn btn-primary animate-pulse-border">
            <Sparkles size={16} /> Ask AI
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="dashboard-grid">
        <div className="card col-span-3">
          <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
            Total Revenue <DollarSign size={16} className="text-accent" />
          </div>
          <div className="card-value">$2,405,300</div>
          <div className="card-trend trend-up"><TrendingUp size={14} /> +18.6% vs last month</div>
        </div>
        
        <div className="card col-span-3">
          <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
            Active Users <Users size={16} className="text-purple" />
          </div>
          <div className="card-value">1,234,333</div>
          <div className="card-trend trend-up"><TrendingUp size={14} /> +12.4% vs last month</div>
        </div>

        <div className="card col-span-3">
          <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
            Conversion Rate <Activity size={16} className="text-success" />
          </div>
          <div className="card-value">3.42%</div>
          <div className="card-trend trend-up"><TrendingUp size={14} /> +8.7% vs last month</div>
        </div>

        <div className="card col-span-3 ai-card">
          <div className="card-title text-accent" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={16} /> AI Insight
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '0.5rem' }}>Unusual spike in revenue detected on May 26.</div>
          <div className="text-small">This is due to a surge in New Users from Organic Search and a 23% increase in Avg. Order Value.</div>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="dashboard-grid">
        <div className="card col-span-8">
          <div className="card-title mb-4">Revenue Over Time</div>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Area type="monotone" dataKey="value" stroke="var(--accent-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card col-span-4">
          <div className="card-title mb-4">Top Contributing Factors</div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-tertiary)' }}></div>
                <span className="text-body">New Users (Organic)</span>
              </div>
              <span className="text-success font-medium">+67%</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-secondary)' }}></div>
                <span className="text-body">Avg. Order Value Increase</span>
              </div>
              <span className="text-success font-medium">+23%</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)' }}></div>
                <span className="text-body">Marketing Campaign</span>
              </div>
              <span className="text-success font-medium">+18%</span>
            </div>
          </div>
          
          <button className="btn btn-secondary" style={{ width: '100%', marginTop: '2rem' }}>
            View Full Analysis
          </button>
        </div>
      </div>
    </div>
  );
}
