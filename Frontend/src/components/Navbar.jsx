import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../assets/ChatGPT Image Aug 27, 2025, 06_40_57 AM.png';
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { 
    cartCount,
    setShowSearch, 
    token, 
    setToken 
  } = useContext(ShopContext);

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [clickedIndex, setClickedIndex] = useState(null);
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const dropdownRef = useRef(null);
  const sidebarRef = useRef(null);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
    { label: 'About-Us', path: '/about' },
    { label: 'Contact-Us', path: '/contact' }
  ];

  const dropdownItems = [
    { label: 'Orders', to: '/orders' },
    { label: 'Logout' }
  ];

  // Set cart count to 0 if user is not signed in
  const displayCartCount = token ? cartCount : 0;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setVisible(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const currentPath = location.pathname;
    const index = navLinks.findIndex(link => link.path === currentPath);
    setClickedIndex(index);
  }, [location.pathname]);

  const handleLinkClick = (index) => {
    setClickedIndex(index);
    if (isMobile) setVisible(false);
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans&family=Syne:wght@400..800&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: '0.4rem 0.75rem',
        position: 'relative',
        zIndex: 1000
      }}>
        <Link to='/'><img src={Logo} alt="Logo" style={{ width: '90px' }} /></Link>

        {!isMobile && (
          <ul style={{
            listStyleType: 'none',
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            margin: 0,
            padding: 0
          }}>
            {navLinks.map((link, index) => (
              <NavLink
                key={link.path}
                to={link.path}
                style={{
                  textDecoration: 'none',
                  color: 'black',
                  fontWeight: hoveredIndex === index || clickedIndex === index ? '600' : 'normal',
                  transition: 'color 0.2s ease',
                  fontSize: '0.95rem'
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => handleLinkClick(index)}
              >
                {link.label}
                <hr style={{
                  width: '50%',
                  height: '1px',
                  border: 'none',
                  backgroundColor: '#374151',
                  marginTop: '0.2rem',
                  display: clickedIndex === index ? 'block' : 'none'
                }} />
              </NavLink>
            ))}
          </ul>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <svg onClick={() => setShowSearch(true)} xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="#000" style={{ cursor: 'pointer' }}>
            <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
          </svg>

          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="#000"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                if (!token) {
                  navigate('/login');
                } else {
                  toggleDropdown();
                }
              }}>
              <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z" />
            </svg>
            {isDropdownOpen && token && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: '100%',
                zIndex: 1001,
                paddingTop: '0.25rem'
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
                  width: '9rem',
                  padding: '0.6rem 1rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}>
                  {dropdownItems.map((item, index) => (
                    item.to ? (
                      <Link key={item.label} to={item.to} onClick={() => setIsDropdownOpen(false)} style={{
                        textDecoration: 'none',
                        color: hoveredItem === index ? '#111827' : '#6b7280',
                        fontSize: '0.9rem',
                        whiteSpace: 'nowrap',
                        transform: hoveredItem === index ? 'translateX(3px)' : 'translateX(0)',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer'
                      }}
                        onMouseEnter={() => setHoveredItem(index)}
                        onMouseLeave={() => setHoveredItem(null)}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <button key={item.label} onClick={() => {
                        if (item.label === 'Logout') {
                          setToken(null);
                          localStorage.removeItem('token');
                          setIsDropdownOpen(false);
                          navigate('/');
                        } else {
                          item.onClick?.();
                          setIsDropdownOpen(false);
                        }
                      }} style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        margin: 0,
                        color: hoveredItem === index ? '#111827' : '#6b7280',
                        fontSize: '0.9rem',
                        textAlign: 'left',
                        whiteSpace: 'nowrap',
                        transform: hoveredItem === index ? 'translateX(3px)' : 'translateX(0)',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer'
                      }}
                        onMouseEnter={() => setHoveredItem(index)}
                        onMouseLeave={() => setHoveredItem(null)}
                      >
                        {item.label}
                      </button>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link to={token ? '/cart' : '#'} style={{ position: 'relative' }} onClick={(e) => {
            if (!token) {
              e.preventDefault();
              navigate('/login');
            }
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000">
              <path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z" />
            </svg>
            <span style={{
              position: 'absolute',
              top: '-6px',
              right: '-6px',
              background: '#000',
              color: '#fff',
              fontSize: '11px',
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>{displayCartCount}</span>
          </Link>

          {isMobile && (
            <svg onClick={() => setVisible(true)} xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="currentColor" style={{ cursor: 'pointer' }}>
              <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
            </svg>
          )}
        </div>
      </div>

      {isMobile && (
        <div ref={sidebarRef} style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100vh',
          width: '230px',
          backgroundColor: '#fff',
          transform: visible ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease-in-out',
          zIndex: 1100,
          padding: '16px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <button onClick={() => setVisible(false)} style={{
            alignSelf: 'flex-end',
            background: 'none',
            border: 'none',
            fontSize: '1.2rem',
            cursor: 'pointer'
          }}>✕</button>
          <ul style={{
            listStyle: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: 0
          }}>
            {navLinks.map((link, index) => (
              <NavLink
                key={link.path}
                to={link.path}
                style={{
                  textDecoration: 'none',
                  color: '#000',
                  fontWeight: clickedIndex === index ? '600' : 'normal',
                  fontSize: '1rem'
                }}
                onClick={() => handleLinkClick(index)}
              >
                {link.label}
              </NavLink>
            ))}
          </ul>
        </div>
      )}

      {visible && isMobile && (
        <div onClick={() => setVisible(false)} style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.4)',
          zIndex: 1000
        }} />
      )}
    </>
  );
};

export default Navbar;