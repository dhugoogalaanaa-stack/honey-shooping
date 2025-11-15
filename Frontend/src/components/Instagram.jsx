import React from 'react';
import { FiInstagram } from 'react-icons/fi';

const Instagram = () => {
  const [posts] = React.useState([
    { id: 1, image: 'https://plus.unsplash.com/premium_photo-1664868839978-8fba95c0cdc1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Y2xvdGhpbmclMjBtb2RlbHxlbnwwfHwwfHx8MA%3D%3D', link: '#' },
    { id: 2, image: 'https://images.unsplash.com/photo-1619042220193-1764e5a87fce?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGNsb3RoaW5nJTIwbW9kZWx8ZW58MHx8MHx8fDA%3D', link: '#' },
    { id: 3, image: 'https://images.unsplash.com/photo-1607952108929-b87d6c9951e0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGNsb3RoaW5nJTIwbW9kZWx8ZW58MHx8MHx8fDA%3D', link: '#' },
    { id: 4, image: 'https://images.unsplash.com/photo-1656074166642-c1c22b309d9a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGNsb3RoaW5nJTIwbW9kZWx8ZW58MHx8MHx8fDA%3D', link: '#' },
    { id: 5, image: 'https://plus.unsplash.com/premium_photo-1664464228687-93c7a337de0a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGNsb3RoaW5nJTIwbW9kZWx8ZW58MHx8MHx8fDA%3D', link: '#' },
    { id: 6, image: 'https://images.unsplash.com/photo-1678884399113-0a2b079a31f5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGNsb3RoaW5nJTIwbW9kZWx8ZW58MHx8MHx8fDA%3D', link: '#' },
    { id: 7, image: 'https://images.unsplash.com/photo-1611912901957-80caca8de69a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y2xvdGhpbmclMjBtb2RlbHxlbnwwfHwwfHx8MA%3D%3D', link: '#' },
    { id: 8, image: 'https://plus.unsplash.com/premium_photo-1669704098815-dd3305204e6e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2xvdGhpbmclMjBtb2RlbHxlbnwwfHwwfHx8MA%3D%3D', link: '#' },
  ]);

  return (
    <div style={{ 
      padding: '40px 0',
      backgroundColor: '#fff',
      textAlign: 'center',
      overflow: 'hidden'
    }}>
      <h2 style={{
        fontSize: 'clamp(1.5rem, 5vw, 2rem)',
        fontWeight: '600',
        marginBottom: '30px',
        color: '#333'
      }}>Follow Us On Instagram</h2>
      
      {/* Marquee Container */}
      <div style={{ 
        width: '100%',
        overflow: 'hidden'
      }}>
        {/* Marquee Track - Triple the posts for perfect looping */}
        <div style={{
          display: 'flex',
          animation: 'slide 30s linear infinite',
          gap: 'clamp(15px, 3vw, 30px)',
          padding: '20px 0',
          width: 'max-content'
        }}>
          {[...posts, ...posts, ...posts].map((post, index) => (
            <a 
              key={`${post.id}-${index}`}
              href={post.link} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                position: 'relative',
                display: 'block',
                width: 'clamp(120px, 25vw, 200px)',
                height: 'clamp(120px, 25vw, 200px)',
                borderRadius: '50%',
                overflow: 'hidden',
                flexShrink: 0,
                transition: 'transform 0.3s ease'
              }}
            >
              <img 
                src={post.image} 
                alt={`Instagram post ${post.id}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              {/* Hover Overlay */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0,
                transition: 'opacity 0.3s ease',
                borderRadius: '50%'
              }}>
                <FiInstagram style={{
                  color: 'white',
                  fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                }} />
              </div>
            </a>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes slide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% / 3));
          }
        }
        
        a:hover div {
          opacity: 1 !important;
        }
        a:hover {
          transform: scale(1.05) !important;
        }
      `}</style>
    </div>
  );
};

export default Instagram;