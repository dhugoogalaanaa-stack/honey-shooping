import React from 'react'
import { Link } from 'react-router-dom'; // Import Link
import Logo from '../assets/ChatGPT Image Aug 27, 2025, 06_40_57 AM.png';

const Navbar = ({setToken}) => {
    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans&family=Syne:wght@400..800&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        
        /* Add the ripple animation */
        @keyframes ripple {
          0% {
            transform: scale(0, 0);
            opacity: 1;
          }
          20% {
            transform: scale(25, 25);
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: scale(40, 40);
          }
        }
      `}</style>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '0.5rem',      // py-2 = 0.5rem top and bottom
                paddingBottom: '0.5rem',
                paddingLeft: '4%',
                paddingRight: '4%',
            }} >
                {/* Wrap the logo with Link to redirect to Add page */}
                <Link to="/add">
                    <img src={Logo} alt="Logo" style={{ width: '90px', cursor: 'pointer' }} />
                </Link>
                
                <button 
                onClick={()=>setToken('')}
                style={{
        marginTop: '1rem',
        backgroundColor: '#000000',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        cursor: 'pointer',
        borderRadius: '20px',
        color: 'white',
        padding: '12px 24px',
        fontSize: '0.875rem',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        border: 'none',
        outline: 'none',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        overflow: 'hidden',
      }} 
      onMouseOver={(e) => {
        e.target.style.backgroundColor = '#333333';
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
      }}
      onMouseOut={(e) => {
        e.target.style.backgroundColor = '#000000';
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
      }}
      onMouseDown={(e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
      }}
      onMouseUp={(e) => {
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
      }}
      >Logout</button>
            </div>
        </>
    )
}

export default Navbar