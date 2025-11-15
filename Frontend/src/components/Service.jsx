import React from "react";
import { motion } from "framer-motion";

const Service = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
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
        duration: 0.5,
      },
    },
    hover: {
      y: -5,
      transition: { type: "spring", stiffness: 300, damping: 10 },
    },
  };

  const iconVariants = {
    hover: {
      rotate: [0, 10, -10, 0],
      transition: { duration: 0.6 },
    },
  };

  return (
    <motion.div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 20px",
        backgroundColor: "#ffffff",
        fontFamily: "Arial, sans-serif",
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <div
        style={{
          display: "flex",
          maxWidth: "1200px",
          width: "100%",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "30px",
        }}
      >
        {/* Free Shipping */}
        <motion.div
          style={{
            flex: "1",
            minWidth: "280px",
            maxWidth: "350px",
            display: "flex",
            alignItems: "center",
            gap: "15px",
            padding: "20px",
            borderRadius: "12px",
            backgroundColor: "#f9f9f9",
          }}
          variants={itemVariants}
          whileHover="hover"
        >
          <motion.div variants={iconVariants} whileHover="hover">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="40px"
              viewBox="0 -960 960 960"
              width="40px"
              fill="#1E3A5F"
              style={{ flexShrink: 0 }}
            >
              <path d="M440-183v-274L200-596v274l240 139Zm80 0 240-139v-274L520-457v274Zm-80 92L160-252q-19-11-29.5-29T120-321v-318q0-22 10.5-40t29.5-29l280-161q19-11 40-11t40 11l280 161q19 11 29.5 29t10.5 40v318q0 22-10.5 40T800-252L520-91q-19 11-40 11t-40-11Zm200-528 77-44-237-137-78 45 238 136Zm-160 93 78-45-237-137-78 45 237 137Z" />
            </svg>
          </motion.div>
          <div>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "6px",
                color: "#333333",
              }}
            >
              Best Quality
            </h3>
            <p
              style={{
                fontSize: "14px",
                color: "#666666",
                lineHeight: "1.5",
                margin: 0,
              }}
            >
              Premium products with guaranteed quality
            </p>
          </div>
        </motion.div>

        {/* Flexible Payment */}
        <motion.div
          style={{
            flex: "1",
            minWidth: "280px",
            maxWidth: "350px",
            display: "flex",
            alignItems: "center",
            gap: "15px",
            padding: "20px",
            borderRadius: "12px",
            backgroundColor: "#f9f9f9",
          }}
          variants={itemVariants}
          whileHover="hover"
        >
          <motion.div variants={iconVariants} whileHover="hover">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="40px"
              viewBox="0 -960 960 960"
              width="40px"
              fill="#1E3A5F"
              style={{ flexShrink: 0 }}
            >
              <path d="M240-160q-66 0-113-47T80-320v-320q0-66 47-113t113-47h480q66 0 113 47t47 113v320q0 66-47 113t-113 47H240Zm0-480h480q22 0 42 5t38 16v-21q0-33-23.5-56.5T720-720H240q-33 0-56.5 23.5T160-640v21q18-11 38-16t42-5Zm-74 130 445 108q9 2 18 0t17-8l139-116q-11-15-28-24.5t-37-9.5H240q-26 0-45.5 13.5T166-510Z" />
            </svg>
          </motion.div>
          <div>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "6px",
                color: "#333333",
              }}
            >
              Flexible Payment
            </h3>
            <p
              style={{
                fontSize: "14px",
                color: "#666666",
                lineHeight: "1.5",
                margin: 0,
              }}
            >
              Multiple source payment options
            </p>
          </div>
        </motion.div>

        {/* 24x7 Support */}
        <motion.div
          style={{
            flex: "1",
            minWidth: "280px",
            maxWidth: "350px",
            display: "flex",
            alignItems: "center",
            gap: "15px",
            padding: "20px",
            borderRadius: "12px",
            backgroundColor: "#f9f9f9",
          }}
          variants={itemVariants}
          whileHover="hover"
        >
          <motion.div variants={iconVariants} whileHover="hover">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="40px"
              viewBox="0 -960 960 960"
              width="40px"
              fill="#1E3A5F"
              style={{ flexShrink: 0 }}
            >
              <path d="M480-40v-80h280v-40H600v-320h160v-40q0-116-82-198t-198-82q-116 0-198 82t-82 198v40h160v320H200q-33 0-56.5-23.5T120-240v-280q0-74 28.5-139.5T226-774q49-49 114.5-77.5T480-880q74 0 139.5 28.5T734-774q49 49 77.5 114.5T840-520v400q0 33-23.5 56.5T760-40H480ZM200-240h80v-160h-80v160Zm480 0h80v-160h-80v160ZM200-400h80-80Zm480 0h80-80Z" />
            </svg>
          </motion.div>
          <div>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "6px",
                color: "#333333",
              }}
            >
              24x7 Support
            </h3>
            <p
              style={{
                fontSize: "14px",
                color: "#666666",
                lineHeight: "1.5",
                margin: 0,
              }}
            >
              We report online all days
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Service;
