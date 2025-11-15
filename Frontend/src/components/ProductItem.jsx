import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);

  return (
    <div style={{
      fontFamily: "'Inter', sans-serif",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      maxWidth: '250px',
      margin: '0 auto'
    }}>
      <Link
        to={`/product/${id}`}
        style={{
          textDecoration: 'none',
          color: 'black',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%'
        }}
      >
        <div style={{
          width: '100%',
          height: '300px',
          borderRadius: '0.5rem',
          overflow: 'hidden',
          backgroundColor: '#f9fafb',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <img
            src={Array.isArray(image) ? image[0] : image}
            alt={name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.1s ease-in-out'
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          />
        </div>

        <div style={{
          width: '100%',
          padding: '0.5rem 0',
          textAlign: 'left'
        }}>
          <p style={{
            margin: 0,
            fontSize: '1rem',
            color: '#4b5563',
            fontWeight: 400,
            lineHeight: '1.25'
          }}>
            {name}
          </p>
          <p style={{
            margin: '0.25rem 0 0 0',
            fontSize: '0.875rem',
            color: '#111827',
            fontWeight: 650
          }}>
            {price}{currency}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default ProductItem;
