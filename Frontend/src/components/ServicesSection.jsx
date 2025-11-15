import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ServicesSection = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
        duration: 0.5
      }
    }
  };

  const serviceItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const descriptionVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.95
    }
  };

  const [activeIndex, setActiveIndex] = React.useState(null);

  const toggleService = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Product categories data
  const categories = [
    {
      name: "Men",
      description: "Discover our premium collection of men's fashion designed for the modern man.",
      items: [
        "Casual & Formal Shirts",
        "T-Shirts & Polos",
        "Jeans & Trousers",
        "Suits & Blazers",
        "Activewear & Gym Clothing"
      ]
    },
    {
      name: "Women",
      description: "Explore our elegant women's collection featuring the latest trends and timeless classics.",
      items: [
        "Dresses & Jumpsuits",
        "Tops & Blouses",
        "Skirts & Leggings",
        "Professional Attire",
        "Seasonal Collections"
      ]
    },
    {
      name: "Kids",
      description: "Fun, comfortable, and durable clothing for children of all ages.",
      items: [
        "Baby Clothing (0-24 months)",
        "Toddler Outfits (2-4 years)",
        "Children's Fashion (5-12 years)",
        "School Uniforms",
        "Play & Special Occasion Wear"
      ]
    },
    {
      name: "Accessories",
      description: "Complete your look with our carefully curated selection of accessories.",
      items: [
        "Bags & Backpacks",
        "Jewelry & Watches",
        "Hats & Caps",
        "Belts & Wallets",
        "Sunglasses & Eyewear"
      ]
    },
    {
      name: "Footwear",
      description: "Step out in style with our diverse range of footwear for every occasion.",
      items: [
        "Casual Shoes & Sneakers",
        "Formal & Dress Shoes",
        "Boots & Outdoor Footwear",
        "Sandals & Flip-Flops",
        "Sports & Athletic Shoes"
      ]
    }
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans&family=Syne:wght@400..800&display=swap');

        html {
          overflow-x: hidden;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          text-decoration: none;
          font-family: 'DM Sans', sans-serif;
        }

        body {
          background-color: #ffffff;
        }

        .containers {
          width: 100%;
          display: flex;
          justify-content: space-between;
          gap: 30px;
          padding: 10px 12%;
        }

        .service_wrapper {
          display: flex;
          gap: 30px;
          width: 100%;
        }

        .service_wrapper .contents {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 50%;
        }

        .service_wrapper .contents .title {
          font-size: 1.6rem;
          text-transform: uppercase;
          background: linear-gradient(90deg, #ff7d61 0%, #ffd859 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 600;
        }

        .service_wrapper .contents h3 {
          font-size: 3.8rem;
          color: #000;
          line-height: 4.5rem;
        }

        .service_wrapper .contents p {
          color: #333;
          margin: 10px 0;
        }

        .buttons {
          display: flex;
          gap: 10px;
        }

        .sen {
          width: 200px;
          height: 200px;
          font-size: 20px;
          font-weight: 600;
          background-color: #ffd859;
          border-radius: 50%;
          border: 0.5px solid #ffd859;
          transition: 0.6s;
          cursor: pointer;
          z-index: 10;
          position: relative;
          color: #000;
          outline: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .contact-btn {
          padding-right: 30px; /* Moves text slightly to the left */
        }

        .sen::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          transition: 0.6s;
          z-index: -1;
          background-color: #fff;
        }

        .sen:hover:after {
          width: 100%;
          height: 100%;
        }

        .sen:nth-of-type(2)::after {
          background-color: #ffd859;
          color: #000;
          z-index: -1;
        }

        .sen:nth-of-type(2):hover::after {
          width: 100%;
          height: 100%;
        }

        .sen:nth-of-type(2) {
          background-color: #f0f0f0;
          margin-left: -80px;
          color: #000;
          border-color: #f0f0f0;
        }

        .sen:nth-of-type(2):hover {
          color: #000;
          border-color: #ffd859;
        }

        .service_conaner {
          display: flex;
          flex-direction: column;
          width: 50%;
        }

        .service_conaner .service {
          display: flex;
          flex-direction: column;
          width: 100%;
        }

        .service_conaner .service .service_Title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          padding: 32px 0px;
          border-bottom: 0.2px solid #999;
          transition: 1s;
        }

        .service_conaner .service .service_Title h2 {
          font-size: 35px;
          letter-spacing: 0.6px;
          color: #000;
          font-weight: 500;
        }

        .ActiveHeading {
          background: linear-gradient(90deg, #ff7d61 0%, #ffdb59 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .service_conaner .service .service_Title svg {
          transition: transform 0.3s ease;
        }

        .service_conaner .service .service_Title.active svg {
          transform: rotate(45deg);
        }

        .service_description {
          display: flex;
          flex-direction: column;
          gap: 10px;
          overflow: hidden;
        }

        .service_description p {
          font-size: 18px;
          font-weight: 500;
          color: #333;
        }

        .service_description ul {
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: 20px;
        }

        .service_description ul li {
          font-size: 18px;
          color: #000;
          list-style-type: none;
          position: relative;
          padding-left: 20px;
        }

        .service_description ul li:before {
          content: "•";
          color: #ff7d61;
          font-size: 20px;
          position: absolute;
          left: 0;
        }

        .sider {
          display: flex;
          align-items: center;
          max-width: 100vw;
          overflow: hidden;
          margin-top: 40px;
        }

        .sider h1 {
          font-size: 7rem;
          font-weight: 700;
          color: #000;
          animation: slide 80s infinite linear;
          text-transform: uppercase;
          font-family: 'Syne', sans-serif;
          white-space: nowrap;
        }

        .sider h1 span {
          -webkit-text-stroke-width: 2px;
          -webkit-text-stroke-color: #000;
          color: transparent;
          letter-spacing: 3px;
        }

        @keyframes slide {
          0% {
            transform: translateX(0);
          }

          100% {
            transform: translateX(-100%);
          }
        }

        /* Responsive Breakpoints */
        @media (max-width: 1500px) {
          .containers {
            margin-top: 0;
          }
        }

        @media (max-width: 1400px) {
          .containers {
            margin-top: 0;
            padding: 30px 12%;
          }

          .sider {
            padding: 30px 0;
          }
        }

        @media (max-width: 1100px) {
          .service_wrapper {
            flex-direction: column;
          }

          .service_wrapper .contents {
            width: 100%;
          }

          .service_conaner {
            width: 100%;
            margin-top: 50px;
          }
        }

        @media (max-width: 768px) {
          .containers {
            padding: 1px 5% !important;
          }

          .service_wrapper .contents h3 {
            font-size: 2.5rem !important;
            line-height: 3.2rem !important;
          }

          .service_conaner .service .service_Title h2 {
            font-size: 24px !important;
            line-height: 1.3;
          }

          .service_description p,
          .service_description li {
            font-size: 16px !important;
          }

          .sider h1 {
            font-size: 3rem !important;
            -webkit-text-stroke-width: 1px !important;
            white-space: nowrap;
          }

          .service_wrapper .content {
            gap: 20px;
          }

          .buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 50px;
          }

          .sen {
            width: 120px;
            height: 120px;
            font-size: 14px;
          }
          
          .contact-btn {
            padding-right: 5px;
          }
        }
      `}</style>

      <motion.div 
        className="containers"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="service_wrapper">
          <motion.div className="contents" variants={itemVariants}>
            <motion.p className="title" variants={itemVariants}>SHOP BY CATEGORY</motion.p>
            <motion.h3 variants={itemVariants}>Discover Our<br />Premium Collections</motion.h3>
            <motion.p variants={itemVariants}>
              Explore our wide range of high-quality fashion products for men, women, and kids. 
              From casual wear to formal attire, we have everything you need to express your unique style.
            </motion.p>
            <motion.div className="buttons" variants={itemVariants}>
              <motion.button 
                className="sen contact-btn" 
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => window.location.href = '/shop'}
              >
                Shop         
              </motion.button>
              <motion.button 
                className="sen" 
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => window.location.href = '/shop'}
              >
                Now
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div className="service_conaner" variants={containerVariants}>
            {categories.map((category, idx) => (
              <motion.div 
                className="service" 
                key={idx}
                variants={serviceItemVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div 
                  className={`service_Title ${activeIndex === idx ? 'active' : ''}`}
                  onClick={() => toggleService(idx)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <h2 className={activeIndex === idx ? 'ActiveHeading' : ''}>{category.name}</h2>
                  <motion.svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    height="24px" 
                    viewBox="0 -960 960 960" 
                    width="24px" 
                    fill="#000000"
                    animate={{ rotate: activeIndex === idx ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/>
                  </motion.svg>
                </motion.div>
                <AnimatePresence>
                  {activeIndex === idx && (
                    <motion.div
                      className="service_description"
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={descriptionVariants}
                    >
                      <p>{category.description}</p>
                      <ul>
                        {category.items.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <div className="sider">
        <h1>
          Fashion For Everyone <span>Style For Every Occasion </span>
          Quality You Can Trust <span>Shop With Confidence </span>
        </h1>
        <h1>
          Fashion For Everyone <span>Style For Every Occasion </span>
          Quality You Can Trust <span>Shop With Confidence </span>
        </h1>
      </div>
    </>
  );
};

export default ServicesSection;