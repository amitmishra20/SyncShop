import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';

export default function CartDrawer() {
  const {
    isCartOpen,
    toggleCart,
    cartItems,
    cartTotal,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const { user } = useAuth();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    toggleCart();

    if (!user) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }

    navigate('/checkout');
  };

  return (
    <>
      <div
        onClick={toggleCart}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.48)',
          backdropFilter: 'blur(4px)',
          zIndex: 1200,
        }}
      />

      <aside
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          maxWidth: '430px',
          background: '#ffffff',
          zIndex: 1201,
          boxShadow: '0 24px 60px rgba(15, 23, 42, 0.20)',
          display: 'flex',
          flexDirection: 'column',
          borderLeft: '1px solid var(--border-color)',
          animation: 'slideInRight 0.26s ease-out',
        }}
      >
        <div
          style={{
            padding: '22px 22px 18px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            background:
              'linear-gradient(180deg, rgba(219,234,254,0.45) 0%, rgba(255,255,255,1) 80%)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'start',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 12px',
                  borderRadius: '999px',
                  background: 'white',
                  border: '1px solid var(--border-color)',
                  color: 'var(--brand-primary)',
                  fontWeight: 700,
                  fontSize: '12px',
                  marginBottom: '12px',
                }}
              >
                <Sparkles size={14} />
                Smart cart
              </div>

              <h3
                style={{
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '24px',
                }}
              >
                <ShoppingBag size={22} />
                Your Cart
              </h3>

              <p
                style={{
                  marginTop: '6px',
                  color: 'var(--text-secondary)',
                  fontSize: '14px',
                }}
              >
                Review products before moving to checkout.
              </p>
            </div>

            <button
              onClick={toggleCart}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'white',
                border: '1px solid var(--border-color)',
                display: 'grid',
                placeItems: 'center',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <X size={18} />
            </button>
          </div>

          {cartItems.length > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'white',
                border: '1px solid var(--border-color)',
                borderRadius: '18px',
                padding: '12px 14px',
              }}
            >
              <div>
                <div style={{ fontWeight: 700 }}>{itemCount} items in basket</div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Ready for your next step
                </div>
              </div>

              <div
                style={{
                  fontSize: '20px',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                }}
              >
                ₹{cartTotal.toFixed(2)}
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            background: '#fcfdff',
          }}
        >
          {cartItems.length === 0 ? (
            <div
              style={{
                margin: 'auto 0',
                background: 'white',
                border: '1px solid var(--border-color)',
                borderRadius: '24px',
                padding: '28px',
                textAlign: 'center',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '24px',
                  margin: '0 auto 16px',
                  background: 'var(--brand-soft)',
                  color: 'var(--brand-primary)',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <ShoppingBag size={30} />
              </div>

              <h4 style={{ marginBottom: '8px' }}>Your cart is empty</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                Add products from the storefront to begin your order.
              </p>

              <button
                className="btn-primary"
                style={{ marginTop: '18px' }}
                onClick={toggleCart}
              >
                Continue shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.product.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '88px 1fr',
                  gap: '14px',
                  padding: '14px',
                  background: 'white',
                  border: '1px solid var(--border-color)',
                  borderRadius: '22px',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div
                  style={{
                    width: '88px',
                    height: '88px',
                    borderRadius: '18px',
                    overflow: 'hidden',
                    background: 'linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)',
                    display: 'grid',
                    placeItems: 'center',
                    color: '#94a3b8',
                    fontWeight: 800,
                    fontSize: '22px',
                  }}
                >
                  {item.product.imageUrl ? (
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    item.product.name?.substring(0, 2).toUpperCase()
                  )}
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    minWidth: 0,
                  }}
                >
                  <div>
                    <h4
                      style={{
                        fontSize: '15px',
                        lineHeight: 1.3,
                        marginBottom: '4px',
                      }}
                    >
                      {item.product.name}
                    </h4>
                    <p
                      style={{
                        fontSize: '13px',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {item.product.description || item.product.unitDescription || 'Standard unit'}
                    </p>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 800,
                        fontSize: '18px',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      ₹{Number(item.product.price).toFixed(2)}
                    </span>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: 'var(--danger)',
                        fontSize: '13px',
                        fontWeight: 700,
                      }}
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>
                  </div>

                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      width: 'fit-content',
                      gap: '10px',
                      padding: '6px',
                      borderRadius: '999px',
                      background: 'var(--brand-primary)',
                      color: 'white',
                    }}
                  >
                    <button
                      onClick={() => updateQuantity(item.product.id, -1)}
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        display: 'grid',
                        placeItems: 'center',
                        color: 'white',
                      }}
                    >
                      <Minus size={15} />
                    </button>

                    <span style={{ minWidth: '18px', textAlign: 'center', fontWeight: 700 }}>
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => updateQuantity(item.product.id, 1)}
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        display: 'grid',
                        placeItems: 'center',
                        color: 'white',
                      }}
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div
            style={{
              borderTop: '1px solid var(--border-color)',
              padding: '20px',
              background: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid var(--border-color)',
                borderRadius: '18px',
                padding: '14px 16px',
                display: 'grid',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                <span style={{ fontWeight: 700 }}>₹{cartTotal.toFixed(2)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Delivery</span>
                <span style={{ fontWeight: 700, color: 'var(--success)' }}>FREE</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '10px',
                  borderTop: '1px solid var(--border-color)',
                  fontSize: '15px',
                }}
              >
                <span style={{ fontWeight: 700 }}>Total</span>
                <span style={{ fontWeight: 800, fontSize: '18px' }}>
                  ₹{cartTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'space-between',
                padding: '16px 18px',
                borderRadius: '18px',
              }}
              onClick={handleCheckout}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '12px', opacity: 0.88 }}>
                  {itemCount} items selected
                </span>
                <span style={{ fontSize: '16px', fontWeight: 800 }}>
                  Continue to checkout
                </span>
              </div>

              <ArrowRight size={20} />
            </button>
          </div>
        )}
      </aside>
    </>
  );
}