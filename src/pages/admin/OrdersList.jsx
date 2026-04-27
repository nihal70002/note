import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Package } from 'lucide-react';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders =
  filterStatus === "All"
    ? orders
    : orders.filter(order => order.status === filterStatus);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5009/api/orders/all', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const statusPriority = {
  Pending: 1,
  Processing: 2,
  Shipped: 3,
  Delivered: 4
};

const sortedOrders = data.sort((a, b) => {
  if (statusPriority[a.status] !== statusPriority[b.status]) {
    return statusPriority[a.status] - statusPriority[b.status];
  }

  // If same status → newest first
  return new Date(b.orderDate) - new Date(a.orderDate);
});

setOrders(sortedOrders);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5009/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        fetchOrders(); // Refresh the list
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const printLabel = (order) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Shipping Label - Order #${order.id}</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; margin: 0; color: #1a1a1a; }
            .label { border: 2px solid #1a1a1a; padding: 40px; width: 450px; max-width: 100%; border-radius: 12px; margin: 0 auto; box-sizing: border-box; }
            h2 { margin-top: 0; text-transform: uppercase; letter-spacing: 2px; border-bottom: 2px solid #1a1a1a; padding-bottom: 10px; text-align: center; font-size: 24px; }
            .detail { margin-bottom: 16px; font-size: 16px; line-height: 1.5; }
            .strong { font-weight: 700; display: inline-block; width: 100px; text-transform: uppercase; font-size: 14px; letter-spacing: 1px; }
            .value { display: inline-block; vertical-align: top; max-width: 250px; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #666; }
            @media print {
              body { padding: 0; }
              .label { border: none; padding: 20px; width: 100%; max-width: 4in; height: 6in; margin: 0; }
            }
          </style>
        </head>
        <body>
          <div class="label">
            <h2>Shipping Label</h2>
            <div class="detail"><span class="strong">Order #:</span> <span class="value">${order.id}</span></div>
            <div class="detail"><span class="strong">Date:</span> <span class="value">${new Date(order.orderDate).toLocaleDateString()}</span></div>
            <hr style="margin: 24px 0; border: 0; border-top: 1px solid #ccc;" />
            <div class="detail"><span class="strong">Ship To:</span> <span class="value" style="font-weight: 600; font-size: 18px;">${order.fullName || 'N/A'}</span></div>
            <div class="detail"><span class="strong">Phone:</span> <span class="value">${order.phoneNumber || 'N/A'}</span></div>
            <div class="detail"><span class="strong">Address:</span> <span class="value">${order.deliveryAddress || 'N/A'}</span></div>
            <div class="detail"><span class="strong">Landmark:</span> <span class="value">${order.landmark || 'N/A'}</span></div>
            <div class="detail"><span class="strong">Pincode:</span> <span class="value" style="font-size: 18px; font-weight: 600; letter-spacing: 1px;">${order.pincode || 'N/A'}</span></div>
            <div class="footer">Aesthetic Store Delivery</div>
          </div>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (loading) {
    return <div className="text-taupe p-8">Loading orders...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6 sm:mb-8">
        <h1 className="font-serif text-2xl sm:text-3xl text-ink">Manage Orders</h1>
      </div>



      <div className="flex gap-2 sm:gap-3 mb-4 overflow-x-auto pb-2">
  {["All", "Pending", "Processing", "Shipped", "Delivered"].map(status => (
    <button
      key={status}
      onClick={() => setFilterStatus(status)}
      className={`px-3 py-1 rounded text-sm ${
        filterStatus === status
          ? "bg-ink text-white"
          : "bg-gray-200"
      }`}
    >
      {status}
    </button>
  ))}
</div>

      <div className="bg-paper rounded-sm shadow-sm border border-taupe/10 overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-8 text-center text-taupe">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No orders have been placed yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left border-collapse">
              <thead>
                <tr className="bg-cream/50 border-b border-taupe/20 text-xs uppercase tracking-widest text-taupe">
                  <th className="p-4 font-medium">Order ID</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Shipping Details</th>
                  <th className="p-4 font-medium">Total</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-taupe/10">
                {filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-cream/20 transition-colors">
                    <td className="p-4 text-sm font-medium text-ink">#{order.id}</td>
                    <td className="p-4 text-sm text-ink">{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td className="p-4 text-sm text-taupe max-w-[250px]">
                      {order.fullName ? (
                        <>
                          <div className="font-medium text-ink">{order.fullName}</div>
                          <div className="text-xs truncate">{order.deliveryAddress}</div>
                          <div className="text-xs">{order.pincode} • {order.phoneNumber}</div>
                        </>
                      ) : (
                        <span className="italic text-taupe/50">No details</span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-ink">${order.totalAmount.toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`inline-block px-3 py-1 text-[10px] font-medium uppercase tracking-wider rounded-full ${
                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Shipped' ? 'bg-indigo-100 text-indigo-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <select 
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="text-sm px-2 py-1 border border-taupe/30 rounded-sm focus:outline-none focus:border-ink bg-transparent"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                        <button 
                          onClick={() => printLabel(order)}
                          className="text-xs px-3 py-1.5 bg-ink text-paper rounded-sm hover:bg-ink/80 transition-colors uppercase tracking-wider"
                        >
                          Print Label
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersList;
