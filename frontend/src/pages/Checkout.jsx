import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../api/axios';

const stripePromise = loadStripe('pk_test_xxxxxxxxxxxx');

function CheckoutForm({ cart }) {
  const stripe = useStripe();
  const elements = useElements();
  const [status, setStatus] = useState('');

  const handlePay = async (e) => {
    e.preventDefault();
    setStatus('Processing…');

    const items = cart.map(i => ({ product: i._id, qty: i.qty, price: i.price }));
    const { data } = await api.post('/orders/payment-intent', { items });

    const result = await stripe.confirmCardPayment(data.clientSecret, {
      payment_method: { card: elements.getElement(CardElement) },
    });

    if (result.error) {
      setStatus(result.error.message);
    } else {
      await api.post('/orders', {
        items,
        total: data.total,
        stripePaymentId: result.paymentIntent.id,
      });
      setStatus('Payment successful!');
    }
  };

  return (
    <form onSubmit={handlePay}>
      <CardElement />
      <button type="submit" disabled={!stripe}>Pay Now</button>
      <p>{status}</p>
    </form>
  );
}

export default function Checkout({ cart }) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm cart={cart} />
    </Elements>
  );
}