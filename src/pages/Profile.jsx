import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Package, Settings, Key } from 'lucide-react';
import axiosInstance from '../api/axios';

const Profile = () => {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });
  const formatINR = (value) => `₹${Number(value || 0).toFixed(2)}`;

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: '', text: '' });

    try {
      await axiosInstance.post('/auth/change-password', { currentPassword, newPassword });
      setPasswordMsg({ type: 'success', text: 'Password changed successfully.' });
      setCurrentPassword('');
      setNewPassword('');
    } catch (error) {
      setPasswordMsg({ type: 'error', text: error.response?.data?.message || 'Failed to change password.' });
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      await axiosInstance.put(`/orders/${orderId}/cancel`);
      fetchOrders();
    } catch (error) {
      console.error('Failed to cancel order:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto py-10 sm:py-12 px-4 sm:px-6">
      <div className="flex items-center gap-4 mb-8 min-w-0">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-ink text-paper rounded-full flex items-center justify-center font-serif text-2xl flex-shrink-0">
          {(user.username || user.email || 'U').charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="font-serif text-3xl text-ink">My Profile</h1>
          <p className="text-taupe break-all">{user.email}</p>
        </div>
      </div>

      <div className="bg-paper rounded-sm shadow-sm border border-taupe/10 overflow-hidden flex flex-col md:flex-row min-h-[500px]">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 bg-cream/30 md:border-r border-b md:border-b-0 border-taupe/10 flex md:flex-col overflow-x-auto">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-3 px-5 sm:px-6 py-4 text-sm uppercase tracking-wider font-medium transition-colors border-l-4 whitespace-nowrap ${activeTab === 'orders' ? 'border-ink bg-paper text-ink' : 'border-transparent text-taupe hover:bg-paper hover:text-ink'}`}
          >
            <Package className="w-4 h-4" /> My Orders
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-3 px-5 sm:px-6 py-4 text-sm uppercase tracking-wider font-medium transition-colors border-l-4 whitespace-nowrap ${activeTab === 'settings' ? 'border-ink bg-paper text-ink' : 'border-transparent text-taupe hover:bg-paper hover:text-ink'}`}
          >
            <Settings className="w-4 h-4" /> Settings
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-5 sm:p-8 min-w-0">
          {activeTab === 'orders' && (
            <div>
              <h2 className="font-serif text-2xl text-ink mb-6">Order History</h2>
              {loadingOrders ? (
                <p className="text-taupe">Loading orders...</p>
              ) : orders.length === 0 ? (
                <div className="text-center py-12 bg-cream/30 rounded-sm">
                  <p className="text-taupe mb-4">You haven't placed any orders yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map(order => (
                    <div key={order.id} className="border border-taupe/20 rounded-sm overflow-hidden">
                      <div className="bg-cream/50 px-4 sm:px-6 py-4 grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-taupe/20">
                        <div>
                          <p className="text-sm text-taupe uppercase tracking-wider mb-1">Order Placed</p>
                          <p className="font-medium text-ink">{new Date(order.orderDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-taupe uppercase tracking-wider mb-1">Total</p>
                          <p className="font-medium text-ink">{formatINR(order.totalAmount)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-taupe uppercase tracking-wider mb-1">Status</p>
                          <span className={`inline-block px-3 py-1 text-xs font-medium uppercase tracking-wider rounded-full ${
                            order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'Shipped' ? 'bg-indigo-100 text-indigo-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        {order.status === 'Pending' && (
                          <button
                            onClick={() => cancelOrder(order.id)}
                            className="text-xs uppercase tracking-widest text-red-600 border border-red-200 px-3 py-2 hover:bg-red-50"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                      <div className="p-6">
                        <ul className="space-y-4">
                          {order.items.map(item => (
                            <li key={item.id} className="flex items-center gap-4">
                              <div className="w-16 h-20 bg-cream/50 rounded-sm overflow-hidden">
                                <img src={item.product?.image || "/product.png"} alt={item.product?.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-ink">{item.product?.name}</h4>
                                <p className="text-sm text-taupe">Qty: {item.quantity} × {formatINR(item.price)}</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-md">
              <h2 className="font-serif text-2xl text-ink mb-6">Change Password</h2>
              
              {passwordMsg.text && (
                <div className={`p-4 mb-6 rounded-sm text-sm ${passwordMsg.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                  {passwordMsg.text}
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-ink uppercase tracking-wider mb-2">Current Password</label>
                  <input 
                    type="password" 
                    required 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-taupe/30 rounded-sm focus:outline-none focus:border-ink bg-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink uppercase tracking-wider mb-2">New Password</label>
                  <input 
                    type="password" 
                    required 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-taupe/30 rounded-sm focus:outline-none focus:border-ink bg-transparent"
                  />
                </div>
                <button type="submit" className="btn-primary w-full py-3 flex justify-center items-center gap-2">
                  <Key className="w-4 h-4" /> Update Password
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
