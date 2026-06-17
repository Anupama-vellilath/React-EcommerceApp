import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

// Use your actual Stripe publishable key string here
const stripePromise = loadStripe('pk_test_xxxxxxxxxxxx');

function CheckoutForm({ cartItems, totalPrice, clearCartUI }) {
  const stripe = useStripe();
  const elements = useElements();
  const [status, setStatus] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePay = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setStatus('Processing your payment securely...');

    try {
      // 1. Format items for your backend endpoint
      const items = cartItems.map(item => ({
        product: item.product._id,
        qty: item.quantity,
        price: item.product.price
      }));

      // 2. Request Payment Intent from backend
      const { data } = await api.post(
        '/orders/payment-intent', 
        { items },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      // 3. Confirm card payment with Stripe
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (result.error) {
        setStatus(`Payment Error: ${result.error.message}`);
        setIsProcessing(false);
      } else {
        // 4. Save order to backend database on success
        await api.post(
          '/orders', 
          {
            items,
            total: data.total,
            stripePaymentId: result.paymentIntent.id,
          },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );

        // Optional: clear the user's cart in backend here if you have a delete route
        try {
          await api.delete('/cart', { headers: { Authorization: `Bearer ${user.token}` } });
        } catch (err) {
          console.error("Cart cleanup failed:", err);
        }

        setStatus('Payment successful! Redirecting...');
        setTimeout(() => {
          navigate('/products');
        }, 3000);
      }
    } catch (err) {
      console.error(err);
      setStatus('An error occurred during verification.');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handlePay} style={styles.form}>
      <h2 style={styles.sectionTitle}>Select a payment method</h2>
      
      <div style={styles.cardInputWrapper}>
        <div style={styles.cardHeader}>Credit or Debit Card</div>
        <div style={styles.stripeContainer}>
          <CardElement options={stripeElementOptions} />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={!stripe || isProcessing || cartItems.length === 0} 
        style={isProcessing ? styles.payBtnDisabled : styles.payBtn}
      >
        {isProcessing ? 'Processing...' : `Use this payment method`}
      </button>
      
      {status && (
        <p style={{
          ...styles.statusText, 
          color: status.includes('successful') ? '#007600' : '#b12704'
        }}>
          {status}
        </p>
      )}
    </form>
  );
}

export default function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Load the current cart items directly from backend database
  useEffect(() => {
    const fetchCartItems = async () => {
      if (!user || !user.token) return;
      try {
        const { data } = await api.get('/cart', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setCartItems(data.items || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching checkout cart:', err);
        setLoading(false);
      }
    };
    fetchCartItems();
  }, [user]);

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) return <div style={{ padding: '20px' }}>Loading checkout parameters...</div>;

  return (
    <div style={styles.checkoutPage}>
      {/* Left Column: Form Controls */}
      <div style={styles.mainColumn}>
        <h1 style={styles.mainHeading}>Review & Pay</h1>
        <div style={styles.divider}></div>
        
        <Elements stripe={stripePromise}>
          <CheckoutForm cartItems={cartItems} totalPrice={totalPrice} />
        </Elements>
      </div>

      {/* Right Column: Order Summary Sidebar */}
      <div style={styles.sidebar}>
        <h3 style={styles.summaryTitle}>Order Summary</h3>
        <div style={styles.summaryRow}>
          <span>Items ({totalQty}):</span>
          <span>{totalPrice.toFixed(2)} AED</span>
        </div>
        <div style={styles.summaryRow}>
          <span>Shipping & handling:</span>
          <span style={{ color: '#007600' }}>FREE</span>
        </div>
        <div style={styles.summaryDivider}></div>
        <div style={{ ...styles.summaryRow, fontSize: '18px', fontWeight: '700', color: '#b12704' }}>
          <span>Order Total:</span>
          <span>{totalPrice.toFixed(2)} AED</span>
        </div>
      </div>
    </div>
  );
}

// Styling Object matching Amazon's clean checkout pages
const styles = {
  checkoutPage: {
    display: 'flex',
    gap: '30px',
    padding: '30px',
    backgroundColor: '#fff',
    minHeight: 'calc(100vh - 60px)',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '1100px',
    margin: '0 auto',
    alignItems: 'flex-start',
  },
  mainColumn: {
    flex: 2,
  },
  mainHeading: {
    fontSize: '28px',
    fontWeight: '400',
    margin: '0 0 10px 0',
  },
  divider: {
    height: '1px',
    backgroundColor: '#ddd',
    marginBottom: '25px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#c45500',
    margin: '0 0 15px 0',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  cardInputWrapper: {
    border: '1px solid #ddd',
    borderRadius: '4px',
    marginBottom: '20px',
  },
  cardHeader: {
    backgroundColor: '#f6f6f6',
    padding: '10px 15px',
    fontWeight: '700',
    fontSize: '14px',
    borderBottom: '1px solid #ddd',
  },
  stripeContainer: {
    padding: '20px 15px',
    backgroundColor: '#fff',
  },
  payBtn: {
    backgroundColor: '#ffd814',
    borderColor: '#fcd200',
    color: '#0f1111',
    borderStyle: 'solid',
    borderWidth: '1px',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '14px',
    alignSelf: 'flex-start',
    boxShadow: '0 2px 5px rgba(213,217,217,.5)',
  },
  payBtnDisabled: {
    backgroundColor: '#eff0f3',
    borderColor: '#d5d9d9',
    color: '#a2a6ac',
    borderStyle: 'solid',
    borderWidth: '1px',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'not-allowed',
    fontWeight: '500',
    fontSize: '14px',
    alignSelf: 'flex-start',
  },
  statusText: {
    marginTop: '15px',
    fontWeight: '700',
    fontSize: '14px',
  },
  sidebar: {
    flex: 1,
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    backgroundColor: '#fcfcfc',
  },
  summaryTitle: {
    fontSize: '18px',
    margin: '0 0 15px 0',
    fontWeight: '700',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    margin: '10px 0',
    color: '#565959',
  },
  summaryDivider: {
    height: '1px',
    backgroundColor: '#e7e7e7',
    margin: '15px 0',
  },
};

// Fancy UI Configuration object passed down to Stripe CardElement
const stripeElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#0f1111',
      fontFamily: 'Arial, sans-serif',
      '::placeholder': {
        color: '#a6a6a6',
      },
    },
    invalid: {
      color: '#b12704',
    },
  },
};