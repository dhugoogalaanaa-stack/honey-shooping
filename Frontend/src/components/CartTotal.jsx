import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';

const CartTotal = () => {
  const { 
    currency, 
    delivery_fee, 
    cartAmount, 
    cartTotal,
    cartCount  // Get cartCount to check if cart is empty
  } = useContext(ShopContext);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const formatCurrency = (amount) => {
    return (amount || 0).toFixed(2);
  };

  // Check if cart is empty
  const isCartEmpty = cartCount === 0;

  return (
    <div style={{
      width: isMobile ? '90%' : '350px',
      padding: '1.5rem',
    }}>
      <div style={{ fontSize: '1.25rem', lineHeight: '1.75rem', marginBottom: '1rem' }}>
        <Title text1={'CART'} text2={' TOTALS'} />
      </div>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        fontSize: '14px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Subtotal</span>
          <span>{formatCurrency(cartAmount)} {currency}</span>
        </div>
        
        <hr style={{ borderColor: '#e5e7eb', margin: '4px 0' }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Shipping Fee</span>
          <span>{formatCurrency(isCartEmpty ? 0 : delivery_fee)} {currency}</span>
        </div>
        
        <hr style={{ borderColor: '#e5e7eb', margin: '4px 0' }} />
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          fontSize: '16px',
          fontWeight: '600',
          marginTop: '8px'
        }}>
          <span>Total</span>
          <span>{formatCurrency(isCartEmpty ? 0 : cartTotal)} {currency}</span>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;