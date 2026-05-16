import { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Download, Eye, Search, ShoppingCart, TrendingUp, Users, X } from 'lucide-react';
import axiosInstance from '../../api/axios';

const statusOptions = ['All', 'Active', 'Abandoned', 'Ordered'];
const formatINR = (value) => `INR ${Number(value || 0).toFixed(2)}`;
const formatDate = (value) => value ? new Date(value).toLocaleString() : 'N/A';

const StatCard = ({ label, value, icon: Icon }) => (
  <div className="bg-paper border border-taupe/10 p-5 rounded-sm flex items-center gap-4">
    <div className="w-11 h-11 bg-cream/60 rounded-sm flex items-center justify-center text-ink">
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-xs uppercase tracking-widest text-taupe">{label}</p>
      <p className="font-serif text-2xl text-ink mt-1">{value}</p>
    </div>
  </div>
);

const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 z-50 bg-ink/30 flex items-center justify-center p-4" onClick={onClose}>
    <div className="bg-paper border border-taupe/20 rounded-sm shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto" onClick={(event) => event.stopPropagation()}>
      <div className="p-5 border-b border-taupe/10 flex items-center justify-between gap-4">
        <h2 className="font-serif text-xl text-ink">{title}</h2>
        <button onClick={onClose} className="p-2 text-taupe hover:text-ink" aria-label="Close modal">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-5">{children}</div>
    </div>
  </div>
);

const CartAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('addedAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedCart, setSelectedCart] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userLoading, setUserLoading] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      fetchAnalytics();
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [search, status, page, sortBy, sortDirection]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: '10',
        sortBy,
        sortDirection,
      });

      if (search.trim()) params.set('search', search.trim());
      if (status !== 'All') params.set('status', status);

      const response = await axiosInstance.get(`/admin/cart-analytics?${params.toString()}`);
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch cart analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const summary = data?.summary || {};
  const items = data?.items || [];
  const topProducts = data?.topProducts || [];
  const dailyActivity = data?.dailyActivity || [];

  const chartProducts = useMemo(() => topProducts.slice(0, 6), [topProducts]);

  const toggleSort = (nextSortBy) => {
    if (sortBy === nextSortBy) {
      setSortDirection((current) => current === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(nextSortBy);
      setSortDirection('desc');
    }
    setPage(1);
  };

  const openUserDetails = async (userId) => {
    if (!userId) return;

    setUserLoading(true);
    try {
      const response = await axiosInstance.get(`/admin/user-cart/${userId}`);
      setSelectedUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user cart:', error);
    } finally {
      setUserLoading(false);
    }
  };

  const exportCsv = () => {
    const headers = ['User', 'Product', 'Quantity', 'Price', 'Total', 'Status', 'Added Date'];
    const rows = items.map((item) => [
      item.userPhoneNumber,
      item.productName,
      item.quantity,
      item.price,
      item.total,
      item.status,
      formatDate(item.addedAt),
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cart-analytics.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const pageCount = data?.totalPages || 1;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-ink">Cart Analytics</h1>
          <p className="text-sm text-taupe mt-1">Track active, abandoned, and ordered cart activity</p>
        </div>
        <button onClick={exportCsv} className="inline-flex items-center justify-center gap-2 bg-ink text-paper px-4 py-2 rounded-sm text-xs uppercase tracking-widest hover:bg-ink/85">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
        <StatCard label="Total carts" value={summary.totalCarts || 0} icon={ShoppingCart} />
        <StatCard label="Active carts" value={summary.activeCarts || 0} icon={TrendingUp} />
        <StatCard label="Abandoned carts" value={summary.abandonedCarts || 0} icon={Users} />
        <StatCard label="Ordered carts" value={summary.orderedCarts || 0} icon={ShoppingCart} />
        <StatCard label="Top book" value={summary.topBook || 'N/A'} icon={TrendingUp} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <div className="bg-paper border border-taupe/10 rounded-sm p-5">
          <h2 className="font-serif text-xl text-ink mb-4">Most Added Books</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartProducts}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                <XAxis dataKey="productName" tick={{ fill: '#8B8B8B', fontSize: 11 }} interval={0} angle={-18} textAnchor="end" height={80} />
                <YAxis tick={{ fill: '#8B8B8B', fontSize: 11 }} />
                <Tooltip formatter={(value) => [value, 'Quantity']} />
                <Bar dataKey="quantity" fill="#1A1A1A" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-paper border border-taupe/10 rounded-sm p-5">
          <h2 className="font-serif text-xl text-ink mb-4">Daily Cart Activity</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyActivity}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                <XAxis dataKey="date" tick={{ fill: '#8B8B8B', fontSize: 11 }} />
                <YAxis tick={{ fill: '#8B8B8B', fontSize: 11 }} />
                <Tooltip formatter={(value, name) => [value, name === 'quantity' ? 'Quantity' : 'Carts']} />
                <Line type="monotone" dataKey="quantity" stroke="#1A1A1A" strokeWidth={2} dot={{ fill: '#1A1A1A' }} />
                <Line type="monotone" dataKey="carts" stroke="#8B8B8B" strokeWidth={2} dot={{ fill: '#8B8B8B' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-paper border border-taupe/10 rounded-sm shadow-sm overflow-hidden">
        <div className="p-4 border-b border-taupe/10 flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
          <label className="flex items-center gap-2 border border-taupe/20 px-3 py-2 rounded-sm lg:w-96">
            <Search className="w-4 h-4 text-taupe" />
            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search user, product, cart"
              className="w-full bg-transparent text-sm focus:outline-none"
            />
          </label>

          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
            className="border border-taupe/20 bg-transparent px-3 py-2 rounded-sm text-sm focus:outline-none"
          >
            {statusOptions.map((option) => <option key={option} value={option}>{option} carts</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left border-collapse">
            <thead>
              <tr className="bg-cream/50 border-b border-taupe/20 text-xs uppercase tracking-widest text-taupe">
                <th className="p-4 font-medium"><button onClick={() => toggleSort('user')}>User</button></th>
                <th className="p-4 font-medium"><button onClick={() => toggleSort('product')}>Product</button></th>
                <th className="p-4 font-medium">Product Image</th>
                <th className="p-4 font-medium"><button onClick={() => toggleSort('quantity')}>Quantity</button></th>
                <th className="p-4 font-medium"><button onClick={() => toggleSort('price')}>Price</button></th>
                <th className="p-4 font-medium"><button onClick={() => toggleSort('total')}>Total</button></th>
                <th className="p-4 font-medium"><button onClick={() => toggleSort('status')}>Status</button></th>
                <th className="p-4 font-medium"><button onClick={() => toggleSort('addedAt')}>Added Date</button></th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-taupe/10">
              {loading ? (
                <tr><td colSpan="9" className="p-8 text-center text-taupe">Loading cart analytics...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan="9" className="p-8 text-center text-taupe">No cart activity found.</td></tr>
              ) : items.map((item) => (
                <tr key={`${item.cartId}-${item.cartItemId}-${item.productId}`} className="hover:bg-cream/20 transition-colors">
                  <td className="p-4">
                    <button disabled={!item.userId} onClick={() => openUserDetails(item.userId)} className="text-left disabled:cursor-default">
                      <span className="block font-medium text-ink">{item.userPhoneNumber}</span>
                      <span className="text-xs text-taupe">{item.userRole}</span>
                    </button>
                  </td>
                  <td className="p-4 text-sm font-medium text-ink">{item.productName}</td>
                  <td className="p-4">
                    <img src={item.productImage || '/product.png'} alt={item.productName} className="w-12 h-14 object-cover rounded-sm border border-taupe/10" />
                  </td>
                  <td className="p-4 text-sm text-ink">{item.quantity}</td>
                  <td className="p-4 text-sm text-ink">{formatINR(item.price)}</td>
                  <td className="p-4 text-sm font-medium text-ink">{formatINR(item.total)}</td>
                  <td className="p-4">
                    <span className={`inline-block px-3 py-1 text-[10px] font-medium uppercase tracking-wider rounded-full ${
                      item.status === 'Abandoned' ? 'bg-red-100 text-red-700' :
                      item.status === 'Ordered' ? 'bg-green-100 text-green-700' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-taupe">{formatDate(item.addedAt)}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => setSelectedCart(item)} className="inline-flex items-center gap-2 px-3 py-1.5 bg-ink text-paper rounded-sm text-xs uppercase tracking-wider hover:bg-ink/85">
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-taupe/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-taupe">
          <span>Page {data?.page || 1} of {pageCount} - {data?.totalItems || 0} rows</span>
          <div className="flex items-center gap-2">
            <button disabled={page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="px-3 py-1.5 border border-taupe/20 rounded-sm disabled:opacity-40">Previous</button>
            <button disabled={page >= pageCount} onClick={() => setPage((current) => current + 1)} className="px-3 py-1.5 border border-taupe/20 rounded-sm disabled:opacity-40">Next</button>
          </div>
        </div>
      </div>

      {selectedCart && (
        <Modal title="Cart Details" onClose={() => setSelectedCart(null)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div><p className="text-taupe">Cart</p><p className="font-medium text-ink">{selectedCart.cartId}</p></div>
            <div><p className="text-taupe">Status</p><p className="font-medium text-ink">{selectedCart.status}</p></div>
            <div><p className="text-taupe">User</p><p className="font-medium text-ink">{selectedCart.userPhoneNumber}</p></div>
            <div><p className="text-taupe">Added</p><p className="font-medium text-ink">{formatDate(selectedCart.addedAt)}</p></div>
            <div className="sm:col-span-2 flex items-center gap-4 border-t border-taupe/10 pt-4">
              <img src={selectedCart.productImage || '/product.png'} alt={selectedCart.productName} className="w-16 h-20 object-cover rounded-sm border border-taupe/10" />
              <div>
                <p className="font-serif text-lg text-ink">{selectedCart.productName}</p>
                <p className="text-taupe">Qty {selectedCart.quantity} x {formatINR(selectedCart.price)}</p>
                <p className="font-medium text-ink mt-1">{formatINR(selectedCart.total)}</p>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {(selectedUser || userLoading) && (
        <Modal title="User Cart Details" onClose={() => setSelectedUser(null)}>
          {userLoading ? (
            <div className="text-taupe">Loading user cart...</div>
          ) : (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div><p className="text-taupe">Phone</p><p className="font-medium text-ink">{selectedUser.phoneNumber}</p></div>
                <div><p className="text-taupe">Active items</p><p className="font-medium text-ink">{selectedUser.activeCartItems}</p></div>
                <div><p className="text-taupe">Active total</p><p className="font-medium text-ink">{formatINR(selectedUser.activeCartTotal)}</p></div>
              </div>
              <div className="space-y-3">
                {selectedUser.items?.map((item) => (
                  <div key={`${item.cartId}-${item.cartItemId}`} className="flex items-center gap-3 border border-taupe/10 p-3 rounded-sm">
                    <img src={item.productImage || '/product.png'} alt={item.productName} className="w-12 h-14 object-cover rounded-sm" />
                    <div className="min-w-0">
                      <p className="font-medium text-ink">{item.productName}</p>
                      <p className="text-xs text-taupe">Qty {item.quantity} - {item.status} - {formatDate(item.addedAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default CartAnalytics;
