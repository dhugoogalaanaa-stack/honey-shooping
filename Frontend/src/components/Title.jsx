import React, { useState, useEffect, useRef } from 'react';

const Title = ({ text1, text2 }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [lineSpacing, setLineSpacing] = useState('20px');
  const textRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      calculateSpacing();
    };

    window.addEventListener('resize', handleResize);
    calculateSpacing(); // Initial calculation
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const calculateSpacing = () => {
    if (!textRef.current) return;
    
    const textLength = text1.length + text2.length;
    const isShortText = textLength < 10; // Adjust threshold as needed

    if (windowWidth <= 302) {
      setLineSpacing('-50px');
    } else if (windowWidth < 640) { // Mobile
      setLineSpacing(isShortText ? '10px' : '5px');
    } else { // Desktop/tablet
      setLineSpacing(isShortText ? '20px' : '10px');
    }
  };

  const responsiveWidth = windowWidth >= 640 ? '48px' : '32px';

  return (
    <div style={{
      display: 'inline-flex',
      gap: lineSpacing, // Dynamic spacing
      alignItems: 'center',
      marginTop: '30px',
      marginBottom: '0.75rem',
      transition: 'gap 0.3s ease' // Smooth transition
    }}>
      <div ref={textRef} style={{ display: 'flex' }}>
        <p style={{ color: '#6b7280', margin: 0 }}>
          {text1} 
          <span style={{ 
            color: 'black', 
            fontWeight: '500',
            whiteSpace: 'nowrap'
          }}>
            {text2}
          </span>
        </p>
      </div>
      <div style={{ 
        width: responsiveWidth,
        height: '2px',
        backgroundColor: '#374151',
        flexShrink: 0 // Prevents line from shrinking
      }} />
    </div>
  );
};

export default Title;