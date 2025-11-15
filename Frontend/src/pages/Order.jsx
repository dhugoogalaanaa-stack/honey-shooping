import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';


const Order = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  /* ---------- fetch orders ---------- */
  const fetchOrders = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/order/userorders`, {
        headers: { token }
      });

      if (response.data.success) {
        setOrders(response.data.orders || []);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  /* ---------- responsive check ---------- */
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /* ---------- fetch orders on mount ---------- */
  useEffect(() => {
    fetchOrders();
  }, [token]);

  /* ---------- helpers ---------- */
  const getImageSrc = (item) => {
    if (!item) return '';
    // If item has images array
    if (Array.isArray(item.images) && item.images.length) {
      const first = item.images[0];
      return typeof first === 'string' ? first : first.url;
    }
    // If item has image property
    if (item.image) {
      if (Array.isArray(item.image) && item.image.length) return item.image[0];
      return item.image;
    }
    // Default placeholder
    return 'https://via.placeholder.com/80x120?text=No+Image';
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Order Placed': return '#3B82F6'; // blue
      case 'Processing': return '#F59E0B'; // amber
      case 'Shipped': return '#8B5CF6'; // purple
      case 'Delivered': return '#10B981'; // green
      case 'Cancelled': return '#EF4444'; // red
      default: return '#6B7280'; // gray
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Order Placed': return 'Order Placed';
      case 'Processing': return 'Processing';
      case 'Shipped': return 'Shipped';
      case 'Delivered': return 'Delivered';
      case 'Cancelled': return 'Cancelled';
      default: return status;
    }
  };

  // Check if payment should be marked as paid
  const shouldMarkAsPaid = (order) => {
    // For COD orders, mark as paid when delivered
    if (order.paymentMethod === 'COD' && order.status === 'Delivered') {
      return true;
    }
    // For other payment methods, use the actual payment status
    return order.payment;
  };

  /* ---------- render loading ---------- */
  if (loading) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center',
        minHeight: '50vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <p>Loading your orders...</p>
      </div>
    );
  }

  /* ---------- render no token ---------- */
  if (!token) {
    return (
      <div style={{ 
        padding: '2rem',
        textAlign: 'center',
        minHeight: '50vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <h2 style={{ marginBottom: '1rem' }}>Please sign in to view your orders</h2>
        <p style={{ marginBottom: '2rem', color: '#666' }}>
          You need to be logged in to access your order history
        </p>
      </div>
    );
  }

  /* ---------- render no orders ---------- */
  if (orders.length === 0) {
    return (
      <div style={{ padding: '1rem' }}>
        <div style={{ fontSize: '1.5rem', lineHeight: '2rem', marginBottom: '1rem' }}>
          <Title text1="MY" text2=" ORDERS" />
        </div>
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem',
          backgroundColor: '#F9FAFB',
          borderRadius: '8px',
          marginTop: '2rem'
        }}>
          <p style={{ fontSize: '1.2rem', color: '#6B7280', marginBottom: '1rem' }}>
            You haven't placed any orders yet.
          </p>
          <p style={{ color: '#9CA3AF' }}>
            Your orders will appear here once you place them.
          </p>
        </div>
      </div>
    );
  }

  /* ---------- render orders ---------- */
  return (
    <div style={{ padding: isMobile ? '1rem' : '1rem 2rem' }}>
      {/* heading */}
      <div style={{ fontSize: '1.5rem', lineHeight: '2rem', marginBottom: '1.5rem' }}>
        <Title text1="MY" text2=" ORDERS" />
      </div>

      {/* orders list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {orders.map((order) => {
          const isPaid = shouldMarkAsPaid(order);
          
          return (
            <div
              key={order._id}
              style={{
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                padding: '1.5rem',
                backgroundColor: 'white'
              }}
            >
              {/* Order Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1rem',
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? '0.5rem' : '0'
              }}>
                <div>
                  <p style={{ fontWeight: 'bold', margin: '0 0 0.25rem 0' }}>
                    Order #{order._id?.slice(-8).toUpperCase() || 'N/A'}
                  </p>
                  <p style={{ color: '#6B7280', margin: '0', fontSize: '0.9rem' }}>
                    Placed on {formatDate(order.date)}
                  </p>
                  <p style={{ color: '#6B7280', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
                    Payment: {order.paymentMethod} • {isPaid ? 'Paid' : 'Pending'}
                  </p>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: getStatusColor(order.status)
                  }}></div>
                  <span style={{ 
                    color: getStatusColor(order.status),
                    fontWeight: '500',
                    fontSize: '0.9rem'
                  }}>
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div style={{ marginBottom: '1rem' }}>
                {order.items.map((item, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.75rem 0',
                    borderBottom: index < order.items.length - 1 ? '1px solid #F3F4F6' : 'none'
                  }}>
                    <img
                      src={getImageSrc(item)}
                      alt={item.name}
                      style={{
                        width: '60px',
                        height: '60px',
                        objectFit: 'cover',
                        borderRadius: '4px'
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/60x60?text=No+Image';
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: '500', margin: '0 0 0.25rem 0' }}>
                        {item.name}
                      </p>
                      <p style={{ color: '#6B7280', margin: '0', fontSize: '0.9rem' }}>
                        Size: {item.size} • Qty: {item.quantity}
                      </p>
                    </div>
                    <p style={{ fontWeight: 'bold' }}>
                      {item.price * item.quantity}
                      {currency}
                    </p>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '1rem',
                borderTop: '1px solid #E5E7EB'
              }}>
                <p style={{ color: '#6B7280', margin: '0' }}>
                  {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                </p>
                <p style={{ fontWeight: 'bold', margin: '0' }}>
                  Total: {order.amount}
                  {currency}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Order;