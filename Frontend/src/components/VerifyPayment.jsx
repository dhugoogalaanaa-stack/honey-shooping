import React, { useEffect, useState, useContext, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';

const VerifyPayment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { backendUrl, token, clearCart } = useContext(ShopContext);
  const [verifying, setVerifying] = useState(true);
  const [message, setMessage] = useState('Verifying your payment...');
  const [allParams, setAllParams] = useState({});
  const hasProcessedRef = useRef(false);

  // Extract URL parameters only once on component mount
  useEffect(() => {
    const params = {};
    for (let [key, value] of searchParams.entries()) {
      const cleanKey = key.replace(/^amp;/, '');
      params[cleanKey] = value;
    }
    setAllParams(params);
  }, [searchParams]);

  useEffect(() => {
    // Only run verification if we have parameters and haven't processed yet
    if (Object.keys(allParams).length === 0 || hasProcessedRef.current) return;

    const verifyPayment = async () => {
      try {
        hasProcessedRef.current = true;
        const { success, orderId, gateway, tx_ref } = allParams;
        
        if (success === 'true') {
          if (gateway === 'stripe') {
            const response = await axios.post(
              `${backendUrl}/api/order/verify-stripe`,
              { orderId },
              { headers: { token } }
            );
            
            if (response.data.success) {
              setMessage('Payment successful! Your order has been placed.');
              clearCart(false); // Pass false to prevent toast notification
            } else {
              setMessage('Payment verification failed. Please contact support.');
            }
          } 
          else if (gateway === 'chapa') {
            const chapaTxRef = tx_ref || allParams.trx_ref || allParams.transaction_id;
            
            if (chapaTxRef) {
              const response = await axios.post(
                `${backendUrl}/api/order/verify-chapa`,
                { tx_ref: chapaTxRef },
                { headers: { token } }
              );
              
              if (response.data.success) {
                setMessage('Payment successful! Your order has been placed.');
                clearCart(false); // Pass false to prevent toast notification
              } else {
                setMessage('Payment verification failed. Please contact support.');
              }
            } else {
              setMessage('Payment processing completed. Please check your email for confirmation.');
              clearCart(false); // Pass false to prevent toast notification
            }
          }
        } else {
          setMessage('Payment was cancelled or failed. Please try again.');
        }
      } catch (error) {
        setMessage('Error verifying payment. Please contact support if there are any issues.');
      } finally {
        setVerifying(false);
        localStorage.removeItem('guest_cart');
        setTimeout(() => navigate('/orders'), 3000);
      }
    };

    verifyPayment();
  }, [allParams, backendUrl, token, navigate, clearCart]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      padding: '20px',
      textAlign: 'center',
      backgroundColor: '#f8f9fa',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2.5rem',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
        maxWidth: '500px',
        width: '100%',
        border: '1px solid #eaeaea'
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{
            width: '60px',
            height: '60px',
            margin: '0 auto 1.5rem',
            borderRadius: '50%',
            backgroundColor: verifying ? '#e9ecef' : '#d4edda',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            color: verifying ? '#6c757d' : '#28a745'
          }}>
            {verifying ? '...' : '✓'}
          </div>
          
          <h2 style={{ 
            color: '#2d3436', 
            marginBottom: '1rem',
            fontSize: '1.5rem',
            fontWeight: '600'
          }}>
            {verifying ? 'Verifying Payment' : 'Payment Processed'}
          </h2>
          
          <p style={{ 
            color: '#636e72', 
            fontSize: '1.1rem',
            lineHeight: '1.5'
          }}>
            {message}
          </p>
        </div>
        
        {verifying && (
          <div style={{ 
            width: '100%', 
            height: '4px', 
            backgroundColor: '#e9ecef',
            borderRadius: '2px',
            overflow: 'hidden',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#3498db',
              borderRadius: '2px',
              animation: 'loading 1.5s infinite ease-in-out'
            }}></div>
          </div>
        )}
        
        <p style={{ 
          color: '#7f8c8d', 
          fontSize: '0.9rem',
          marginTop: '1.5rem'
        }}>
          {verifying ? 'Please wait while we process your payment...' : 'Redirecting to orders page...'}
        </p>
      </div>
      
      <style>
        {`
          @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}
      </style>
    </div>
  );
};

export default VerifyPayment;