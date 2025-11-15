import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./Productitem";

// Reusable responsive grid hook
const useGridColumns = () => {
  const [columns, setColumns] = useState(2);

  useEffect(() => {
    const checkScreenSize = () => {
      if (window.matchMedia("(min-width: 1280px)").matches) {
        setColumns(5);
      } else if (window.matchMedia("(min-width: 1024px)").matches) {
        setColumns(5);
      } else if (window.matchMedia("(min-width: 768px)").matches) {
        setColumns(3); // 👈 Changed from 4 → 3 for Galaxy Tab S7
      } else if (window.matchMedia("(min-width: 475px)").matches) {
        setColumns(2);
      } else {
        setColumns(1);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return columns;
};

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSellers, setBestSellers] = useState([]);
  const gridColumns = useGridColumns();

  useEffect(() => {
    if (products && products.length > 0) {
      // Grab products marked as best sellers and limit to 5
      const sellers = products.filter((p) => p.bestseller).slice(0, 5);
      setBestSellers(sellers);
    }
  }, [products]);

  return (
    <div style={{ marginBottom: "2.5rem", padding: "0 1rem" }}>
      <div
        style={{
          textAlign: "center",
          paddingBottom: "1rem",
          fontSize: "1.875rem",
          lineHeight: "2.25rem",
        }}
      >
        <Title text1="BEST " text2="SELLER" />
        <p
          style={{
            width: "75%",
            margin: "0 auto",
            marginTop: "0.5rem",
            color: "#4b5563",
            fontSize: "1rem",
            lineHeight: "1.5",
            paddingBottom: "1rem",
          }}
        >
          Our most-loved products, chosen by shoppers just like you.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${gridColumns}, minmax(160px, 1fr))`, // 👈 reduced min width from 200px → 160px
          gap: "1.5rem",
          justifyContent: "center",
          padding: "0 1rem",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {bestSellers.map((item, index) => (
          <ProductItem
            key={index}
            id={item._id}
            image={item.images?.[0]?.url || item.images?.[0] || ""}
            name={item.name}
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
};

export default BestSeller;
