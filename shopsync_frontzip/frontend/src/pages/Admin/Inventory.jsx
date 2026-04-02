import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await api.get('/inventory');
      setInventory(response.data || []);
    } catch {
      setError('Failed to load inventory.');
    } finally {
      setLoading(false);
    }
  };

  const adjustStock = async (productId, adjustBy) => {
    try {
      await api.put(`/inventory/product/${productId}/stock?adjustBy=${adjustBy}`);
      fetchInventory();
    } catch {
      setError('Failed to update stock.');
    }
  };

  if (loading) return <div className="empty-dark">Loading inventory...</div>;
  if (error) return <div className="error-dark">{error}</div>;

  return (
    <div className="admin-card-dark">
      <h3>Inventory Management</h3>

      <div className="admin-table-dark">
        {inventory.map((item) => {
          const low = Number(item.currentStock) <= Number(item.reorderLevel);

          return (
            <div key={item.id} className="admin-table-row-dark inventory-row-dark">
              <div>
                <strong>{item.productName}</strong>
                <p style={{ color: '#94a3b8', marginTop: 4 }}>
                  {item.category || 'General'}
                </p>
              </div>

              <div>
                <span style={{ color: low ? '#fca5a5' : '#86efac' }}>
                  Stock: {item.currentStock}
                </span>
                <p style={{ color: '#94a3b8', marginTop: 4 }}>
                  Reorder: {item.reorderLevel}
                </p>
              </div>

              <div className="stock-actions-dark">
                <button onClick={() => adjustStock(item.productId, -1)}>-1</button>
                <button onClick={() => adjustStock(item.productId, 1)}>+1</button>
                <button onClick={() => adjustStock(item.productId, 5)}>+5</button>
                <button onClick={() => adjustStock(item.productId, 10)}>+10</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}