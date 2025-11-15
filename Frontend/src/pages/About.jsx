import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from '../context/ShopContext';
import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import img from '../assets/re.png';
import img1 from '../assets/43160.jpg';

// Enhanced animated component with parallax effects
const AnimatedSection = ({ children, delay = 0, yOffset = 30 }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  React.useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);

  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: yOffset },
        visible: {
          opacity: 1,
          y: 0,
          transition: { 
            duration: 0.8, 
            ease: [0.6, -0.05, 0.01, 0.99], 
            delay,
            staggerChildren: 0.1
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
};

// Floating orb with enhanced physics
const FloatingOrb = ({ color, size, initialX, initialY }) => {
  const x = useMotionValue(initialX);
  const y = useMotionValue(initialY);
  const rotate = useMotionValue(0);
  
  useEffect(() => {
    const float = () => {
      x.set(x.get() + (Math.random() * 2 - 1));
      y.set(y.get() + (Math.random() * 2 - 1));
      rotate.set(rotate.get() + (Math.random() * 4 - 2));
      requestAnimationFrame(float);
    };
    float();
    return () => cancelAnimationFrame(float);
  }, []);

  return (
    <motion.div
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle at 30% 30%, ${color}, transparent 70%)`,
        filter: "blur(10px)",
        opacity: 0.6,
        zIndex: -1,
        x,
        y,
        rotate
      }}
    />
  );
};

// Enhanced glow effect with animation
const Glow = ({ color = "#1E3A5F", size = 300, blur = 100, opacity = 0.3, style }) => (
  <motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity }}
    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
    style={{
      position: "absolute",
      width: size,
      height: size,
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      filter: `blur(${blur}px)`,
      opacity,
      zIndex: -1,
      ...style
    }} 
  />
);

// Interactive holographic card
const HolographicCard = ({ children }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div 
      style={{ 
        position: "relative",
        overflow: "hidden"
      }}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        style={{
          perspective: 1000,
          transformStyle: "preserve-3d"
        }}
      >
        <motion.div
          style={{
            rotateX,
            rotateY,
            transition: "transform 0.1s"
          }}
        >
          {children}
        </motion.div>
      </motion.div>
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, 
    #1E3A5F, transparent 30%)`,
          pointerEvents: "none",
          zIndex: 2
        }}
      />
    </div>
  );
};

// Particle explosion effect
const ParticleExplosion = ({ trigger, color = "#1E3A5F" }) => {
  const particles = Array(20).fill(0);
  
  return (
    <div style={{ position: "relative", width: 0, height: 0 }}>
      {particles.map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={trigger ? {
            opacity: [1, 0],
            scale: [0.5, 1.5],
            x: Math.cos((i / particles.length) * Math.PI * 2) * 100,
            y: Math.sin((i / particles.length) * Math.PI * 2) * 100,
            transition: {
              duration: 1,
              ease: "easeOut"
            }
          } : {}}
          style={{
            position: "absolute",
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: color,
            opacity: 0.7
          }}
        />
      ))}
    </div>
  );
};

const About = () => {
  const { backendUrl } = useContext(ShopContext);
  const [explode, setExplode] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);


const [stats, setStats] = useState({
  productCount: 0,
  userCount: 0
});
const [statsLoading, setStatsLoading] = useState(true);

// Fetch statistics from your API
useEffect(() => {
  const fetchStats = async () => {
    try {
      // Use the same pattern as in Hero component
      const productsResponse = await fetch(`${backendUrl}/api/product/count`);
      const productsData = await productsResponse.json();
      
      const usersResponse = await fetch(`${backendUrl}/api/user/count`);
      const usersData = await usersResponse.json();
      
      if (productsData.success && usersData.success) {
        setStats({
          productCount: productsData.count,
          userCount: usersData.count
        });
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
      // Set fallback values like in the Hero component
      setStats({
        productCount: 1250,
        userCount: 8500
      });
    } finally {
      setStatsLoading(false);
    }
  };

  fetchStats();
}, [backendUrl]);

  // Format numbers with proper suffixes
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M+';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k+';
    }
    return num.toString();
  };

  // Handle shop now button click
  const handleShopNow = () => {
    navigate('/shop');
  };

  // Handle contact us button click
  const handleContactUs = () => {
    navigate('/contact');
  };

  // Handle browse products button click
  const handleBrowseProducts = () => {
    navigate('/shop');
  };

  // Handle sign up for deals button click
  const handleSignUpForDeals = () => {
    navigate('/login');
  };

  // Handle category button click
  const handleCategoryClick = (category) => {
    navigate(`/shop?category=${category.toLowerCase()}`);
  };

   return (
    <div style={{
      maxWidth: "1400px",
      margin: "0 auto",
      padding: "2rem 1rem",
      marginTop: "-6rem",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      lineHeight: 1.6,
      color: "#2C2C2C", // Charcoal text
      position: "relative",
      overflow: "hidden",
      minHeight: "100vh",
      backgroundColor: "#FFFFFF" // White background
    }}>
      {/* Background elements */}
      <FloatingOrb color="#1E3A5F" size={300} initialX={-100} initialY={100} />
      <FloatingOrb color="#4A5D23" size={200} initialX="80%" initialY={300} />
      <FloatingOrb color="#1E3A5F" size={150} initialX="30%" initialY={600} />

      {/* Hero Section */}
      <section style={{
        position: "relative",
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        marginBottom: "8rem",
        padding: "4rem 0"
      }}>
        <Glow color="#1E3A5F" size={800} blur={150} opacity={0.2} style={{ left: "-20%", top: "20%" }} />
        <Glow color="#4A5D23" size={600} blur={120} opacity={0.15} style={{ right: "-15%", bottom: "10%" }} />

        <div style={{
          display: 'flex',
          flexWrap: isMobile ? 'wrap' : 'nowrap',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '4rem',
          position: "relative",
          zIndex: 1,
          width: '100%'
        }}>
          {/* Image on the Left */}
          <AnimatedSection delay={0.1} yOffset={50}>
            <HolographicCard>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                style={{
                  flex: "0 0 45%",
                  minWidth: '200px',
                  position: 'relative',
                  borderRadius: '2rem',
                  overflow: 'hidden',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
                  transformStyle: "preserve-3d"
                }}
              >
                <motion.img
                  src={img}
                  alt="Featured Product"
                  style={{
                    width: "100%",
                    height: 'auto',
                    display: 'block',
                  }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '10px'
                  }}
                >
                  {explode && <ParticleExplosion trigger={explode} />}
                </motion.div>
              </motion.div>
            </HolographicCard>
          </AnimatedSection>

          {/* Text on the Right */}
          <AnimatedSection delay={0.3}>
            <div style={{
              flex: "0 0 50%",
              minWidth: '300px',
              padding: '0 1rem'
            }}>
              <motion.h4
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                style={{
                  color: '#2C2C2C', // Charcoal
                  letterSpacing: '4px',
                  textTransform: 'uppercase',
                  fontSize: '0.875rem',
                  marginBottom: '1rem',
                  fontWeight: 600
                }}
              >
                Honey Online Shopping
              </motion.h4>

              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{
                  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                  fontWeight: 800,
                  margin: '0.5rem 0 1.5rem',
                  lineHeight: 1.2,
                  background: 'linear-gradient(90deg, #2C2C2C, #1E3A5F)', // Charcoal to Navy
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent'
                }}
              >
                Discover <motion.span
                  style={{ display: "inline-block", color: '#2C2C2C' }} // Charcoal
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity
                  }}
                >
                  Exceptional
                </motion.span> Products
              </motion.h2>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                style={{
                  color: '#2C2C2C', // Charcoal
                  fontSize: '1.125rem',
                  marginBottom: '2.5rem',
                  maxWidth: '500px'
                }}
              >
                ShopNest brings you the finest selection of curated products with <motion.span
                  style={{
                    display: "inline-block",
                    fontWeight: 600,
                    color: "#1E3A5F" // Navy
                  }}
                  animate={{
                    textShadow: [
                      "0 0 0px rgba(30, 58, 95, 0)",
                      "0 0 10px rgba(30, 58, 95, 0.3)",
                      "0 0 0px rgba(30, 58, 95, 0)"
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity
                  }}
                >
                  fast delivery
                </motion.span> and exceptional customer service.
              </motion.p>

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                style={{
                  display: 'flex',
                  gap: '1.5rem',
                  flexWrap: 'wrap'
                }}
              >
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: '0 10px 20px rgba(30, 58, 95, 0.2)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  onHoverStart={() => setIsHovering(true)}
                  onHoverEnd={() => setIsHovering(false)}
                  onClick={handleShopNow}
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    padding: '1rem 2.25rem',
                    fontSize: '1rem',
                    background: '#1E3A5F', // Navy
                    color: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    fontWeight: 600,
                    letterSpacing: '0.5px'
                  }}
                >
                  <span style={{ position: "relative", zIndex: 2 }}>Shop Now</span>
                  <motion.div
                    style={{
                      position: "absolute",
                      top: "-50%",
                      left: "-50%",
                      width: "200%",
                      height: "200%",
                      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                      transform: "rotate(45deg)"
                    }}
                    animate={{
                      left: isHovering ? ["-50%", "150%"] : "150%",
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                </motion.button>

                <motion.button
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: '#F5F5F5' // Soft Gray
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleContactUs}
                  style={{
                    padding: '1rem 2.25rem',
                    background: 'white',
                    color: '#1E3A5F', // Navy
                    border: '2px solid #1E3A5F', // Navy
                    borderRadius: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <span>Contact Us</span>
                  <motion.span
                    animate={{
                      x: [0, 5, 0],
                      transition: {
                        repeat: Infinity,
                        duration: 2
                      }
                    }}
                  >
                    →
                  </motion.span>
                </motion.button>
              </motion.div>

              {/* Stats */}
              <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          style={{
            display: 'flex',
            gap: '2rem',
            marginTop: '3rem',
            flexWrap: 'wrap'
          }}
        >
          {[
            { value: formatNumber(stats.productCount), label: "Products", emoji: "🛍️" },
            { value: formatNumber(stats.userCount), label: "Customers", emoji: "👥" },
            { value: "24h", label: "Delivery", emoji: "⚡" }
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              style={{
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <motion.div
                style={{
                  fontSize: '2rem',
                  marginBottom: '0.5rem'
                }}
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {stat.emoji}
              </motion.div>
              <motion.div
                style={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: '#1E3A5F',
                  marginBottom: '0.25rem'
                }}
              >
                {stat.value}
              </motion.div>
              <div style={{
                color: '#6b7280',
                fontSize: '0.875rem',
                fontWeight: 500
              }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Values Section */}
      <AnimatedSection>
        <section style={{ 
          textAlign: 'center',
          marginBottom: '8rem',
          position: "relative"
        }}>
          <Glow color="#1E3A5F" size={600} blur={120} opacity={0.15} style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }} />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.h2 
              style={{ 
                fontSize: 'clamp(2rem, 5vw, 3rem)', 
                fontWeight: 800, 
                marginBottom: '1.5rem',
                color: '#1E3A5F' // Navy
              }}
            >
              Why Shop With Us
            </motion.h2>
            <motion.p 
              style={{ 
                color: '#4a5568',
                maxWidth: '700px',
                margin: '0 auto 4rem',
                fontSize: '1.125rem'
              }}
            >
              We're committed to providing an exceptional shopping experience from start to finish.
            </motion.p>
          </motion.div>
          
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '2rem',
            justifyContent: 'center',
            position: "relative",
            zIndex: 1
          }}>
            {[
              { 
                title: "Fast Shipping", 
                icon: "🚚", 
                desc: "Get your orders delivered in record time with our express shipping options",
                color: "#1E3A5F" // Navy
              },
              { 
                title: "Secure Checkout", 
                icon: "🔒", 
                desc: "Your payment information is protected with bank-level security", 
                color: "#2C2C2C" // Charcoal
              },
              { 
                title: "24/7 Support", 
                icon: "💬", 
                desc: "Our customer service team is always ready to assist you", 
                color: "#1E3A5F" // Navy
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ 
                  y: -10,
                  boxShadow: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`
                }}
                style={{
                  background: 'white',
                  padding: '2.5rem 2rem',
                  borderRadius: '1.5rem',
                  flex: '1 1 250px',
                  maxWidth: '300px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
                  border: '1px solid rgba(0,0,0,0.03)',
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                <Glow color={value.color} size={200} blur={80} opacity={0.2} style={{ 
                  top: 0, 
                  left: 0,
                  transform: "translate(-50%, -50%)"
                }} />
                <div style={{
                  fontSize: '3rem',
                  marginBottom: '1.5rem',
                  textShadow: `0 5px 10px rgba(0,0,0,0.1)`
                }}>
                  {value.icon}
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  marginBottom: '1rem',
                  color: '#1f2937'
                }}>
                  {value.title}
                </h3>
                <p style={{
                  color: '#6b7280',
                  fontSize: '1rem',
                  lineHeight: 1.6
                }}>
                  {value.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      </AnimatedSection>

      {/* Featured Categories Section */}
      <AnimatedSection>
        <section style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "4rem",
          marginBottom: "8rem",
          position: "relative"
        }}>
          <Glow color="#1E3A5F" size={600} blur={120} opacity={0.15} style={{ left: "-10%", top: "30%" }} />
          
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              flex: 1,
              minWidth: "300px",
              padding: '0 1rem',
              position: "relative",
              zIndex: 1
            }}
          >
            <motion.div
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.h4 
                style={{ 
                  color: '#1E3A5F', // Navy
                  letterSpacing: '3px', 
                  textTransform: 'uppercase',
                  fontSize: '0.875rem',
                  marginBottom: '1rem'
                }}
              >
                Explore Collections
              </motion.h4>
              <motion.h2 
                style={{ 
                  fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', 
                  fontWeight: 800, 
                  marginBottom: "1.5rem",
                  color: '#1f2937',
                  lineHeight: 1.3
                }}
              >
                Shop By Category
              </motion.h2>
              <motion.p 
                style={{ 
                  marginBottom: "2rem",
                  color: '#4a5568',
                  fontSize: '1.125rem',
                  lineHeight: 1.7
                }}
              >
                Discover our carefully curated collections designed to meet your every need and elevate your lifestyle.
              </motion.p>
            </motion.div>
            
            <motion.div
              style={{
                display: 'flex',
                gap: '1rem',
                marginTop: '2rem',
                flexWrap: 'wrap',
                cursor: 'default'
              }}
            >
              {[
                { name: "Men", icon: "👔" },
                { name: "Women", icon: "👗" },
                { name: "Kids", icon: "👶" },
                { name: "Tool", icon: "🛠️" },
                { name: "Eats", icon: "🍔" },
              ].map((category, i) => (
                <motion.div
                  key={i}
                  whileHover={{ 
                    scale: 1.05,
                    backgroundColor: '#F5F5F5' // Soft Gray
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCategoryClick(category.name)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'white',
                    color: '#1E3A5F', // Navy
                    border: '2px solid #1E3A5F', // Navy
                    borderRadius: '12px',
                    fontWeight: 600,
                    cursor: 'default',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <span>{category.icon}</span>
                  {category.name}
                </motion.div>
              ))}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              style={{
                backgroundColor: '#F5F5F5', // Soft Gray
                padding: '1.5rem',
                borderRadius: '1rem',
                marginTop: '3rem',
                borderLeft: '4px solid #1E3A5F' // Navy
              }}
            >
              <h4 style={{
                color: '#1E3A5F', // Navy
                marginTop: 0,
                marginBottom: '0.75rem',
                fontSize: '1rem',
                fontWeight: 600
              }}>
                NEW ARRIVALS
              </h4>
              <p style={{
                margin: 0,
                color: '#4a5568',
                fontSize: '1rem'
              }}>
                Check out our latest products just added to the collection this week.
              </p>
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{
              flex: 1,
              minWidth: "300px",
              position: 'relative',
              borderRadius: '2rem',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
              zIndex: 1
            }}
          >
            <motion.img 
              src={img1}
              alt="Product Categories" 
              style={{ 
                width: "100%",
                height: 'auto',
                display: 'block',
              }}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
        </section>
      </AnimatedSection>

      {/* How It Works Section */}
      <AnimatedSection>
        <section style={{ 
          marginBottom: '8rem',
          position: "relative"
        }}>
          <Glow color="#1E3A5F" size={800} blur={150} opacity={0.1} style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }} />
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              textAlign: 'center',
              marginBottom: '4rem'
            }}
          >
            <motion.h2 
              style={{ 
                fontSize: 'clamp(2rem, 5vw, 3rem)', 
                fontWeight: 800, 
                marginBottom: '1.5rem',
                color: '#1E3A5F' // Navy
              }}
            >
              How Shopping With Us Works
            </motion.h2>
            <motion.p 
              style={{ 
                color: '#4a5568',
                maxWidth: '700px',
                margin: '0 auto',
                fontSize: '1.125rem'
              }}
            >
              A seamless shopping experience in just a few simple steps.
            </motion.p>
          </motion.div>
          
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '2rem',
            justifyContent: 'center',
            position: "relative",
            zIndex: 1
          }}>
            {[
              {
                title: "Browse",
                desc: "Explore our extensive catalog of premium products",
                icon: "🔍",
                color: "#1E3A5F" // Navy
              },
              {
                title: "Select",
                desc: "Choose your favorite items and add to cart",
                icon: "🛒",
                color: "#4A5D23" // Olive Green
              },
              {
                title: "Checkout",
                desc: "Fast and secure payment process",
                icon: "💳",
                color: "#2C2C2C" // Charcoal
              },
              {
                title: "Receive",
                desc: "Get your order delivered to your doorstep",
                icon: "📦",
                color: "#1E3A5F" // Navy
              },
              {
                title: "Enjoy",
                desc: "Experience premium quality products",
                icon: "😊",
                color: "#4A5D23" // Olive Green
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`
                }}
                style={{
                  background: 'white',
                  padding: '2rem',
                  borderRadius: '1.5rem',
                  flex: '1 1 200px',
                  maxWidth: '220px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
                  border: '1px solid rgba(0,0,0,0.03)',
                  textAlign: 'center',
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                <motion.div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '5px',
                    background: step.color
                  }}
                />
                <motion.div
                  style={{
                    fontSize: '2.5rem',
                    marginBottom: '1.5rem',
                    textShadow: `0 5px 10px rgba(0,0,0,0.1)`
                  }}
                >
                  {step.icon}
                </motion.div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  marginBottom: '0.75rem',
                  color: '#1f2937'
                }}>
                  {step.title}
                </h3>
                <p style={{
                  color: '#6b7280',
                  fontSize: '0.95rem',
                  lineHeight: 1.6,
                  margin: 0
                }}>
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      </AnimatedSection>

      {/* Testimonials Section */}
      <AnimatedSection>
  <section style={{ 
    marginBottom: '8rem',
    position: "relative",
    padding: '0 1rem'
  }}>
    <Glow color="#1E3A5F" size={600} blur={120} opacity={0.15} style={{ left: "50%", top: "30%", transform: "translate(-50%, -50%)" }} />
    
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      style={{
        textAlign: 'center',
        marginBottom: '4rem',
        padding: '0 1rem'
      }}
    >
      <motion.h2 
        style={{ 
          fontSize: 'clamp(2rem, 5vw, 3rem)', 
          fontWeight: 800, 
          marginBottom: '1.5rem',
          color: '#1E3A5F' // Navy
        }}
      >
        What Our Customers Say
      </motion.h2>
      <motion.p 
        style={{ 
          color: '#4a5568',
          maxWidth: '700px',
          margin: '0 auto',
          fontSize: 'clamp(1rem, 2vw, 1.125rem)'
        }}
      >
        Don't just take our word for it - hear from our satisfied customers.
      </motion.p>
    </motion.div>
    
    <div style={{ 
      position: 'relative',
      maxWidth: '1000px',
      margin: '0 auto',
    }}>
      {[
        {
          quote: "The fastest delivery I've ever experienced! My order arrived the next day and the quality exceeded my expectations.",
          author: "Sarah J.",
          role: "Loyal Customer",
          icon: "⭐️⭐️⭐️⭐️⭐️"
        },
        {
          quote: "I was hesitant to order online but their customer service team made the process so easy. Will definitely shop here again!",
          author: "Michael T.",
          role: "First-time Buyer",
          icon: "⭐️⭐️⭐️⭐️⭐️"
        },
        {
          quote: "The packaging was so thoughtful and the product was even better than pictured. 10/10 would recommend!",
          author: "Emma L.",
          role: "Frequent Shopper",
          icon: "⭐️⭐️⭐️⭐️⭐️"
        },
        {
          quote: "Their return policy gave me peace of mind, but I didn't need it because I loved everything I ordered!",
          author: "David K.",
          role: "Satisfied Customer",
          icon: "⭐️⭐️⭐️⭐️⭐️"
        }
      ].map((testimonial, index) => (
        <motion.div 
          key={index}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 + index * 0.15 }}
          style={{ 
            display: 'flex', 
            justifyContent: index % 2 === 0 ? 'flex-start' : 'flex-end', 
            marginBottom: '3rem',
            position: 'relative',
            padding: '0 1rem'
          }}
        >
          <motion.div
            whileHover={{ 
              y: -5,
              boxShadow: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`
            }}
            style={{ 
              background: 'white',
              padding: '1.5rem',
              borderRadius: '1rem',
              width: 'calc(100% - 2rem)',
              maxWidth: '500px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
              position: 'relative',
              border: '1px solid rgba(0,0,0,0.03)'
            }}
          >
            <div style={{
              fontSize: '1.25rem',
              marginBottom: '1rem'
            }}>
              {testimonial.icon}
            </div>
            <p style={{
              color: '#4a5568',
              fontStyle: 'italic',
              marginBottom: '1.25rem',
              lineHeight: 1.6,
              fontSize: 'clamp(0.9rem, 2vw, 1rem)'
            }}>
              "{testimonial.quote}"
            </p>
            <div>
              <div style={{
                fontWeight: 700,
                color: '#1f2937',
                fontSize: '1rem'
              }}>
                {testimonial.author}
              </div>
              <div style={{
                color: '#6b7280',
                fontSize: '0.875rem'
              }}>
                {testimonial.role}
              </div>
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  </section>
</AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection>
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ 
            textAlign: 'center', 
            background: 'linear-gradient(135deg, #1E3A5F, #4A5D23)', // Navy to Olive Green
            padding: '5rem 2rem', 
            borderRadius: '2rem', 
            color: '#fff', 
            marginBottom: '4rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            position: "relative",
            overflow: "hidden"
          }}
        >
          <Glow color="#2C5F8F" size={800} blur={150} opacity={0.3} style={{ top: "-50%", left: "50%", transform: "translateX(-50%)" }} />
          <Glow color="#6A8F23" size={600} blur={120} opacity={0.2} style={{ bottom: "-50%", right: "20%" }} />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{
              position: "relative",
              zIndex: 1
            }}
          >
            <motion.h2 
              style={{ 
                fontSize: 'clamp(2rem, 5vw, 3rem)', 
                fontWeight: 800, 
                marginBottom: '1.5rem',
                lineHeight: 1.2
              }}
            >
              Ready to Start Shopping?
            </motion.h2>
            <motion.p 
              style={{ 
                maxWidth: '600px', 
                margin: '0 auto 3rem',
                fontSize: '1.25rem',
                opacity: 0.9
              }}
            >
              Join thousands of happy customers who trust us for quality products and exceptional service.
            </motion.p>
            <motion.div
              style={{
                display: 'flex',
                gap: '1.5rem',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}
            >
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 15px 30px rgba(0,0,0,0.2)'
                }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBrowseProducts}
                style={{
                  padding: '1rem 2.5rem',
                  fontSize: '1.125rem',
                  background: '#fff',
                  color: '#1E3A5F', // Navy
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2)',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                <motion.span
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    transition: { 
                      repeat: Infinity, 
                      duration: 2 
                    } 
                  }}
                >
                  🛍️
                </motion.span>
                Browse Products
              </motion.button>
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSignUpForDeals}
                style={{
                  padding: '1rem 2.5rem',
                  fontSize: '1.125rem',
                  background: 'transparent',
                  color: '#fff',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                <motion.span
                  animate={{ 
                    x: [0, 5, 0],
                    transition: { 
                      repeat: Infinity, 
                      duration: 2 
                    } 
                  }}
                >
                  ✉️
                </motion.span>
                Sign Up for Deals
              </motion.button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              style={{
                display: 'flex',
                gap: '2rem',
                justifyContent: 'center',
                marginTop: '3rem',
                flexWrap: 'wrap'
              }}
            >
              {[
                { icon: "👌🏽", text: "Best Quality" },
                { icon: "💯", text: "100% Satisfaction Guarantee" },
                { icon: "🔒", text: "Secure Checkout" }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -3 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'rgba(255,255,255,0.1)',
                    padding: '0.5rem 1rem',
                    borderRadius: '50px',
                    backdropFilter: 'blur(5px)'
                  }}
                >
                  <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                  <span style={{ fontWeight: 500 }}>{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.section>
      </AnimatedSection>
    </div>
  );
};

export default About;