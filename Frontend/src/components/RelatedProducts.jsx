import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './Productitem';

/* ---------- responsive columns hook ---------- */
const useGridColumns = () => {
  const [columns, setColumns] = useState(2);
  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      if (w >= 1024)      setColumns(5);
      else if (w >= 768)  setColumns(4);
      else if (w >= 640)  setColumns(3);
      else if (w >= 475)  setColumns(2);
      else                setColumns(1);
    };
    window.addEventListener('resize', check);
    check();
    return () => window.removeEventListener('resize', check);
  }, []);
  return columns;
};

/* ---------- main component ---------- */
const RelatedProducts = ({ category, subCategory }) => {
  const { products } = useContext(ShopContext);
  const { ProductId } = useParams();            // ID of the product being viewed
  const [related, setRelated] = useState([]);
  const columns = useGridColumns();

  /* helper: grab first image url or fallback */
  const getImageSrc = (item) => {
    if (Array.isArray(item.images) && item.images.length) {
      const first = item.images[0];
      return typeof first === 'string' ? first : first.url;
    }
    return item.image || '';
  };

  /* filter related items */
  useEffect(() => {
    if (products.length) {
      const list = products
        .filter(p => p.category === category)
        .filter(p => p.subCategory === subCategory)
        .filter(p => p._id !== ProductId)       // exclude current product
        .slice(0, 5);                           // top 5
      setRelated(list);
    }
  }, [products, category, subCategory, ProductId]);

  /* jump to top whenever list changes */
  useEffect(() => window.scrollTo(0, 0), [related]);

  return (
    <div style={{ padding: '20px 0', overflow: 'hidden' }}>
      <div style={{ textAlign: 'center', fontSize: '1.875rem', lineHeight: '2.25rem', marginBottom: 20 }}>
        <Title text1="RELATED " text2="PRODUCTS" />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: '0.75rem',
          justifyContent: 'center',
          padding: '0 1rem',
          maxWidth: 1200,
          margin: '0 auto',
        }}
      >
        {related.map((item) => (
          <Link
            key={item._id}
            to={`/product/${item._id}`}
            onClick={() => window.scrollTo(0, 0)}
            style={{ textDecoration: 'none', color: 'inherit', borderRadius: 8, transition: 'all 0.3s', display: 'flex', flexDirection: 'column' }}
          >
            <ProductItem
              id={item._id}
              name={item.name}
              image={getImageSrc(item)}       /* <-- fixed line */
              price={item.price}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
