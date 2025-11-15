import React, { useContext, useEffect, useState } from "react";
import { FaUser, FaStar, FaFire, FaPlus } from "react-icons/fa";
import { motion } from "framer-motion";
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import Hero1 from '../assets/ChatGPT Image Aug 27, 2025, 03_27_31 AM.png';

// Image imports
import nike from "../assets/nike.png";
import adidas from "../assets/Adidas.png";
import puma from "../assets/puma.png";
import reebok from "../assets/reebok.png";
import redbull from "../assets/redbull.png";
import dp1 from "../assets/dp1.jpeg";
import dp2 from "../assets/dp2.jpeg";
import dp3 from "../assets/dp3.jpeg";
import dp4 from "../assets/dp4.webp";
import chart from "../assets/bar-chart-grouped.svg";

const Hero = () => {
  const { backendUrl } = useContext(ShopContext);
  const [productCount, setProductCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch product count
  useEffect(() => {
    const fetchProductCount = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/product/count`);
        if (response.data.success) {
          setProductCount(response.data.count);
        }
      } catch (error) {
        console.error("Failed to fetch product count:", error);
        setProductCount(205);
      } finally {
        setLoading(false);
      }
    };
    fetchProductCount();
  }, [backendUrl]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } }
  };
  const titleVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }
  };
  const descriptionVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { delay: 0.3, duration: 0.8, ease: "easeOut" } }
  };
  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)", transition: { duration: 0.3 } },
    tap: { scale: 0.95 }
  };
  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 10, delay: 0.5 } },
    hover: { y: -10, transition: { duration: 0.3 } }
  };
  const brandVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1 + 0.8, duration: 0.5 } }),
    hover: { y: -5, transition: { duration: 0.2 } }
  };
  const chartVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { delay: 1, duration: 0.8 } },
    hover: { scale: 1.05, backgroundColor: "rgba(0, 0, 0, 0.5)", transition: { duration: 0.3 } }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Ubuntu', sans-serif; padding: 10px; }
        main { position: relative; }
        .container {
          background-image: url(${Hero1});
          height: 625px;
          background-size: cover;
          background-repeat: no-repeat;
          border-radius: 15px 15px 15px 0;
          position: relative;
          display: flex;
        }
        .container::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 100%; height: 100%;
          background: linear-gradient(to bottom, #fff 100%);
          mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 350 120"><path fill="white" d="M325.04,100.01v-33.73c0-4.3-3.49-7.79-7.79-7.79h-117.45c-4.3,0-7.79-3.49-7.79-7.79v-27.97c0-4.3-3.49-7.79-7.79-7.79H20.44C.45,14.94,0,10.36,0,0h0v120h350c-18.81,0-24.96-2.09-24.96-19.99Z"/></svg>');
          mask-size: 40rem;
          mask-position: bottom left;
          mask-repeat: no-repeat;
        }
        .info {
          width: 400px;
          margin-left: 30px;
          position: relative;
          top: 15%;
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: -10px;
        }
        .title { color: #fff; font-size: 62px; }
        .description { color: gainsboro; line-height: 1.5; }
        .btns {
          position: absolute;
          left: 30px;
          bottom: 19%;
          z-index: 2;
          display: flex;
          gap: 20px;
          justify-content: flex-start;
          width: auto;
        }
        .start, .contact {
          border: none;
          padding: 15px 25px;
          border-radius: 100px;
          font-size: 15px;
          font-family: 'Ubuntu';
          cursor: pointer;
        }
        .start { background-color: #000; color: #fff; }
        .contact { border: 2px solid #000; background: none; font-weight: 500; }
        .brands {
          position: absolute;
          display: flex;
          flex-direction: column;
          bottom: 5px;
          left: 1%;
          gap: 15px;
        }
        .brand_icons { display: flex; gap: 30px; }
        .brand_icons img { width: 80px; object-fit: contain; }
        .card_wrapper { position: absolute; filter: drop-shadow(0 0 2px #fff); }
        .card {
          width: 200px; height: 100px;
          background-color: rgba(0, 0, 0, 0.7);
          border-radius: 0 30px 30px 20px;
          position: relative;
        }
        .card_one { top: 100px; right: 450px; }
        .card_two { bottom: 100px; right: 60px; }
        .user_icons { position: absolute; display: flex; top: 8px; left: 55px; }
        .user_icon {
          width: 25px; height: 25px;
          border-radius: 50%;
          border: 1px solid #fff;
          overflow: hidden;
          margin-left: -4px;
        }
        .user_icon img { width: 100%; height: 100%; object-fit: cover; }
        .text { position: absolute; bottom: 10px; left: 18px; display: flex; flex-direction: column; color: #fff; gap: 5px; }
        .text p { margin: 0; }
        .card_icon {
          width: 30px; height: 30px;
          border-radius: 50%;
          top: 2px; left: 2px;
          position: absolute;
          background-color: rgba(0, 0, 0, 0.5);
          color: #fff; display: flex;
          align-items: center; justify-content: center;
          font-size: 14px;
        }
        .chart {
          position: absolute;
          bottom: 150px; left: 600px;
          width: 190px;
          background-color: rgba(0, 0, 0, 0.35);
          padding: 15px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
        }
        .chart_top { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .chart_middle img { width: 100%; filter: invert(1); }
        .chart_bottom { text-align: center; margin-top: 5px; }

        @media (max-width: 1000px) {
          .card_one, .card_two { display: none; }
          .chart { display: none; }
        }
        @media (max-width: 576px) {
          .title { font-size: 42px; }
          .brand_icons img { width: 45px; }
          .brands { padding-top: -20px; }
          .btns {
            flex-direction: row;   /* keep in row */
            gap: 10px;
            width: auto;           /* don’t stretch */
          }
          .start,
          .contact {
            padding: 14px 40px;     /* smaller padding */
            font-size: 13px;       /* shrink text */
          }
        }
      `}</style>

      <motion.main initial="hidden" animate="visible" variants={containerVariants}>
        <div className="container">
          <div className="info">
            <motion.h1 className="title" variants={titleVariants}>
              Style That <br /> Fits Your <br /> Lifestyle!
            </motion.h1>
            <motion.p className="description" variants={descriptionVariants}>
              Discover the latest trends in fashion for Men, Women, and Kids. 
              Shop premium clothing, accessories, tools, and more from top brands.
            </motion.p>
          </div>
        </div>

        <div className="btns">
          <motion.button 
            className="start"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => window.location.href = '/shop'}
          >
            Shop Now!
          </motion.button>
          <motion.button 
            className="contact"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => window.location.href = '/contact'}
          >
            Contact Us
          </motion.button>
        </div>

        <div className="brands">
          <p>Featured Brands:</p>
          <div className="brand_icons">
            {[nike, adidas, puma, reebok, redbull].map((img, i) => (
              <motion.img key={i} src={img} alt={`brand-${i}`} custom={i} variants={brandVariants} whileHover="hover" />
            ))}
          </div>
        </div>

        {/* Cards */}
        <motion.div className="card_wrapper card_one" variants={cardVariants} whileHover="hover">
          <div className="card">
            <div className="user_icons">
              {[dp1, dp2, dp3, dp4].map((img, i) => (
                <motion.div className="user_icon" key={i}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                >
                  <img src={img} alt="user" />
                </motion.div>
              ))}
            </div>
            <div className="text">
              <p>10,000+</p>
              <p>Happy Customers</p>
            </div>
            <div className="card_icon"><FaUser /></div>
          </div>
        </motion.div>

        <motion.div className="card_wrapper card_two" variants={cardVariants} whileHover="hover">
          <div className="card">
            <div className="user_icons">
              {[dp1, dp2, dp3, dp4].map((img, i) => (
                <motion.div className="user_icon" key={i}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.9 + i * 0.1 }}
                >
                  <img src={img} alt="user" />
                </motion.div>
              ))}
            </div>
            <div className="text">
              <p>4.9/5</p>
              <p>Customer Rating</p>
            </div>
            <div className="card_icon"><FaStar /></div>
          </div>
        </motion.div>

        <motion.div className="chart" variants={chartVariants} whileHover="hover">
          <div className="chart_top">
            <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}>
              <FaFire />
            </motion.div>
            <span>Total Products</span>
            <FaPlus />
          </div>
          <div className="chart_middle"><img src={chart} alt="Chart" /></div>
          <div className="chart_bottom">
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1, repeat: Infinity }}>
              {loading ? 'Loading...' : `${productCount} Items`}
            </motion.div>
          </div>
        </motion.div>
      </motion.main>
    </>
  );
};

export default Hero;
