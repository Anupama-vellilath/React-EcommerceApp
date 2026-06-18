import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function OrderTracking() {
  const { orderId } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock tracking status configuration matching generic fulfillment steps
  const steps = [
    { label: 'Ordered', key: 'ordered' },
    { label: 'Packed', key: 'packed' },
    { label: 'Shipped', key: 'shipped' },
    { label: 'Out for Delivery', key: 'out_for_delivery' },
    { label: 'Delivered', key: 'delivered' }
  ];

  // Arbitrary current position index (Can be bound to dynamic order.status fields from backend)
  const currentStepIndex = 2; // Fixed example step pointing to "Shipped" status tracking

  useEffect(() => {
    async function fetchOrderDetails() {
      if (!user?.token || !orderId) return;
      try {
        const { data } = await api.get(`/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setOrder(data);
      } catch (err) {
        console.error("Error reading specific payload structures:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrderDetails();
  }, [orderId, user]);

  if (loading) return <div style={{ padding: '30px' }}>Loading real-time delivery status metrics...</div>;

  return (
    <div style={styles.trackContainer}>
      <h2 style={styles.titleHeading}>Fulfillment Tracking Details</h2>
      <p style={styles.subtextId}>Order ID reference code: <span style={{ fontWeight: 'bold' }}>{orderId}</span></p>

      {/* PROGRESS TRACKING BAR BAR PANEL GRAPHIC */}
      <div style={styles.progressBarWrapper}>
        <div style={styles.timelineLine}>
          <div 
            style={{ 
              ...styles.timelineProgressFill, 
              width: `${(currentStepIndex / (steps.length - 1)) * 100}%` 
            }} 
          />
        </div>

        <div style={styles.nodesContainer}>
          {steps.map((step, idx) => {
            const isCompleted = idx <= currentStepIndex;
            return (
              <div key={idx} style={styles.stepNode}>
                <div style={{
                  ...styles.circleIndicator,
                  backgroundColor: isCompleted ? '#2e7d32' : '#fff',
                  borderColor: isCompleted ? '#2e7d32' : '#ccc'
                }}>
                  {isCompleted && '✓'}
                </div>
                <span style={{
                  ...styles.nodeLabel,
                  fontWeight: idx === currentStepIndex ? 'bold' : 'normal',
                  color: isCompleted ? '#111' : '#777'
                }}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* SHIPPING ESTIMATION SUMMARY DETAILS CARD PANEL CONTAINER */}
      <div style={styles.detailsCard}>
        <h3 style={styles.cardSubtitle}>Package Destination Address</h3>
        <p style={styles.addressLine}>
          {order?.shippingAddress?.street || '124 Main Street'}, {order?.shippingAddress?.city || 'Dubai'}, {order?.shippingAddress?.country || 'UAE'}
        </p>
      </div>
    </div>
  );
}

const styles = {
  trackContainer: { maxWidth: '800px', margin: '40px auto', padding: '0 20px', fontFamily: 'Arial' },
  titleHeading: { fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' },
  subtextId: { fontSize: '14px', color: '#555', marginBottom: '40px' },
  progressBarWrapper: { position: 'relative', margin: '40px 0 60px 0', padding: '0 10px' },
  timelineLine: { position: 'absolute', top: '15px', left: '0', right: '0', height: '4px', backgroundColor: '#e0e0e0', zIndex: 1 },
  timelineProgressFill: { height: '100%', backgroundColor: '#2e7d32', transition: 'width 0.4s ease' },
  nodesContainer: { display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 2 },
  stepNode: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100px' },
  circleIndicator: { width: '32px', height: '32px', borderRadius: '50%', border: '2px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', transition: 'all 0.3s' },
  nodeLabel: { fontSize: '12px', textAlign: 'center', whiteSpace: 'nowrap' },
  detailsCard: { border: '1px solid #ddd', borderRadius: '8px', padding: '20px', backgroundColor: '#fcfcfc' },
  cardSubtitle: { margin: '0 0 10px 0', fontSize: '16px', fontWeight: 'bold' },
  addressLine: { margin: 0, fontSize: '14px', color: '#333' }
};