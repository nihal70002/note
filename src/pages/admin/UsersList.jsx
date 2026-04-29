import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Package, Search, ShieldCheck, UserRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UsersList = () => {
  const { token, user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('All');
  const [message, setMessage] = useState('');
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [userOrders, setUserOrders] = useState({});
  const [ordersLoading, setOrdersLoading] = useState(false);
  const formatINR = (value) => `₹${Number(value || 0).toFixed(2)}`;
  const getAddress = (order) => {
    const parts = [
      order.addressLine1,
      order.addressLine2,
      order.city,
      order.state,
      order.pincode
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : order.deliveryAddress;
  };

  useEffect(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (role !== 'All') params.set('role', role);

    fetch(`http://localhost:5009/api/admin/users?${params.toString()}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch users:', err);
        setLoading(false);
      });
  }, [token, search, role]);

  const totals = useMemo(() => {
    return users.reduce((summary, item) => {
      summary.revenue += item.totalSpent || 0;
      summary.orders += item.orderCount || 0;
      if (item.isBlocked) summary.blocked += 1;
      if (item.role === 'Admin') summary.admins += 1;
      else summary.customers += 1;
      return summary;
    }, { revenue: 0, orders: 0, customers: 0, admins: 0, blocked: 0 });
  }, [users]);

  const updateRole = async (id, nextRole) => {
    setMessage('');

    const response = await fetch(`http://localhost:5009/api/admin/users/${id}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ role: nextRole })
    });

    if (response.ok) {
      setUsers(prev => prev.map(item => item.id === id ? { ...item, role: nextRole } : item));
      setMessage('User role updated.');
    } else {
      setMessage('Could not update user role.');
    }
  };

  const toggleBlock = async (id, isBlocked) => {
    setMessage('');

    const response = await fetch(`http://localhost:5009/api/admin/users/${id}/block`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ isBlocked })
    });

    if (response.ok) {
      setUsers(prev => prev.map(item => item.id === id ? { ...item, isBlocked } : item));
      setMessage(isBlocked ? 'User blocked.' : 'User unblocked.');
    } else {
      setMessage('Could not update user status.');
    }
  };

  const toggleUserOrders = async (id) => {
    if (expandedUserId === id) {
      setExpandedUserId(null);
      return;
    }

    setExpandedUserId(id);
    if (userOrders[id]) return;

    setOrdersLoading(true);
    try {
      const response = await fetch(`http://localhost:5009/api/admin/users/${id}/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setUserOrders(prev => ({ ...prev, [id]: data }));
      }
    } catch (error) {
      console.error('Failed to fetch user orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  if (loading) return <div className="text-taupe p-8">Loading users...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-ink">Users</h1>
          <p className="text-sm text-taupe mt-1">Registered customers and admin accounts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-paper border border-taupe/10 p-5 rounded-sm">
          <p className="text-xs uppercase tracking-widest text-taupe">Customers</p>
          <p className="font-serif text-2xl text-ink mt-2">{totals.customers}</p>
        </div>
        <div className="bg-paper border border-taupe/10 p-5 rounded-sm">
          <p className="text-xs uppercase tracking-widest text-taupe">Admins</p>
          <p className="font-serif text-2xl text-ink mt-2">{totals.admins}</p>
        </div>
        <div className="bg-paper border border-taupe/10 p-5 rounded-sm">
          <p className="text-xs uppercase tracking-widest text-taupe">User Orders</p>
          <p className="font-serif text-2xl text-ink mt-2">{totals.orders}</p>
        </div>
        <div className="bg-paper border border-taupe/10 p-5 rounded-sm">
          <p className="text-xs uppercase tracking-widest text-taupe">User Revenue</p>
          <p className="font-serif text-2xl text-ink mt-2">{formatINR(totals.revenue)}</p>
        </div>
        <div className="bg-paper border border-taupe/10 p-5 rounded-sm">
          <p className="text-xs uppercase tracking-widest text-taupe">Blocked</p>
          <p className="font-serif text-2xl text-red-600 mt-2">{totals.blocked}</p>
        </div>
      </div>

      <div className="bg-paper border border-taupe/10 rounded-sm shadow-sm overflow-hidden">
        <div className="p-4 border-b border-taupe/10 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <label className="flex items-center gap-2 border border-taupe/20 px-3 py-2 rounded-sm md:w-80">
            <Search className="w-4 h-4 text-taupe" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users"
              className="w-full bg-transparent text-sm focus:outline-none"
            />
          </label>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border border-taupe/20 bg-transparent px-3 py-2 rounded-sm text-sm focus:outline-none"
          >
            <option value="All">All roles</option>
            <option value="User">Customers</option>
            <option value="Admin">Admins</option>
          </select>
        </div>

        {message && <div className="px-4 py-3 text-sm text-taupe border-b border-taupe/10">{message}</div>}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left border-collapse">
            <thead>
              <tr className="bg-cream/50 border-b border-taupe/20 text-xs uppercase tracking-widest text-taupe">
                <th className="p-4 font-medium">User</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Orders</th>
                <th className="p-4 font-medium">Total Spent</th>
                <th className="p-4 font-medium">Last Order</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-taupe/10">
              {users.map((item) => (
                <>
                  <tr key={item.id} onClick={() => toggleUserOrders(item.id)} className="hover:bg-cream/20 transition-colors cursor-pointer">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-cream/60 flex items-center justify-center">
                          {item.role === 'Admin' ? <ShieldCheck className="w-4 h-4" /> : <UserRound className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="font-medium text-ink flex items-center gap-2">
                            {item.username}
                            {expandedUserId === item.id ? <ChevronUp className="w-4 h-4 text-taupe" /> : <ChevronDown className="w-4 h-4 text-taupe" />}
                          </div>
                          <div className="text-xs text-taupe">{item.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-3 py-1 text-[10px] font-medium uppercase tracking-wider rounded-full ${
                        item.role === 'Admin' ? 'bg-ink text-paper' : 'bg-cream text-ink'
                      }`}>
                        {item.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-3 py-1 text-[10px] font-medium uppercase tracking-wider rounded-full ${
                        item.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {item.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-ink">{item.orderCount}</td>
                    <td className="p-4 text-sm text-ink">{formatINR(item.totalSpent)}</td>
                    <td className="p-4 text-sm text-taupe">
                      {item.lastOrderDate ? new Date(item.lastOrderDate).toLocaleDateString() : 'No orders'}
                    </td>
                    <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end items-center gap-2">
                      <select
                        value={item.role}
                        disabled={item.id === currentUser?.id}
                        onChange={(e) => updateRole(item.id, e.target.value)}
                        className="text-sm px-2 py-1 border border-taupe/30 rounded-sm focus:outline-none focus:border-ink bg-transparent disabled:opacity-50"
                      >
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                      </select>
                      <button
                        type="button"
                        disabled={item.id === currentUser?.id}
                        onClick={() => toggleBlock(item.id, !item.isBlocked)}
                        className={`px-3 py-1.5 rounded-sm text-xs uppercase tracking-wider disabled:opacity-50 ${
                          item.isBlocked
                            ? 'bg-green-50 text-green-700 hover:bg-green-100'
                            : 'bg-red-50 text-red-600 hover:bg-red-100'
                        }`}
                      >
                        {item.isBlocked ? 'Unblock' : 'Block'}
                      </button>
                      </div>
                    </td>
                  </tr>
                  {expandedUserId === item.id && (
                    <tr key={`${item.id}-orders`} className="bg-cream/20">
                      <td colSpan="7" className="p-4">
                        {ordersLoading && !userOrders[item.id] ? (
                          <div className="text-sm text-taupe">Loading order details...</div>
                        ) : !userOrders[item.id]?.length ? (
                          <div className="flex items-center gap-3 text-sm text-taupe">
                            <Package className="w-4 h-4" />
                            No orders for this user.
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {userOrders[item.id].map((order) => (
                              <div key={order.id} className="bg-paper border border-taupe/10 rounded-sm overflow-hidden">
                                <div className="p-4 border-b border-taupe/10 grid grid-cols-1 md:grid-cols-4 gap-3">
                                  <div>
                                    <p className="text-xs uppercase tracking-widest text-taupe">Order</p>
                                    <p className="font-medium text-ink">#{order.id}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs uppercase tracking-widest text-taupe">Date</p>
                                    <p className="font-medium text-ink">{new Date(order.orderDate).toLocaleDateString()}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs uppercase tracking-widest text-taupe">Status</p>
                                    <p className="font-medium text-ink">{order.status}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs uppercase tracking-widest text-taupe">Total</p>
                                    <p className="font-medium text-ink">{formatINR(order.totalAmount)}</p>
                                  </div>
                                </div>

                                <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-xs uppercase tracking-widest text-taupe mb-2">Items</p>
                                    <div className="space-y-3">
                                      {order.items.map((orderItem) => (
                                        <div key={orderItem.id} className="flex items-center gap-3">
                                          <div className="w-12 h-14 bg-cream/50 overflow-hidden rounded-sm">
                                            <img src={orderItem.product?.image || '/product.png'} alt={orderItem.product?.name} className="w-full h-full object-cover" />
                                          </div>
                                          <div className="min-w-0">
                                            <p className="text-sm font-medium text-ink">{orderItem.product?.name || orderItem.productId}</p>
                                            <p className="text-xs text-taupe">Qty {orderItem.quantity} x {formatINR(orderItem.price)}</p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  <div>
                                    <p className="text-xs uppercase tracking-widest text-taupe mb-2">Shipping</p>
                                    <div className="text-sm text-ink/80 leading-relaxed">
                                      <p className="font-medium text-ink">{order.fullName || 'N/A'}</p>
                                      <p>{getAddress(order) || 'N/A'}</p>
                                      {order.landmark && <p>Landmark: {order.landmark}</p>}
                                      <p>{order.phoneNumber}{order.alternatePhoneNumber ? ` / ${order.alternatePhoneNumber}` : ''}</p>
                                    </div>
                                    <div className="mt-4 text-sm text-taupe space-y-1">
                                      <div className="flex justify-between"><span>Subtotal</span><span>{formatINR(order.subtotal || 0)}</span></div>
                                      <div className="flex justify-between"><span>Discount</span><span>{formatINR(order.discountAmount || 0)}</span></div>
                                      <div className="flex justify-between"><span>Shipping</span><span>{formatINR(order.shippingFee || 0)}</span></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersList;
