import { useEffect, useMemo, useState } from 'react';
import api from '../../services/api';
import { useCart } from '../../contexts/CartContext';
import { Minus, Plus, Search } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { addToCart, updateQuantity, cartItems } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      setProducts(response.data || []);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError('Unable to load products right now.');
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    const values = products.map((p) => p.category).filter(Boolean);
    return ['All', ...new Set(values)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const q = query.trim().toLowerCase();

      const matchSearch =
        !q ||
        product.name?.toLowerCase().includes(q) ||
        product.description?.toLowerCase().includes(q) ||
        product.category?.toLowerCase().includes(q);

      const matchCategory =
        activeCategory === 'All' || product.category === activeCategory;

      return matchSearch && matchCategory;
    });
  }, [products, query, activeCategory]);

  const getQuantity = (productId) => {
    const item = cartItems.find((i) => i.product.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="home-dark">
      <section className="hero-dark">
        <div className="hero-dark__left">
          <span className="hero-dark__badge">Fresh groceries in minutes</span>
          <h1 className="hero-dark__title">Everything you need, delivered fast.</h1>
          <p className="hero-dark__text">
            Groceries, dairy, snacks, and daily essentials — all in one simple, clean experience.
          </p>

          <div className="hero-dark__search">
            <Search size={18} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search milk, atta, noodles..."
            />
          </div>
        </div>

        <div className="hero-dark__right">
          <div className="hero-card-dark">
            <h3>Fresh picks</h3>
            <p>Daily groceries, staples, and more.</p>
          </div>
          <div className="hero-card-dark">
            <h3>Quick orders</h3>
            <p>Add, update, and checkout with less friction.</p>
          </div>
          <div className="hero-card-dark">
            <h3>Simple experience</h3>
            <p>Clean shopping flow without extra clutter.</p>
          </div>
        </div>
      </section>

      <section className="category-section-dark">
        <div className="section-head-dark">
          <h2>Shop by category</h2>
          <p>Pick what you need without digging through everything.</p>
        </div>

        <div className="category-strip-dark">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-pill-dark ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="products-section-dark">
        <div className="section-head-dark">
          <h2>Products</h2>
          <p>{filteredProducts.length} items available</p>
        </div>

        {loading ? (
          <div className="empty-dark">Loading products...</div>
        ) : error ? (
          <div className="error-dark">{error}</div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-dark">No products matched your search.</div>
        ) : (
          <div className="product-grid-dark">
            {filteredProducts.map((product) => {
              const qty = getQuantity(product.id);

              return (
                <div key={product.id} className="product-card-dark">
                  <div className="product-media-dark">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} />
                    ) : (
                      <span>{product.name?.charAt(0)?.toUpperCase()}</span>
                    )}
                  </div>

                  <span className="product-category-dark">
                    {product.category || 'General'}
                  </span>

                  <h3>{product.name}</h3>
                  <p>{product.description || 'Fresh quality product'}</p>

                  <div className="product-footer-dark">
                    <strong>₹{Number(product.price).toFixed(2)}</strong>

                    {qty === 0 ? (
                      <button
                        className="add-btn-dark"
                        onClick={() => addToCart(product)}
                      >
                        Add
                      </button>
                    ) : (
                      <div className="qty-box-dark">
                        <button onClick={() => updateQuantity(product.id, -1)}>
                          <Minus size={14} />
                        </button>
                        <span>{qty}</span>
                        <button onClick={() => updateQuantity(product.id, 1)}>
                          <Plus size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}