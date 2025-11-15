import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setList(response.data.products || []);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching product list:', error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.delete(`${backendUrl}/api/product/remove/${id}`, { 
        headers: { 
          token: token,
          'Authorization': `Bearer ${token}`
        } 
      });

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error removing product:', error);
      toast.error(error.response?.data?.message || error.message || "Failed to remove product");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ padding: isMobile ? '0.5rem' : '1rem' }}>
      <h2 style={{ marginBottom: '1rem', fontSize: isMobile ? '1.25rem' : '1.5rem' }}>All Products List</h2>
      
      {isMobile ? (
        // Mobile view - card layout
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {list.length > 0 ? (
            list.map((item) => (
              <div key={item._id} style={{
                padding: '1rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                backgroundColor: '#fff',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  {item.images?.[0]?.url ? (
                    <img
                      src={item.images[0].url}
                      alt={item.name}
                      style={{
                        width: '60px',
                        height: '60px',
                        objectFit: 'cover',
                        borderRadius: '4px'
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML += '<div style="width:60px;height:60px;background:#f3f4f6;display:flex;align-items:center;justify-content:center;border-radius:4px;font-size:0.8rem">No Image</div>';
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '60px',
                      height: '60px',
                      backgroundColor: '#f3f4f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '4px',
                      fontSize: '0.8rem'
                    }}>
                      No Image
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem' }}>{item.name || 'N/A'}</h3>
                    <p style={{ margin: '0', color: '#666', fontSize: '0.9rem' }}>{item.category || 'N/A'}</p>
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                    {item.price ? `${item.price}${currency}` : 'N/A'}
                  </span>
                  <button 
                    onClick={() => removeProduct(item._id)}
                    style={{
                      padding: '0.5rem',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      height="24px"
                      viewBox="0 -960 960 960" 
                      width="24px"
                      fill="#ffffff"
                    >
                      <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div style={{
              padding: '2rem',
              textAlign: 'center',
              backgroundColor: '#f3f4f6',
              border: '1px solid #ddd',
              borderRadius: '8px'
            }}>
              No products found
            </div>
          )}
        </div>
      ) : (
        // Desktop view - table layout
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          {/** List table header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 3fr 1fr 1fr 1fr',
            alignItems: 'center',
            padding: '0.75rem',
            border: '1px solid #ddd',
            backgroundColor: '#f3f4f6',
            fontSize: '0.875rem',
            fontWeight: 'bold',
          }}>
            <span>Image</span>
            <span>Name</span>
            <span>Category</span>
            <span>Price</span>
            <span>Action</span>
          </div>

          {/** Product list */}
          {list.length > 0 ? (
            list.map((item) => (
              <div key={item._id} style={{
                display: 'grid',
                gridTemplateColumns: '1fr 3fr 1fr 1fr 1fr',
                alignItems: 'center',
                padding: '0.75rem',
                border: '1px solid #ddd',
                backgroundColor: '#fff',
              }}>
                {item.images?.[0]?.url ? (
                  <img
                    src={item.images[0].url}
                    alt={item.name}
                    style={{
                      width: '50px',
                      height: '50px',
                      objectFit: 'cover',
                      borderRadius: '4px'
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<div style="width:50px;height:50px;background:#f3f4f6;display:flex;align-items:center;justify-content:center;border-radius:4px;font-size:0.8rem">No Image</div>';
                    }}
                  />
                ) : (
                  <div style={{
                    width: '50px',
                    height: '50px',
                    backgroundColor: '#f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '4px',
                    fontSize: '0.8rem'
                  }}>
                    No Image
                  </div>
                )}
                <p style={{ margin: 0 }}>{item.name || 'N/A'}</p>
                <p style={{ margin: 0 }}>{item.category || 'N/A'}</p>
                <p style={{ margin: 0 }}>{item.price ? `${item.price}${currency}` : 'N/A'}</p>
                <button 
                  onClick={() => removeProduct(item._id)}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    height="24px"
                    viewBox="0 -960 960 960" 
                    width="24px"
                    fill="#ffffff"
                  >
                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                  </svg>
                </button>
              </div>
            ))
          ) : (
            <div style={{
              padding: '2rem',
              textAlign: 'center',
              backgroundColor: '#f3f4f6',
              border: '1px solid #ddd'
            }}>
              No products found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default List;