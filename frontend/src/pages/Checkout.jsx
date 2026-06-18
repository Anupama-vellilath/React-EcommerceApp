import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const stripePromise = loadStripe('pk_test_xxxxxxxxxxxx');

function CheckoutForm({ cartItems, totalPrice, address }) {
  const stripe = useStripe();
  const elements = useElements();
  const [status, setStatus] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();
  const { fetchCart } = useCart();
  const navigate = useNavigate();

  const handlePay = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setStatus('Processing your payment securely...');

    try {
      const items = cartItems.map(item => ({
        product: item.product._id,
        qty: item.quantity,
        price: item.product.price
      }));

      // Send items and shipping address to backend
      const { data } = await api.post(
        '/orders/payment-intent', 
        { items, shippingAddress: address }, 
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (result.error) {
        setStatus(`Payment Error: ${result.error.message}`);
        setIsProcessing(false);
      } else {
        await api.post(
          '/orders', 
          {
            items,
            total: data.total,
            stripePaymentId: result.paymentIntent.id,
            shippingAddress: address
          },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );

        try {
          await api.delete('/cart', { headers: { Authorization: `Bearer ${user.token}` } });
        } catch (err) {
          console.error("Cart cleanup failed:", err);
        }

        await fetchCart();
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
      <h2 style={styles.sectionTitle}>Payment method</h2>
      
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
  const { cartItems, loading: cartLoading } = useCart();
  const { user } = useAuth();
  const [addressLoading, setAddressLoading] = useState(true);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: ''
  });
  const [formAddress, setFormAddress] = useState({ ...address });

  // 1. Fetch address on initialization
  useEffect(() => {
    async function fetchSavedAddress() {
      if (!user || !user.token) return;
      try {
        const { data } = await api.get('/auth/profile', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        
        if (data && data.address) {
          setAddress(data.address);
          setFormAddress(data.address);
        }
      } catch (err) {
        console.error("Could not parse profile address:", err);
      } finally {
        setAddressLoading(false);
      }
    }
    fetchSavedAddress();
  }, [user]);

  // 2. Updated to properly sync with matching route formats
  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      // NOTE: If your backend URL is different (e.g., just '/users/profile'), change this string below!
// Inside Checkout.jsx -> handleSaveAddress block
await api.put('/auth/profile/address', 
  { address: formAddress }, 
  { headers: { Authorization: `Bearer ${user.token}` } }
);

      setAddress({ ...formAddress });
      setIsEditingAddress(false);
    } catch (err) {
      console.error("Server synchronization error:", err);
      alert("Error saving address details. Please make sure the backend endpoint path matches exactly.");
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (cartLoading || addressLoading) return <div style={{ padding: '20px' }}>Loading checkout parameters...</div>;

  return (
    <div style={styles.checkoutPage}>
      <div style={styles.mainColumn}>
        
        {/* SHIPPING ADDRESS SECTION */}
        <div style={styles.addressPanel}>
          <div style={styles.panelLeft}>
            <h2 style={styles.panelHeading}>1. Delivering to {user?.name || 'Customer'}</h2>
            
            {!isEditingAddress ? (
              <>
                {address.street ? (
                  <p style={styles.addressText}>
                    {address.street}, {address.city}, {address.state}, {address.zip}, {address.country}
                  </p>
                ) : (
                  <p style={{ ...styles.addressText, color: '#b12704', fontWeight: 'bold' }}>
                    No delivery address saved yet. Click "Add" to save one.
                  </p>
                )}
                <span style={styles.addInstructions}>Add delivery instructions</span>
              </>
            ) : (
              <form onSubmit={handleSaveAddress} style={styles.addressForm}>
                <input 
                  type="text" 
                  value={formAddress.street} 
                  placeholder="Street Address"
                  onChange={e => setFormAddress({...formAddress, street: e.target.value})} 
                  style={styles.addressInput}
                  required
                />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input 
                    type="text" 
                    value={formAddress.city} 
                    placeholder="City"
                    onChange={e => setFormAddress({...formAddress, city: e.target.value})} 
                    style={styles.addressInput}
                    required
                  />
                  <input 
                    type="text" 
                    value={formAddress.state} 
                    placeholder="State / Region"
                    onChange={e => setFormAddress({...formAddress, state: e.target.value})} 
                    style={styles.addressInput}
                    required
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input 
                    type="text" 
                    value={formAddress.zip} 
                    placeholder="ZIP / Postal Code"
                    onChange={e => setFormAddress({...formAddress, zip: e.target.value})} 
                    style={styles.addressInput}
                    required
                  />
                  <input 
                    type="text" 
                    value={formAddress.country} 
                    placeholder="Country"
                    onChange={e => setFormAddress({...formAddress, country: e.target.value})} 
                    style={styles.addressInput}
                    required
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                  <button type="submit" style={styles.saveAddressBtn}>Save Address</button>
                  <button type="button" onClick={() => setIsEditingAddress(false)} style={styles.cancelAddressBtn}>Cancel</button>
                </div>
              </form>
            )}
          </div>
          
          {!isEditingAddress && (
            <span onClick={() => { setFormAddress({...address}); setIsEditingAddress(true); }} style={styles.changeLink}>
              {address.street ? 'Change' : 'Add'}
            </span>
          )}
        </div>

        <div style={styles.panelDivider}></div>

        {/* PAYMENT METHOD PANEL */}
        <div style={styles.paymentPanel}>
          <Elements stripe={stripePromise}>
            <CheckoutForm cartItems={cartItems} totalPrice={totalPrice} address={address} />
          </Elements>
        </div>
      </div>

      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <button style={styles.topPlaceOrderBtn} disabled={cartItems.length === 0 || !address.street}>
          Use this payment method
        </button>
        <p style={styles.termsText}>
          By placing your order, you agree to Amazon's privacy notice and conditions of use.
        </p>
        <div style={styles.summaryDivider}></div>
        <h3 style={styles.summaryTitle}>Order Summary</h3>
        <div style={styles.summaryRow}>
          <span>Items ({totalQty}):</span>
          <span>{totalPrice.toFixed(2)} AED</span>
        </div>
        <div style={styles.summaryRow}>
          <span>Delivery:</span>
          <span style={{ color: '#007600' }}>FREE Delivery</span>
        </div>
        <div style={styles.summaryDivider}></div>
        <div style={{ ...styles.summaryRow, fontSize: '18px', fontWeight: '700', color: '#b12704', margin: '15px 0' }}>
          <span>Order Total:</span>
          <span>{totalPrice.toFixed(2)} AED</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  checkoutPage: { display: 'flex', gap: '30px', padding: '20px 30px', backgroundColor: '#fff', minHeight: 'calc(100vh - 60px)', fontFamily: 'Arial, sans-serif', maxWidth: '1150px', margin: '0 auto', alignItems: 'flex-start' },
  mainColumn: { flex: 3 },
  addressPanel: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '10px 0' },
  panelLeft: { display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' },
  panelHeading: { fontSize: '19px', fontWeight: '700', color: '#111', margin: 0 },
  addressText: { fontSize: '14px', color: '#111', margin: '4px 0 0 20px' },
  addInstructions: { fontSize: '13px', color: '#007185', cursor: 'pointer', margin: '4px 0 0 20px' },
  changeLink: { fontSize: '14px', color: '#007185', cursor: 'pointer', fontWeight: '500' },
  addressForm: { display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '460px', margin: '12px 0 0 20px' },
  addressInput: { width: '100%', padding: '7px 10px', border: '1px solid #888', borderRadius: '3px', fontSize: '13px', outline: 'none', fontFamily: 'Arial' },
  saveAddressBtn: { backgroundColor: '#ffd814', borderColor: '#fcd200', color: '#0f1111', borderStyle: 'solid', borderWidth: '1px', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '500' },
  cancelAddressBtn: { backgroundColor: '#fff', borderColor: '#d5d9d9', color: '#0f1111', borderStyle: 'solid', borderWidth: '1px', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' },
  panelDivider: { height: '1px', backgroundColor: '#e7e7e7', margin: '20px 0' },
  paymentPanel: { padding: '10px 0' },
  sectionTitle: { fontSize: '19px', fontWeight: '700', color: '#b12704', margin: '0 0 15px 0' },
  form: { display: 'flex', flexDirection: 'column' },
  cardInputWrapper: { border: '1px solid #ddd', borderRadius: '4px', marginBottom: '20px', maxWidth: '500px' },
  cardHeader: { backgroundColor: '#f6f6f6', padding: '10px 15px', fontWeight: '700', fontSize: '14px', borderBottom: '1px solid #ddd' },
  stripeContainer: { padding: '20px 15px', backgroundColor: '#fff' },
  payBtn: { backgroundColor: '#ffd814', borderColor: '#fcd200', color: '#0f1111', borderStyle: 'solid', borderWidth: '1px', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', fontSize: '14px', alignSelf: 'flex-start', boxShadow: '0 2px 5px rgba(213,217,217,.5)' },
  payBtnDisabled: { backgroundColor: '#eff0f3', borderColor: '#d5d9d9', color: '#a2a6ac', borderStyle: 'solid', borderWidth: '1px', padding: '10px 20px', borderRadius: '8px', cursor: 'not-allowed', fontWeight: '500', fontSize: '14px', alignSelf: 'flex-start' },
  statusText: { marginTop: '15px', fontWeight: '700', fontSize: '14px' },
  sidebar: { flex: 1.2, border: '1px solid #d5d9d9', borderRadius: '8px', padding: '18px', backgroundColor: '#fff' },
  topPlaceOrderBtn: { width: '100%', backgroundColor: '#ffd814', borderColor: '#fcd200', color: '#0f1111', borderStyle: 'solid', borderWidth: '1px', padding: '10px', borderRadius: '8px', fontWeight: '500', fontSize: '13px', cursor: 'pointer', boxShadow: '0 2px 5px rgba(213,217,217,.5)' },
  termsText: { fontSize: '12px', color: '#565959', textAlign: 'center', lineHeight: '1.4', margin: '10px 0 0 0' },
  summaryTitle: { fontSize: '18px', margin: '0 0 15px 0', fontWeight: '700' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', margin: '8px 0', color: '#111' },
  summaryDivider: { height: '1px', backgroundColor: '#e7e7e7', margin: '15px 0' }
};

const stripeElementOptions = {
  style: {
    base: { fontSize: '16px', color: '#0f1111', fontFamily: 'Arial, sans-serif', '::placeholder': { color: '#a6a6a6' } },
    invalid: { color: '#b12704' }
  }
};