import { useEffect, useState } from 'react';
import api from '../../services/api';

const statuses = ['PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/orders');
      setOrders(response.data || []);
    } catch {
      setError('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    if (!orderId) {
      setError('Order ID is missing, so status cannot be updated.');
      return;
    }

    try {
      setError('');
      await api.put(`/orders/${orderId}/status`, null, {
        params: { status },
      });
      fetchOrders();
    } catch {
      setError('Failed to update order status.');
    }
  };

  if (loading) return <div className="empty-dark">Loading orders...</div>;
  if (error) return <div className="error-dark">{error}</div>;

  return (
    <div className="admin-card-dark">
      <h3>Order Management</h3>

      <div className="admin-table-dark">
        {orders.map((order) => (
          <div key={order.id || Math.random()} className="admin-table-row-dark orders-row-dark">
            <div>
              <strong>Order #{order.id ?? 'N/A'}</strong>
              <p style={{ color: '#94a3b8', marginTop: 4 }}>
                {order.userName || 'Unknown Customer'}
              </p>
              <p style={{ color: '#94a3b8', marginTop: 4 }}>
                {order.deliveryAddress || 'No address'}
              </p>
            </div>

            <div>
              <strong>₹{Number(order.totalAmount || 0).toFixed(2)}</strong>
              <p style={{ color: '#94a3b8', marginTop: 4 }}>
                {order.status || 'UNKNOWN'}
              </p>
              <p style={{ color: '#94a3b8', marginTop: 4 }}>
                {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}
              </p>
            </div>

            <div>
              <select
                value={order.status || 'PLACED'}
                onChange={(e) => updateStatus(order.id, e.target.value)}
                className="admin-select-dark"
                disabled={!order.id}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              <div style={{ marginTop: 10, color: '#94a3b8', fontSize: 13 }}>
                {(order.items || []).map((item) => (
                  <div key={item.id}>
                    {item.quantity} x {item.productName}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}