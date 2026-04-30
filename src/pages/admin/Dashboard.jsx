import { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { IndianRupee, ShoppingBag, Users, Wallet } from 'lucide-react';
import axiosInstance from '../../api/axios';

const chartRanges = [
  { key: 'day', label: 'Days', title: 'Sales (Last 7 Days)' },
  { key: 'week', label: 'Weeks', title: 'Sales (Last 8 Weeks)' },
  { key: 'month', label: 'Months', title: 'Sales (Last 12 Months)' },
  { key: 'year', label: 'Years', title: 'Sales (Last 5 Years)' },
];

const formatMonth = (date) => date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
const formatDay = (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const startOfWeek = (date) => {
  const nextDate = new Date(date);
  nextDate.setHours(0, 0, 0, 0);
  nextDate.setDate(nextDate.getDate() - nextDate.getDay());
  return nextDate;
};

const getRangeStart = (endDate, range) => {
  const start = new Date(endDate);
  start.setHours(0, 0, 0, 0);

  if (range === 'day') {
    start.setDate(start.getDate() - 6);
  }

  if (range === 'week') {
    const weekStart = startOfWeek(start);
    weekStart.setDate(weekStart.getDate() - 7 * 7);
    return weekStart;
  }

  if (range === 'month') {
    start.setDate(1);
    start.setMonth(start.getMonth() - 11);
  }

  if (range === 'year') {
    start.setMonth(0, 1);
    start.setFullYear(start.getFullYear() - 4);
  }

  return start;
};

const getBucketKey = (date, range) => {
  if (range === 'day') return date.toISOString().slice(0, 10);
  if (range === 'week') return startOfWeek(date).toISOString().slice(0, 10);
  if (range === 'month') return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  return String(date.getFullYear());
};

const getBucketLabel = (key, range) => {
  if (range === 'month') {
    const [year, month] = key.split('-').map(Number);
    return formatMonth(new Date(year, month - 1, 1));
  }

  if (range === 'year') return key;
  return formatDay(new Date(`${key}T00:00:00`));
};

const buildBuckets = (endDate, range) => {
  const start = getRangeStart(endDate, range);
  const buckets = [];
  const cursor = new Date(start);

  while (cursor <= endDate) {
    const key = getBucketKey(cursor, range);
    if (!buckets.some((bucket) => bucket.key === key)) {
      buckets.push({ key, date: getBucketLabel(key, range), revenue: 0 });
    }

    if (range === 'day') cursor.setDate(cursor.getDate() + 1);
    else if (range === 'week') cursor.setDate(cursor.getDate() + 7);
    else if (range === 'month') cursor.setMonth(cursor.getMonth() + 1);
    else cursor.setFullYear(cursor.getFullYear() + 1);
  }

  return buckets;
};

const formatINR = (value) => `₹${Number(value || 0).toFixed(2)}`;

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [chartRange, setChartRange] = useState('day');
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [statsResponse, ordersResponse] = await Promise.all([
          axiosInstance.get('/admin/stats'),
          axiosInstance.get('/orders/all'),
        ]);

        setStats(statsResponse.data);
        setOrders(ordersResponse.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [token]);

  const chartData = useMemo(() => {
    if (chartRange === 'day' && orders.length === 0) {
      return stats?.salesChart || [];
    }

    const validOrders = orders.filter((order) => order.orderDate && Number.isFinite(Number(order.totalAmount)));
    const endDate = validOrders.length > 0
      ? new Date(Math.max(...validOrders.map((order) => new Date(order.orderDate).getTime())))
      : new Date();
    const buckets = buildBuckets(endDate, chartRange);
    const bucketMap = new Map(buckets.map((bucket) => [bucket.key, bucket]));
    const startDate = getRangeStart(endDate, chartRange);

    validOrders.forEach((order) => {
      const orderDate = new Date(order.orderDate);
      if (orderDate < startDate || orderDate > endDate) return;

      const key = getBucketKey(orderDate, chartRange);
      const bucket = bucketMap.get(key);
      if (bucket) {
        bucket.revenue += Number(order.totalAmount);
      }
    });

    return buckets.map((bucket) => ({
      ...bucket,
      revenue: Number(bucket.revenue.toFixed(2)),
    }));
  }, [chartRange, orders, stats?.salesChart]);

  const activeRange = chartRanges.find((range) => range.key === chartRange);

  if (loading) return <div>Loading dashboard...</div>;
  if (!stats) return <div>Error loading stats</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="font-serif text-2xl sm:text-3xl text-ink mb-6 sm:mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 sm:gap-6 mb-8 sm:mb-12">
        <div className="bg-paper p-5 sm:p-6 rounded-sm shadow-sm border border-taupe/10 flex items-center gap-4 min-w-0">
          <div className="p-3 sm:p-4 bg-cream/50 rounded-full flex-shrink-0">
            <IndianRupee className="w-6 h-6 sm:w-8 sm:h-8 text-ink" />
          </div>
          <div className="min-w-0">
            <p className="text-sm uppercase tracking-widest text-taupe">Total Revenue</p>
            <p className="font-serif text-2xl sm:text-3xl text-ink break-words">{formatINR(stats.totalRevenue)}</p>
          </div>
        </div>

        <button onClick={() => navigate('/admin/orders?status=Pending')} className="bg-paper p-5 sm:p-6 rounded-sm shadow-sm border border-taupe/10 flex items-center gap-4 min-w-0 text-left hover:bg-cream/30 transition-colors">
          <div className="p-3 sm:p-4 bg-cream/50 rounded-full flex-shrink-0">
            <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 text-ink" />
          </div>
          <div className="min-w-0">
            <p className="text-sm uppercase tracking-widest text-taupe">Pending Orders</p>
            <p className="font-serif text-2xl sm:text-3xl text-ink">{stats.pendingOrders || 0}</p>
          </div>
        </button>

        <button onClick={() => navigate('/admin/users')} className="bg-paper p-5 sm:p-6 rounded-sm shadow-sm border border-taupe/10 flex items-center gap-4 min-w-0 text-left hover:bg-cream/30 transition-colors">
          <div className="p-3 sm:p-4 bg-cream/50 rounded-full flex-shrink-0">
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-ink" />
          </div>
          <div className="min-w-0">
            <p className="text-sm uppercase tracking-widest text-taupe">Registered Users</p>
            <p className="font-serif text-2xl sm:text-3xl text-ink">{stats.totalUsers || 0}</p>
          </div>
        </button>

        <div className="bg-paper p-5 sm:p-6 rounded-sm shadow-sm border border-taupe/10 flex items-center gap-4 min-w-0">
          <div className="p-3 sm:p-4 bg-cream/50 rounded-full flex-shrink-0">
            <Wallet className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
          </div>
          <div className="min-w-0">
            <p className="text-sm uppercase tracking-widest text-taupe">Total Expenses</p>
            <p className="font-serif text-2xl sm:text-3xl text-ink break-words">{formatINR(stats.totalExpenses)}</p>
          </div>
        </div>

        <button onClick={() => navigate('/admin/expenses')} className="bg-paper p-5 sm:p-6 rounded-sm shadow-sm border border-taupe/10 flex items-center gap-4 min-w-0 text-left hover:bg-cream/30 transition-colors">
          <div className="p-3 sm:p-4 bg-cream/50 rounded-full flex-shrink-0">
            <IndianRupee className="w-6 h-6 sm:w-8 sm:h-8 text-green-700" />
          </div>
          <div className="min-w-0">
            <p className="text-sm uppercase tracking-widest text-taupe">Net Profit</p>
            <p className="font-serif text-2xl sm:text-3xl text-ink break-words">{formatINR(stats.netProfit)}</p>
          </div>
        </button>
      </div>

      <div className="bg-paper p-4 sm:p-6 rounded-sm shadow-sm border border-taupe/10 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="font-serif text-xl text-ink">{activeRange.title}</h2>
          <div className="flex overflow-x-auto rounded-sm border border-taupe/20">
            {chartRanges.map((range) => (
              <button
                key={range.key}
                onClick={() => setChartRange(range.key)}
                className={`px-3 sm:px-4 py-2 text-xs uppercase tracking-widest transition-colors whitespace-nowrap ${
                  chartRange === range.key
                    ? 'bg-ink text-paper'
                    : 'bg-paper text-taupe hover:bg-cream/40 hover:text-ink'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#8B8B8B', fontSize: 11}} interval="preserveStartEnd" />
              <YAxis width={64} axisLine={false} tickLine={false} tick={{fill: '#8B8B8B', fontSize: 11}} tickFormatter={(value) => `₹${value}`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#FAF9F6', border: '1px solid #E5E5E5', borderRadius: '4px' }}
                itemStyle={{ color: '#1A1A1A' }}
                formatter={(value) => [formatINR(value), 'Revenue']}
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
