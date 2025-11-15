import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./Productitem";

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);
  const [gridColumns, setGridColumns] = useState(2);

  /* --- Grab the five most‐recent products --- */
  useEffect(() => {
    if (products?.length) setLatestProducts(products.slice(0, 5));
  }, [products]);

  /* --- Responsive grid column logic --- */
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w >= 1280) setGridColumns(5);
      else if (w >= 1024) setGridColumns(5);
      else if (w >= 768) setGridColumns(3); // 👈 changed from 4 → 3 for tablets
      else if (w >= 475) setGridColumns(2);
      else setGridColumns(1); // fallback for < 475px
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // run once on mount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* --- Helper to pull the first image URL --- */
  const getImageSrc = (item) => {
    if (Array.isArray(item.images) && item.images.length) {
      const first = item.images[0];
      return typeof first === "string" ? first : first.url;
    }
    return item.image || ""; // legacy fallback
  };

  return (
    <div style={{ margin: "-30px auto 2.5rem", padding: "0 1rem" }}>
      <div
        style={{
          textAlign: "center",
          padding: "2rem 0 1rem",
          fontSize: "1.875rem",
          lineHeight: "2.25rem",
        }}
      >
        <Title text1="LATEST " text2="PRODUCTS" />
        <p
          style={{
            width: "75%",
            margin: "0.5rem auto 1rem",
            color: "#4b5563",
            fontSize: "1rem",
            lineHeight: 1.5,
          }}
        >
          Discover our newest arrivals and stay ahead of the trends with our
          latest collection
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${gridColumns}, minmax(160px, 1fr))`, // 👈 reduced min width
          gap: "1rem",
          justifyContent: "center",
          padding: "0 1rem",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {latestProducts.map((item) => (
          <ProductItem
            key={item._id}
            id={item._id}
            image={getImageSrc(item)}
            name={item.name}
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
};

export default LatestCollection;
