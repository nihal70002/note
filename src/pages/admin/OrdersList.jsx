import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Package } from 'lucide-react';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const [filterStatus, setFilterStatus] = useState(searchParams.get('status') || "All");

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
            * { box-sizing: border-box; }
            body {
              margin: 0;
              padding: 24px;
              color: #111;
              background: #fff;
              font-family: Arial, Helvetica, sans-serif;
            }
            .label {
              width: 4in;
              min-height: 5.7in;
              margin: 0 auto;
              padding: 18px;
              border: 2px solid #111;
              border-radius: 10px;
            }
            .topbar {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              gap: 12px;
              padding-bottom: 12px;
              border-bottom: 2px solid #111;
            }
            .brand {
              font-size: 17px;
              font-weight: 800;
              letter-spacing: 1.5px;
              text-transform: uppercase;
            }
            .tag {
              margin-top: 4px;
              font-size: 8px;
              letter-spacing: 1.2px;
              text-transform: uppercase;
              color: #666;
            }
            .order-chip {
              border: 1px solid #111;
              border-radius: 999px;
              padding: 6px 10px;
              font-size: 10px;
              font-weight: 700;
              white-space: nowrap;
            }
            .meta {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 8px;
              margin: 14px 0;
            }
            .meta-card,
            .ship-card {
              border: 1px solid #cfcfcf;
              border-radius: 8px;
              padding: 10px;
            }
            .label-text {
              display: block;
              margin-bottom: 4px;
              font-size: 8px;
              font-weight: 800;
              letter-spacing: 1px;
              text-transform: uppercase;
              color: #555;
            }
            .meta-value {
              font-size: 12px;
              font-weight: 700;
            }
            .ship-card {
              border: 2px solid #111;
              background: #fafafa;
            }
            .name {
              margin: 0 0 8px;
              font-size: 20px;
              line-height: 1.15;
              font-weight: 800;
              text-transform: uppercase;
            }
            .address {
              margin: 0;
              font-size: 14px;
              line-height: 1.45;
              font-weight: 600;
            }
            .grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 8px;
              margin-top: 10px;
            }
            .pincode {
              border: 2px solid #111;
              border-radius: 8px;
              padding: 10px;
              text-align: center;
            }
            .pincode strong {
              display: block;
              font-size: 20px;
              letter-spacing: 1px;
            }
            .barcode {
              margin-top: 14px;
              height: 52px;
              border: 1px solid #111;
              border-radius: 6px;
              background: repeating-linear-gradient(
                90deg,
                #111 0 2px,
                #fff 2px 5px,
                #111 5px 6px,
                #fff 6px 10px
              );
            }
            .footer {
              display: flex;
              justify-content: space-between;
              align-items: center;
              gap: 10px;
              margin-top: 12px;
              padding-top: 10px;
              border-top: 1px dashed #999;
              font-size: 9px;
              letter-spacing: 1px;
              text-transform: uppercase;
              color: #555;
            }
            @media print {
              @page { size: 4in 6in; margin: 0.12in; }
              body { padding: 0; }
              .label { width: 100%; min-height: auto; margin: 0; }
            }
          </style>
        </head>
        <body>
          <div class="label">
            <div class="topbar">
              <div>
                <div class="brand">PAPERCUES</div>
                <div class="tag">Premium stationery delivery</div>
              </div>
              <div class="order-chip">Order #${order.id}</div>
            </div>

            <div class="meta">
              <div class="meta-card">
                <span class="label-text">Order Date</span>
                <div class="meta-value">${new Date(order.orderDate).toLocaleDateString()}</div>
              </div>
              <div class="meta-card">
                <span class="label-text">Service</span>
                <div class="meta-value">Standard</div>
              </div>
            </div>

            <div class="ship-card">
              <span class="label-text">Ship To</span>
              <h2 class="name">${order.fullName || 'N/A'}</h2>
              <p class="address">${getAddress(order) || 'N/A'}</p>
              ${order.landmark ? `<p class="address">Landmark: ${order.landmark}</p>` : ''}
              <div class="grid">
                <div>
                  <span class="label-text">Phone</span>
                  <div class="meta-value">${order.phoneNumber || 'N/A'}</div>
                </div>
                <div class="pincode">
                  <span class="label-text">Pincode</span>
                  <strong>${order.pincode || 'N/A'}</strong>
                </div>
              </div>
            </div>

            <div class="barcode"></div>
            <div class="footer">
              <span>Handle with care</span>
              <span>Papercues Dispatch</span>
            </div>
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
                          <div className="text-xs truncate">{getAddress(order)}</div>
                          <div className="text-xs">{order.phoneNumber}{order.alternatePhoneNumber ? ` / ${order.alternatePhoneNumber}` : ''}</div>
                        </>
                      ) : (
                        <span className="italic text-taupe/50">No details</span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-ink">{formatINR(order.totalAmount)}</td>
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
