import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';

// Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onConfirm, onCancel, message }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        maxWidth: '400px',
        width: '90%'
      }}>
        <h3 style={{ marginTop: 0 }}>Confirm Removal</h3>
        <p>{message}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #ccc',
              backgroundColor: 'transparent',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              backgroundColor: '#f44336',
              color: 'white',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

const Cart = () => {
  const { 
    products, 
    currency, 
    cartItems, 
    updateQuantity,
    removeFromCart,
    isCartLoading,
    token,
    isInitialized
  } = useContext(ShopContext);
  const navigate = useNavigate();

  const [cartData, setCartData] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [updatingItems, setUpdatingItems] = useState(new Set());
  const [hasMissingProducts, setHasMissingProducts] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    itemId: null,
    itemSize: null,
    itemName: ''
  });

  const getImageSrc = (p) => {
    if (!p) return '';
    if (Array.isArray(p.images) && p.images.length) {
      const first = p.images[0];
      return typeof first === 'string' ? first : first.url;
    }
    if (Array.isArray(p.image) && p.image.length) return p.image[0];
    return p.image || '';
  };

  const truncateTitle = (title) => {
    const words = title.split(' ');
    return isMobile
      ? words.length > 3 ? `${words.slice(0, 3).join(' ')}…` : title
      : words.length > 5 ? `${words.slice(0, 5).join(' ')}…` : title;
  };

  const openConfirmationModal = (_id, size, name) => {
    setModalState({
      isOpen: true,
      itemId: _id,
      itemSize: size,
      itemName: name
    });
  };

  const closeConfirmationModal = () => {
    setModalState({
      isOpen: false,
      itemId: null,
      itemSize: null,
      itemName: ''
    });
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const list = [];
    let missingProducts = false;
    
    for (const pid in cartItems) {
      for (const size in cartItems[pid]) {
        const qty = cartItems[pid][size];
        if (qty > 0) {
          const product = products.find(p => p._id === pid);
          if (!product) {
            missingProducts = true;
          }
          list.push({ _id: pid, size, quantity: qty });
        }
      }
    }
    
    setHasMissingProducts(missingProducts);
    setCartData(list);
  }, [cartItems, products]);

  const handleRemoveClick = async (_id, size) => {
    const itemKey = `${_id}-${size}`;
    setUpdatingItems(prev => new Set(prev).add(itemKey));
    
    try {
      await removeFromCart(_id, size);
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemKey);
        return newSet;
      });
    }
  };

  const handleQuantityChange = async (_id, size, newQuantity) => {
    const quantity = parseInt(newQuantity);
    
    if (isNaN(quantity)) return;
    
    const itemKey = `${_id}-${size}`;
    setUpdatingItems(prev => new Set(prev).add(itemKey));
    
    try {
      await updateQuantity(_id, size, quantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemKey);
        return newSet;
      });
    }
  };

  // Function to remove all missing products from cart
  const removeMissingProducts = async () => {
    try {
      for (const pid in cartItems) {
        const product = products.find(p => p._id === pid);
        if (!product) {
          // This product doesn't exist anymore, remove all sizes
          for (const size in cartItems[pid]) {
            await removeFromCart(pid, size);
          }
        }
      }
    } catch (error) {
      console.error('Failed to remove missing products:', error);
    }
  };

  if (!isInitialized || isCartLoading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading cart...</div>;
  }

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
        <h2 style={{ marginBottom: '1rem' }}>Please sign in to view your cart</h2>
        <p style={{ marginBottom: '2rem', color: '#666' }}>
          You need to be logged in to access your shopping cart
        </p>
        <button
          onClick={() => navigate('/login')}
          style={{
            background: '#000',
            color: '#fff',
            border: 'none',
            padding: '0.75rem 2rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'background 0.3s'
          }}
          onMouseOver={(e) => e.target.style.background = '#333'}
          onMouseOut={(e) => e.target.style.background = '#000'}
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: isMobile ? '0.5rem 1rem' : '0.5rem 6rem' }}>
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalState.isOpen}
        onConfirm={() => {
          handleRemoveClick(modalState.itemId, modalState.itemSize);
          closeConfirmationModal();
        }}
        onCancel={closeConfirmationModal}
        message={`Are you sure you want to remove "${modalState.itemName}" from your cart?`}
      />

      <div style={{ fontSize: '1.5rem', lineHeight: '2rem', marginBottom: '0.75rem' }}>
        <Title text1="YOUR" text2=" CART" />
      </div>

      {/* Warning about missing products */}
      {hasMissingProducts && (
        <div style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          color: '#856404',
          padding: '1rem',
          borderRadius: '4px',
          marginBottom: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>Some products in your cart are no longer available</span>
          <button
            onClick={removeMissingProducts}
            style={{
              background: 'transparent',
              border: '1px solid #856404',
              color: '#856404',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Remove Unavailable Items
          </button>
        </div>
      )}

      <div>
        {cartData.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <p style={{ fontSize: '1.25rem', color: '#555' }}>Your cart is empty</p>
            <button
              onClick={() => navigate('/shop')}
              style={{
                background: '#000',
                color: '#fff',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          cartData.map(({ _id, size, quantity }) => {
            const product = products.find((p) => p._id === _id);
            const itemKey = `${_id}-${size}`;
            const isUpdating = updatingItems.has(itemKey);
            
            // If product doesn't exist, show unavailable message
            if (!product) {
              return (
                <div
                  key={itemKey}
                  style={{
                    padding: '1rem 0',
                    borderBottom: '1px solid #DDD',
                    color: '#999',
                    display: 'grid',
                    gridTemplateColumns: '4fr 2fr 0.5fr',
                    alignItems: 'center',
                    gap: '1rem',
                    opacity: 0.7,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
                    <div style={{ 
                      width: '4rem', 
                      height: '4rem',
                      backgroundColor: '#f0f0f0',
                      borderRadius: 5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span style={{ fontSize: '0.8rem' }}>No Image</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <p style={{ fontSize: '1rem', fontWeight: 500, margin: 0 }}>
                        Product no longer available
                      </p>
                      <p style={{ fontSize: '0.85rem', margin: '0.5rem 0 0' }}>
                        Size: {size}
                      </p>
                    </div>
                  </div>

                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    disabled={true}
                    style={{
                      border: '1px solid #ccc',
                      borderRadius: 5,
                      width: '60px',
                      padding: '0.5rem',
                      textAlign: 'center',
                      opacity: 0.5,
                    }}
                  />

                  <svg
                    onClick={() => !isUpdating && openConfirmationModal(_id, size, "Unavailable Product")}
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#000"
                    style={{ cursor: isUpdating ? 'not-allowed' : 'pointer', opacity: isUpdating ? 0.5 : 1 }}
                  >
                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360Z" />
                  </svg>
                </div>
              );
            }

            return (
              <div
                key={itemKey}
                style={{
                  padding: '1rem 0',
                  borderBottom: '1px solid #DDD',
                  color: '#374151',
                  display: 'grid',
                  gridTemplateColumns: '4fr 2fr 0.5fr',
                  alignItems: 'center',
                  gap: '1rem',
                  opacity: isUpdating ? 0.6 : 1,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
                  <img
                    src={getImageSrc(product)}
                    alt={product.name}
                    style={{ width: '4rem', borderRadius: 5 }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <p style={{ fontSize: '1rem', fontWeight: 500, margin: 0 }}>
                      {truncateTitle(product.name)}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                      <p style={{ fontSize: '0.85rem', margin: '0.5rem 0 0' }}>
                        {product.price} {currency}
                      </p>
                      <p style={{ fontSize: '0.85rem', margin: '0.5rem 0 0', padding: '0.5rem' }}>
                        {size}
                      </p>
                    </div>
                  </div>
                </div>

                <input
                  type="number"
                  min={1}
                  value={quantity}
                  disabled={isUpdating}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val) && val >= 1) {
                      handleQuantityChange(_id, size, val);
                    } else if (val === 0) {
                      openConfirmationModal(_id, size, product.name);
                    }
                  }}
                  onBlur={(e) => {
                    if (e.target.value === '' || parseInt(e.target.value) < 1) {
                      e.target.value = 1;
                      handleQuantityChange(_id, size, 1);
                    }
                  }}
                  style={{
                    border: '1px solid #ccc',
                    borderRadius: 5,
                    width: '60px',
                    padding: '0.5rem',
                    textAlign: 'center',
                    opacity: isUpdating ? 0.7 : 1,
                  }}
                />

                <svg
                  onClick={() => !isUpdating && openConfirmationModal(_id, size, product.name)}
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#000"
                  style={{ cursor: isUpdating ? 'not-allowed' : 'pointer', opacity: isUpdating ? 0.5 : 1 }}
                >
                  <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360Z" />
                </svg>
              </div>
            );
          })
        )}
      </div>

      {token && cartData.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
          <div style={{ width: isMobile ? '100%' : '33%' }}>
            <CartTotal />
            <div style={{ textAlign: 'end', marginTop: '1.5rem' }}>
              <button
                onClick={() => navigate('/place-order')}
                style={{
                  background: '#000',
                  color: '#fff',
                  borderRadius: 20,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '0.75rem 2rem',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                }}
              >
                PROCEED TO CHECKOUT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;