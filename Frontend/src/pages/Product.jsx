import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import star from "../assets/d63531b4-3c85-4063-8689-6a5fe0ac3901.png";
import { useMediaQuery } from "react-responsive";
import RelatedProducts from "../components/RelatedProducts";

// Toast component
const Toast = ({ message, show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        backgroundColor: "#ff4444",
        color: "white",
        padding: "12px 20px",
        borderRadius: "4px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
        zIndex: 1000,
        animation: "fadeIn 0.3s ease-in",
      }}
    >
      {message}
    </div>
  );
};

const Product = () => {
  const { ProductId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [showToast, setShowToast] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const fetchProductData = () => {
    const product = products.find((item) => item._id === ProductId);
    if (product) {
      setProductData(product);
      setImage(product.images[0]?.url || ""); // Use the url field here
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [ProductId, products]);

  const handleAddToCart = () => {
    // Check if product has sizes and no size is selected
    if (productData.sizes && productData.sizes.length > 0 && !size) {
      setShowToast(true);
      return;
    }

    // Proceed with adding to cart
    addToCart(productData._id, size);
  };

  if (!productData) {
    return <div style={{ opacity: 0 }}>Loading...</div>;
  }

  return (
    <div style={{ transition: "opacity 500ms ease-in", opacity: 1 }}>
      <Toast
        message="Please select a size"
        show={showToast}
        onClose={() => setShowToast(false)}
      />

      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: "40px",
          padding: "20px 0",
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        {/* image section */}
        <div
          style={{
            width: isMobile ? "100%" : "50vw",
            display: "flex",
            flexDirection: window.innerWidth < 768 ? "column" : "row",
            gap: "20px",
            alignItems: isMobile ? "center" : "flex-start",
            flexWrap: "nowrap",
          }}
        >
          {/* desktop thumbnails */}
          {!isMobile && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                width: "90px",
                marginLeft: "auto",
              }}
            >
              {productData.images.map((img, index) => (
                <img
                  onClick={() => setImage(img.url)}
                  src={img.url}
                  key={index}
                  alt=""
                  style={{
                    width: "100%",
                    height: "94px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    objectFit: "cover",
                    border:
                      image === img.url ? "2px solid black" : "1px solid #ddd",
                  }}
                />
              ))}
            </div>
          )}

          {/* main image */}
          <div style={{ width: "350px" }}>
            <img
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                borderRadius: "10px",
                display: "block",
              }}
              src={image}
              alt=""
            />
          </div>

          {/* mobile thumbnails */}
          {isMobile && (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "12px",
                width: "100%",
                justifyContent: "center",
                flexWrap: "wrap",
                marginTop: "20px",
              }}
            >
              {productData.images.map((img, index) => (
                <img
                  onClick={() => setImage(img.url)}
                  src={img.url}
                  key={index}
                  alt=""
                  style={{
                    width: "90px",
                    height: "94px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    objectFit: "cover",
                    border:
                      image === img.url ? "2px solid black" : "1px solid #ddd",
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* product info */}
        <div
          style={{
            flex: "1 1 0%",
            ...(isMobile && {
              padding: "0 1rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }),
          }}
        >
          <h1
            style={{
              fontWeight: 500,
              fontSize: "2rem",
              marginTop: "0.5rem",
            }}
          >
            {productData.name}
          </h1>
          <p
            style={{
              marginTop: "0.5rem",
              fontSize: "1.6rem",
              fontWeight: 500,
            }}
          >
            {productData.price}
            {currency}
          </p>

          <p
            style={{
              marginTop: "-0.5rem",
              color: "#6B7280",
              width: isMobile ? "100%" : "90%",
              maxWidth: "500px",
            }}
          >
            {productData.description}
          </p>

          {productData.sizes && productData.sizes.length > 0 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                marginTop: "2rem",
                marginBottom: "2rem",
              }}
            >
              <p style={{ marginTop: "0.5rem" }}>Select Size</p>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {productData.sizes.map((item, index) => (
                  <button
                    onClick={() => setSize(size === item ? "" : item)}
                    key={index}
                    style={{
                      marginTop: "-1.5rem",
                      border: `1px solid ${
                        item === size ? "#f97316" : "#d1d5db"
                      }`,
                      borderRadius: "10px",
                      paddingTop: "0.5rem",
                      paddingBottom: "0.5rem",
                      paddingLeft: "1rem",
                      paddingRight: "1rem",
                      backgroundColor: "#f3f4f6",
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            style={{
              backgroundColor: "black",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
              borderRadius: "20px",
              color: "white",
              paddingLeft: "2rem",
              paddingRight: "2rem",
              paddingTop: "0.75rem",
              paddingBottom: "0.75rem",
              fontSize: "0.875rem",
              textAlign: "center",
            }}
          >
            ADD TO CART
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="16px"
              viewBox="0 -960 960 960"
              width="16px"
              fill="#ffff"
            >
              <path d="M440-600v-120H320v-80h120v-120h80v120h120v80H520v120h-80ZM280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM40-800v-80h131l170 360h280l156-280h91L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68.5-39t-1.5-79l54-98-144-304H40Z" />
            </svg>
          </button>

          <hr style={{ marginTop: "2rem", width: "100%" }} />

          <div
            style={{
              fontSize: "0.875rem",
              color: "#6B7280",
              marginTop: "1.25rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
            }}
          >
            <p style={{ marginTop: "-1rem" }}>100% Original product.</p>
            <p style={{ marginTop: "-1rem" }}>
              Cash on delivery is available on this product.
            </p>
          </div>
        </div>
      </div>

      {/* related products */}
      <div>
        <RelatedProducts
          category={productData.category}
          subCategory={productData.subCategory}
        />
      </div>
    </div>
  );
};

export default Product;
