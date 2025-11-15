import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useLocation } from 'react-router-dom';

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
  const location = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (location.pathname.includes('shop')) {
      setVisible(true);
    } else {
      setVisible(false);
      setShowSearch(false); // Hide search when leaving collection page
    }
  }, [location, setShowSearch]);

  const [inputWidth, setInputWidth] = useState(getWidth());

  function getWidth() {
    return window.innerWidth < 640 ? '75%' : '50%';
  }

  useEffect(() => {
    const handleResize = () => {
      setInputWidth(getWidth());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  if (!visible) return null;

  return showSearch ? (
    <div
      style={{
        borderTop: '1px solid #e5e7eb',
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#f9fafb',
        paddingTop: '1rem',
        paddingBottom: '1rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1rem', // spacing between input and close icon
        flexDirection: 'row'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          border: '1px solid #9ca3af',
          padding: '0.5rem 1.25rem',
          borderRadius: '9999px',
          width: inputWidth
        }}
      >
        <input
          value={search}
          onChange={handleSearch}
          style={{
            flex: 1,
            outline: 'none',
            background: 'inherit',
            fontSize: '0.875rem',
            border: 'none'
          }}
          type="text"
          placeholder="Search"
          autoFocus
        />
        <svg
          style={{ cursor: 'pointer' }}
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#000"
        >
          <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
        </svg>
      </div>

      <svg
        onClick={() => setShowSearch(false)}
        style={{
          cursor: 'pointer'
        }}
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="#000"
      >
        <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
      </svg>
    </div>
  ) : null;
};

export default SearchBar;
