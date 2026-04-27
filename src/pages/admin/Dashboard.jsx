import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { DollarSign, ShoppingBag } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    fetch('http://localhost:5009/api/admin/stats', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [token]);

  if (loading) return <div>Loading dashboard...</div>;
  if (!stats) return <div>Error loading stats</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="font-serif text-2xl sm:text-3xl text-ink mb-6 sm:mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
        <div className="bg-paper p-5 sm:p-6 rounded-sm shadow-sm border border-taupe/10 flex items-center gap-4 min-w-0">
          <div className="p-3 sm:p-4 bg-cream/50 rounded-full flex-shrink-0">
            <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-ink" />
          </div>
          <div className="min-w-0">
            <p className="text-sm uppercase tracking-widest text-taupe">Total Revenue</p>
            <p className="font-serif text-2xl sm:text-3xl text-ink break-words">${stats.totalRevenue?.toFixed(2) || '0.00'}</p>
          </div>
        </div>

        <div className="bg-paper p-5 sm:p-6 rounded-sm shadow-sm border border-taupe/10 flex items-center gap-4 min-w-0">
          <div className="p-3 sm:p-4 bg-cream/50 rounded-full flex-shrink-0">
            <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 text-ink" />
          </div>
          <div className="min-w-0">
            <p className="text-sm uppercase tracking-widest text-taupe">Total Orders</p>
            <p className="font-serif text-2xl sm:text-3xl text-ink">{stats.totalOrders || 0}</p>
          </div>
        </div>
      </div>

      <div className="bg-paper p-4 sm:p-6 rounded-sm shadow-sm border border-taupe/10 overflow-hidden">
        <h2 className="font-serif text-xl text-ink mb-6">Sales (Last 7 Days)</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.salesChart}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#8B8B8B'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#8B8B8B'}} tickFormatter={(value) => `$${value}`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#FAF9F6', border: '1px solid #E5E5E5', borderRadius: '4px' }}
                itemStyle={{ color: '#1A1A1A' }}
              />
              <Line type="monotone" dataKey="revenue" stroke="#1A1A1A" strokeWidth={2} dot={{fill: '#1A1A1A', strokeWidth: 2}} activeDot={{r: 8}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
