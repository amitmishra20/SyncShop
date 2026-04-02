import { useEffect, useMemo, useState } from 'react';
import api from '../../services/api';
import {
  AlertTriangle,
  Boxes,
  IndianRupee,
  ShoppingCart,
  TrendingUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from 'recharts';

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [ordersRes, inventoryRes, productsRes] = await Promise.all([
        api.get('/orders'),
        api.get('/inventory'),
        api.get('/products'),
      ]);

      setOrders(ordersRes.data || []);
      setInventory(inventoryRes.data || []);
      setProducts(productsRes.data || []);
    } catch {
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const revenue = useMemo(() => {
    return orders.reduce(
      (sum, order) => sum + Number(order.totalAmount || 0),
      0
    );
  }, [orders]);

  const lowStockItems = useMemo(() => {
    return inventory.filter(
      (item) =>
        Number(item.currentStock || 0) <= Number(item.reorderLevel || 0)
    );
  }, [inventory]);

  const categoryData = useMemo(() => {
    const map = {};

    products.forEach((product) => {
      const category = product.category || 'Other';
      map[category] = (map[category] || 0) + 1;
    });

    return Object.entries(map).map(([name, value]) => ({
      name,
      value,
    }));
  }, [products]);

  const stockChartData = useMemo(() => {
    return inventory.slice(0, 8).map((item) => ({
      name: item.productName?.slice(0, 12) || 'Product',
      stock: Number(item.currentStock || 0),
      reorder: Number(item.reorderLevel || 0),
    }));
  }, [inventory]);

  const orderStatusData = useMemo(() => {
    const map = {};

    orders.forEach((order) => {
      const status = order.status || 'UNKNOWN';
      map[status] = (map[status] || 0) + 1;
    });

    return Object.entries(map).map(([name, value]) => ({
      name,
      value,
    }));
  }, [orders]);

  const topProducts = useMemo(() => {
    const salesMap = {};

    orders.forEach((order) => {
      (order.items || []).forEach((item) => {
        const name = item.productName || 'Unknown';
        salesMap[name] = (salesMap[name] || 0) + Number(item.quantity || 0);
      });
    });

    return Object.entries(salesMap)
      .map(([name, sold]) => ({
        name: name.slice(0, 16),
        sold,
      }))
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 8);
  }, [orders]);

  const insightCards = useMemo(() => {
    const totalOrders = orders.length;
    const lowStockCount = lowStockItems.length;
    const topCategory =
      categoryData.length > 0
        ? [...categoryData].sort((a, b) => b.value - a.value)[0].name
        : 'N/A';

    return [
      {
        title: 'Most active category',
        value: topCategory,
        icon: <TrendingUp size={18} />,
      },
      {
        title: 'Low stock alerts',
        value: `${lowStockCount} products`,
        icon: <AlertTriangle size={18} />,
      },
      {
        title: 'Order volume',
        value: `${totalOrders} total orders`,
        icon: <ShoppingCart size={18} />,
      },
    ];
  }, [orders, lowStockItems, categoryData]);

  if (loading) return <div className="empty-dark">Loading dashboard...</div>;
  if (error) return <div className="error-dark">{error}</div>;

  return (
    <div className="admin-dashboard-dark">
      <div className="admin-dashboard-head">
        <div>
          <h2>Dashboard</h2>
          <p>Track stock, orders, revenue, and product movement from one place.</p>
        </div>
      </div>

      <div className="kpi-grid-dark">
        <div className="kpi-card-dark">
          <div className="kpi-icon">
            <Boxes size={20} />
          </div>
          <div>
            <span>Total Products</span>
            <strong>{products.length}</strong>
          </div>
        </div>

        <div className="kpi-card-dark">
          <div className="kpi-icon">
            <ShoppingCart size={20} />
          </div>
          <div>
            <span>Total Orders</span>
            <strong>{orders.length}</strong>
          </div>
        </div>

        <div className="kpi-card-dark">
          <div className="kpi-icon">
            <IndianRupee size={20} />
          </div>
          <div>
            <span>Total Revenue</span>
            <strong>₹{revenue.toFixed(2)}</strong>
          </div>
        </div>

        <div className="kpi-card-dark">
          <div className="kpi-icon">
            <AlertTriangle size={20} />
          </div>
          <div>
            <span>Low Stock Items</span>
            <strong>{lowStockItems.length}</strong>
          </div>
        </div>
      </div>

      <div className="insight-grid-dark">
        {insightCards.map((card) => (
          <div key={card.title} className="insight-card-dark">
            <div className="insight-icon">{card.icon}</div>
            <div>
              <h4>{card.title}</h4>
              <p>{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-chart-grid">
        <div className="admin-card-dark">
          <h3>Stock vs reorder level</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stockChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Legend />
              <Bar dataKey="stock" fill="#2563eb" />
              <Bar dataKey="reorder" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="admin-card-dark">
          <h3>Category distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" outerRadius={90}>
                {categoryData.map((entry, index) => {
                  const colors = [
                    '#2563eb',
                    '#14b8a6',
                    '#f59e0b',
                    '#8b5cf6',
                    '#ef4444',
                    '#22c55e',
                  ];
                  return <Cell key={entry.name} fill={colors[index % colors.length]} />;
                })}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="admin-card-dark">
          <h3>Top sold products</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="sold"
                stroke="#22c55e"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="admin-card-dark">
          <h3>Order status distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={orderStatusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="value" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="admin-card-dark">
        <h3>Low stock alerts</h3>
        {lowStockItems.length === 0 ? (
          <div className="empty-dark">No low stock alerts right now.</div>
        ) : (
          <div className="admin-table-dark">
            {lowStockItems.map((item) => (
              <div key={item.id} className="admin-table-row-dark">
                <span>{item.productName}</span>
                <span>Stock: {item.currentStock}</span>
                <span>Reorder level: {item.reorderLevel}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}