import React from 'react';
import { FaPhone, FaEnvelope } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/ChatGPT Image Aug 27, 2025, 06_40_57 AM.png';

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    // Use setTimeout to ensure navigation completes before scrolling
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <footer style={{
      backgroundColor: '#f8f9fa',
      padding: '60px 20px 30px',
      fontFamily: "'Arial', sans-serif",
      color: '#333'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '40px',
        paddingBottom: '40px',
        borderBottom: '1px solid #ddd'
      }}>
        {/* Brand Info Section */}
        <div>
          <div style={{
            marginBottom: '25px',
            height: '70px',
            transition: 'transform 0.3s ease',
            cursor: 'pointer'
          }} onClick={() => handleNavigation('/')}>
            <img 
              src={Logo}
              alt="FOREVER Logo"
              style={{
                height: '100%',
                width: 'auto',
                maxWidth: '200px',
                objectFit: 'contain'
              }}
            />
          </div>
          <p style={{
            lineHeight: '1.6',
            color: '#666',
            marginTop: '10px'
          }}>
            Discover timeless fashion that celebrates your unique style. Our collections are crafted with passion and attention to detail to bring you quality pieces you'll love forever.
          </p>
        </div>

        {/* Company Links Section */}
        <div>
          <h3 style={{
            fontSize: '1.2rem',
            fontWeight: '600',
            marginBottom: '20px',
            color: '#000'
          }}>
            COMPANY
          </h3>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0
          }}>
            {[
              { name: 'Home', path: '/' },  // Changed from '/home' to '/'
              { name: 'Shop', path: '/shop' },
              { name: 'About Us', path: '/about' },
              { name: 'Contact Us', path: '/contact' }
            ].map((item) => (
              <li key={item.name} style={{ 
                marginBottom: '12px'
              }}>
                <Link 
                  to={item.path}
                  style={{
                    color: '#666',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    display: 'inline-block',
                    padding: '4px 0',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#000';
                    e.target.style.transform = 'translateX(5px)';
                    e.target.style.fontWeight = '500';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#666';
                    e.target.style.transform = 'translateX(0)';
                    e.target.style.fontWeight = 'normal';
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation(item.path);
                  }}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info Section */}
        <div>
          <h3 style={{
            fontSize: '1.2rem',
            fontWeight: '600',
            marginBottom: '20px',
            color: '#000'
          }}>
            GET IN TOUCH
          </h3>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '18px',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateX(5px)';
            e.currentTarget.style.color = '#000';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateX(0)';
            e.currentTarget.style.color = '#666';
          }}
          onClick={() => window.location.href = 'tel:+1-212-456-7890'}
          >
            <FaPhone style={{ 
              marginRight: '12px',
              color: '#666',
              fontSize: '1.1rem'
            }} />
            <span style={{ color: '#666' }}>+1-212-456-7890</span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '18px',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateX(5px)';
            e.currentTarget.style.color = '#000';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateX(0)';
            e.currentTarget.style.color = '#666';
          }}
          onClick={() => window.location.href = 'mailto:contact@foreveryou.com'}
          >
            <FaEnvelope style={{ 
              marginRight: '12px',
              color: '#666',
              fontSize: '1.1rem'
            }} />
            <span style={{ color: '#666' }}>contact@foreveryou.com</span>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '40px auto 0',
        textAlign: 'center',
        color: '#666',
        fontSize: '0.9rem',
        padding: '15px 0'
      }}>
        Copyright © 2024 forever.com - All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;