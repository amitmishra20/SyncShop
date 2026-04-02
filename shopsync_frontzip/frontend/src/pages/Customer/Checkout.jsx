import { useMemo, useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const orderItems = useMemo(
    () =>
      cartItems.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
    [cartItems]
  );

  const getErrorMessage = (err) => {
    const data = err?.response?.data;

    if (typeof data === 'string') return data;
    if (typeof data?.message === 'string') return data.message;
    if (typeof data?.error === 'string') return data.error;

    if (data && typeof data === 'object') {
      return Object.entries(data)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
    }

    return err?.message || 'Failed to place order.';
  };

  const handlePlaceOrder = async () => {
    setError('');
    setMessage('');

    if (!deliveryAddress.trim()) {
      setError('Please enter your delivery address.');
      return;
    }

    if (cartItems.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    try {
      setPlacingOrder(true);

      const orderPayload = {
        deliveryAddress,
        items: orderItems,
      };

      const orderResponse = await api.post('/orders', orderPayload);
      const order = orderResponse.data;

      if (paymentMethod === 'COD') {
        clearCart();
        setMessage('Order placed successfully with Cash on Delivery.');
        setTimeout(() => navigate('/'), 1200);
        return;
      }

      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

      if (!razorpayKey) {
        setError(
          'Online payment is currently unavailable. Please use Cash on Delivery for now.'
        );
        return;
      }

      if (!window.Razorpay) {
        setError(
          'Payment gateway could not be loaded. Disable ad blocker for this site or try again.'
        );
        return;
      }

      const paymentRes = await api.post('/payments/create-order', {
        orderId: order.id,
      });

      const razorpayOrder = paymentRes.data;

      const options = {
        key: razorpayKey,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency || 'INR',
        name: 'ShopSync',
        description: 'Order Payment',
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            await api.post('/payments/verify', {
              orderId: order.id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            clearCart();
            setMessage('Payment successful and order confirmed.');
            setTimeout(() => navigate('/'), 1200);
          } catch (err) {
            setError(getErrorMessage(err) || 'Payment verification failed.');
          }
        },
        modal: {
          ondismiss: function () {
            setError('Payment was cancelled.');
          },
        },
        theme: {
          color: '#2563eb',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="checkout-dark">
      <div className="section-head-dark">
        <h2>Checkout</h2>
        <p>Complete your order in a simple and clean flow.</p>
      </div>

      {error && <div className="error-dark">{String(error)}</div>}
      {message && <div className="success-dark">{message}</div>}

      <div className="checkout-grid-dark">
        <div className="checkout-card-dark">
          <h3>Delivery details</h3>

          <label>Full address</label>
          <textarea
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            placeholder="Enter your complete delivery address"
            rows={6}
          />

          <label>Payment method</label>
          <div className="payment-options-dark">
            <button
              className={paymentMethod === 'COD' ? 'active' : ''}
              onClick={() => setPaymentMethod('COD')}
              type="button"
            >
              Cash on Delivery
            </button>

            <button
              className={paymentMethod === 'ONLINE' ? 'active' : ''}
              onClick={() => setPaymentMethod('ONLINE')}
              type="button"
            >
              Online Payment
            </button>
          </div>

          {paymentMethod === 'ONLINE' && (
            <p className="checkout-note-dark">
              Online payments require Razorpay configuration.
            </p>
          )}
        </div>

        <div className="checkout-card-dark">
          <h3>Order summary</h3>

          <div className="checkout-items-dark">
            {cartItems.map((item) => (
              <div key={item.product.id} className="checkout-item-dark">
                <span>
                  {item.quantity} x {item.product.name}
                </span>
                <strong>
                  ₹{(Number(item.product.price) * item.quantity).toFixed(2)}
                </strong>
              </div>
            ))}
          </div>

          <div className="checkout-total-dark">
            <span>Total</span>
            <strong>₹{cartTotal.toFixed(2)}</strong>
          </div>

          <button
            className="checkout-btn-dark"
            onClick={handlePlaceOrder}
            disabled={placingOrder}
          >
            {placingOrder ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
}