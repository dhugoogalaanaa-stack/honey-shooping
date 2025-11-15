import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "../components/Productitem";

// Reusable responsive grid hook (same as BestSeller)
const useGridColumns = () => {
  const [columns, setColumns] = useState(2);

  useEffect(() => {
    const checkScreenSize = () => {
      if (window.matchMedia("(min-width: 1280px)").matches) {
        setColumns(3);
      } else if (window.matchMedia("(min-width: 1024px)").matches) {
        setColumns(3);
      } else if (window.matchMedia("(min-width: 768px)").matches) {
        setColumns(3);
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

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [filterProducts, setFilterProducts] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 760);
  const [isTablet, setIsTablet] = useState(
    window.innerWidth >= 760 && window.innerWidth < 1024
  );
  const [sortOption, setSortOption] = useState("relavent");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const { backendUrl } = useContext(ShopContext);
  const gridColumns = useGridColumns(); // Using the responsive grid hook

  // Color palette
  const colors = {
    white: "#FFFFFF",
    charcoal: "#2C2C2C",
    navy: "#1E3A5F",
    olive: "#4A5D23",
    softGray: "#F5F5F5",
    lightGray: "#E5E7EB",
    mediumGray: "#9CA3AF",
  };

  const fixedTypes = ["Topwear", "Bottomwear", "Dress", "Accessory"];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  const filterPanelVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
    exit: { x: -20, opacity: 0 },
  };

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 760);
      setIsTablet(width >= 760 && width < 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    let filtered = [...products];

    if (search) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        selectedCategories.includes(product.category)
      );
    }

    if (selectedTypes.length > 0) {
      filtered = filtered.filter((product) =>
        selectedTypes.includes(product.subCategory)
      );
    }

    if (sortOption === "low-high") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === "high-low") {
      filtered.sort((a, b) => b.price - a.price);
    } else {
      filtered = shuffleArray(filtered);
    }

    setFilterProducts(filtered);
  }, [products, search, selectedCategories, selectedTypes, sortOption]);

  const handleCategoryChange = (category) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(newCategories);
  };

  const handleTypeChange = (type) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];
    setSelectedTypes(newTypes);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedTypes([]);
    setSortOption("relavent");
  };

  useEffect(() => {
    // Scroll to top when component mounts or when URL parameters change
    window.scrollTo(0, 0);

    const urlParams = new URLSearchParams(window.location.search);
    const categoryFromUrl = urlParams.get("category");

    if (categoryFromUrl) {
      // Convert URL parameter to proper case (e.g., "men" -> "Men")
      const formattedCategory =
        categoryFromUrl.charAt(0).toUpperCase() + categoryFromUrl.slice(1);
      setSelectedCategories([formattedCategory]);
    }
  }, []);

  return (
    <motion.div
      style={{
        display: "flex",
        fontFamily: "'Inter', 'Arial', sans-serif",
        flexDirection: isMobile ? "column" : "row",
        minHeight: "100vh",
        backgroundColor: colors.softGray,
      }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Filter Panel for Desktop and Tablet */}
      {(!isMobile || (isTablet && showFilter)) && (
        <motion.div
          style={{
            padding: "32px 24px 32px 48px",
            width: isTablet ? (showFilter ? "260px" : "0") : "260px",
            flexShrink: 0,
            borderRight: `1px solid ${colors.lightGray}`,
            backgroundColor: colors.white,
            overflow: "hidden",
            position: isTablet ? "absolute" : "relative",
            zIndex: isTablet ? 10 : 1,
            height: isTablet ? "100%" : "auto",
            boxShadow: isTablet ? "2px 0 10px rgba(0,0,0,0.1)" : "none",
          }}
          variants={filterPanelVariants}
          initial={isTablet ? "hidden" : "visible"}
          animate={isTablet ? (showFilter ? "visible" : "hidden") : "visible"}
          exit="exit"
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "32px",
              position: "relative",
            }}
          >
            <motion.h1
              style={{
                fontSize: "28px",
                fontWeight: "700",
                color: colors.charcoal,
                margin: 0,
                flex: 1,
              }}
              whileHover={{ scale: 1.02 }}
            >
              FILTERS
            </motion.h1>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                position: isTablet ? "absolute" : "relative",
                top: isTablet ? "0" : "auto",
                right: isTablet ? "0" : "auto",
              }}
            >
              <motion.button
                onClick={clearFilters}
                style={{
                  background: "none",
                  border: "none",
                  color: colors.navy,
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  textDecoration: "none",
                  padding: "4px 8px",
                  borderRadius: "4px",
                }}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: colors.softGray,
                }}
                whileTap={{ scale: 0.95 }}
              >
                Clear All
              </motion.button>

              {isTablet && (
                <motion.button
                  onClick={() => setShowFilter(false)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "24px",
                    cursor: "pointer",
                    color: colors.charcoal,
                    padding: "0",
                    width: "30px",
                    height: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "4px",
                  }}
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: colors.softGray,
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  ×
                </motion.button>
              )}
            </div>
          </div>

          <motion.div style={{ marginBottom: "40px" }}>
            <motion.h2
              style={{
                fontSize: "16px",
                fontWeight: "600",
                marginBottom: "20px",
                color: colors.charcoal,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
              whileHover={{ x: 5 }}
            >
              CATEGORIES
            </motion.h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                paddingLeft: "8px",
              }}
            >
              {["Men", "Women", "Kids", "Tool", "Eats"].map((item) => (
                <motion.label
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    fontSize: "15px",
                    color: colors.charcoal,
                    cursor: "pointer",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    backgroundColor: selectedCategories.includes(item)
                      ? colors.softGray
                      : "transparent",
                    transition: "background-color 0.2s ease",
                  }}
                  whileHover={{ scale: 1.02, backgroundColor: colors.softGray }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(item)}
                    onChange={() => handleCategoryChange(item)}
                    style={{
                      width: "18px",
                      height: "18px",
                      accentColor: colors.navy,
                      cursor: "pointer",
                    }}
                  />
                  {item}
                </motion.label>
              ))}
            </div>
          </motion.div>

          <motion.div>
            <motion.h2
              style={{
                fontSize: "16px",
                fontWeight: "600",
                marginBottom: "20px",
                color: colors.charcoal,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
              whileHover={{ x: 5 }}
            >
              TYPE
            </motion.h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                paddingLeft: "8px",
              }}
            >
              {fixedTypes.map((item) => (
                <motion.label
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    fontSize: "15px",
                    color: colors.charcoal,
                    cursor: "pointer",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    backgroundColor: selectedTypes.includes(item)
                      ? colors.softGray
                      : "transparent",
                    transition: "background-color 0.2s ease",
                  }}
                  whileHover={{ scale: 1.02, backgroundColor: colors.softGray }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(item)}
                    onChange={() => handleTypeChange(item)}
                    style={{
                      width: "18px",
                      height: "18px",
                      accentColor: colors.navy,
                      cursor: "pointer",
                    }}
                  />
                  {item}
                </motion.label>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Main Content */}
      <motion.div
        style={{
          flex: 1,
          padding: isMobile ? "20px" : "32px 48px",
          backgroundColor: colors.white,
          borderRadius: isMobile ? "0" : "8px 0 0 0",
          boxShadow: isMobile ? "none" : "0 0 20px rgba(0, 0, 0, 0.03)",
          marginLeft: isTablet && showFilter ? "260px" : "0",
          transition: "margin-left 0.3s ease",
        }}
        variants={containerVariants}
      >
        <motion.div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? "24px" : "0",
            marginBottom: "32px",
          }}
          variants={itemVariants}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {isTablet && !showFilter && (
              <motion.button
                onClick={() => setShowFilter(true)}
                style={{
                  padding: "8px 12px",
                  backgroundColor: colors.navy,
                  color: colors.white,
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Show Filters
              </motion.button>
            )}

            <motion.div
              style={{
                fontSize: isMobile ? "25px" : "32px",
                fontWeight: "700",
                color: colors.charcoal,
              }}
              whileHover={{ scale: 1.02 }}
            >
              ALL{" "}
              <motion.span
                style={{ color: colors.navy }}
                whileHover={{ scale: 1.1 }}
              >
                COLLECTIONS
              </motion.span>
            </motion.div>
          </div>

          <motion.select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            style={{
              border: `2px solid ${colors.lightGray}`,
              borderRadius: "8px",
              padding: "12px 48px 12px 16px",
              fontSize: "15px",
              color: colors.charcoal,
              backgroundColor: colors.white,
              appearance: "none",
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${encodeURIComponent(
                colors.mediumGray
              )}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 16px center",
              backgroundSize: "20px",
              cursor: "pointer",
              minWidth: "240px",
              width: isMobile ? "100%" : "auto",
              fontWeight: "500",
            }}
            whileHover={{
              scale: 1.02,
              borderColor: colors.navy,
              boxShadow: "0 0 0 3px rgba(30, 58, 95, 0.1)",
            }}
            whileTap={{ scale: 0.98 }}
          >
            <option value="relavent">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </motion.select>
        </motion.div>

        {isMobile && !isTablet && (
          <>
            <motion.button
              onClick={() => setShowFilter(!showFilter)}
              style={{
                padding: "12px 16px",
                backgroundColor: colors.softGray,
                border: `1px solid ${colors.lightGray}`,
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                width: "100%",
                justifyContent: "center",
                marginBottom: "24px",
                color: colors.charcoal,
              }}
              whileHover={{
                scale: 1.02,
                backgroundColor: colors.lightGray,
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              {showFilter ? "Hide Filters" : "Show Filters"}
              <motion.span
                style={{ fontSize: "18px", fontWeight: "bold" }}
                animate={{ rotate: showFilter ? 180 : 0 }}
              >
                ↓
              </motion.span>
            </motion.button>

            {/* Filter Panel for Mobile - appears under the button */}
            <AnimatePresence>
              {showFilter && (
                <motion.div
                  style={{
                    padding: "24px",
                    backgroundColor: colors.white,
                    border: `1px solid ${colors.lightGray}`,
                    borderRadius: "8px",
                    marginBottom: "24px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                  }}
                  variants={filterPanelVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "24px",
                    }}
                  >
                    <motion.h1
                      style={{
                        fontSize: "20px",
                        fontWeight: "700",
                        color: colors.charcoal,
                        margin: 0,
                      }}
                      whileHover={{ scale: 1.02 }}
                    >
                      FILTERS
                    </motion.h1>

                    <motion.button
                      onClick={clearFilters}
                      style={{
                        background: "none",
                        border: "none",
                        color: colors.navy,
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: "pointer",
                        textDecoration: "none",
                        padding: "4px 8px",
                        borderRadius: "4px",
                      }}
                      whileHover={{
                        scale: 1.05,
                        backgroundColor: colors.softGray,
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Clear All
                    </motion.button>
                  </div>

                  <motion.div style={{ marginBottom: "32px" }}>
                    <motion.h2
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        marginBottom: "16px",
                        color: colors.charcoal,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                      whileHover={{ x: 5 }}
                    >
                      CATEGORIES
                    </motion.h2>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                        paddingLeft: "8px",
                      }}
                    >
                      {["Men", "Women", "Kids", "Tool", "Eats"].map((item) => (
                        <motion.label
                          key={item}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            fontSize: "15px",
                            color: colors.charcoal,
                            cursor: "pointer",
                            padding: "6px 10px",
                            borderRadius: "6px",
                            backgroundColor: selectedCategories.includes(item)
                              ? colors.softGray
                              : "transparent",
                            transition: "background-color 0.2s ease",
                          }}
                          whileHover={{
                            scale: 1.02,
                            backgroundColor: colors.softGray,
                          }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(item)}
                            onChange={() => handleCategoryChange(item)}
                            style={{
                              width: "18px",
                              height: "18px",
                              accentColor: colors.navy,
                              cursor: "pointer",
                            }}
                          />
                          {item}
                        </motion.label>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div>
                    <motion.h2
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        marginBottom: "16px",
                        color: colors.charcoal,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                      whileHover={{ x: 5 }}
                    >
                      TYPE
                    </motion.h2>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                        paddingLeft: "8px",
                      }}
                    >
                      {fixedTypes.map((item) => (
                        <motion.label
                          key={item}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            fontSize: "15px",
                            color: colors.charcoal,
                            cursor: "pointer",
                            padding: "6px 10px",
                            borderRadius: "6px",
                            backgroundColor: selectedTypes.includes(item)
                              ? colors.softGray
                              : "transparent",
                            transition: "background-color 0.2s ease",
                          }}
                          whileHover={{
                            scale: 1.02,
                            backgroundColor: colors.softGray,
                          }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <input
                            type="checkbox"
                            checked={selectedTypes.includes(item)}
                            onChange={() => handleTypeChange(item)}
                            style={{
                              width: "18px",
                              height: "18px",
                              accentColor: colors.navy,
                              cursor: "pointer",
                            }}
                          />
                          {item}
                        </motion.label>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {/* Results count */}
        <motion.div
          style={{
            marginBottom: "24px",
            color: colors.mediumGray,
            fontSize: "15px",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {filterProducts.length}{" "}
          {filterProducts.length === 1 ? "product" : "products"} found
          {(selectedCategories.length > 0 || selectedTypes.length > 0) && (
            <span>
              {" "}
              with selected filters
              <button
                onClick={clearFilters}
                style={{
                  marginLeft: "8px",
                  color: colors.navy,
                  textDecoration: "underline",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "15px",
                }}
              >
                Clear filters
              </button>
            </span>
          )}
        </motion.div>

        {/* Updated Grid - Now using the same responsive grid as BestSeller */}
        <motion.div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${gridColumns}, minmax(160px, 1fr))`,
            gap: "1.5rem",
            justifyContent: "center",
            padding: "0 1rem",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
          variants={containerVariants}
        >
          <AnimatePresence>
            {filterProducts.length > 0 ? (
              filterProducts.map((item, index) => (
                <motion.div
                  key={item._id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <ProductItem
                    name={item.name}
                    id={item._id}
                    price={item.price}
                    image={item.images[0]?.url}
                    backendUrl={backendUrl}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div
                style={{
                  gridColumn: "1 / -1",
                  textAlign: "center",
                  padding: "60px 40px",
                  color: colors.mediumGray,
                  fontSize: "18px",
                  backgroundColor: colors.softGray,
                  borderRadius: "12px",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div style={{ marginBottom: "16px", fontSize: "48px" }}>🔍</div>
                No products found matching your filters
                <div style={{ marginTop: "16px", fontSize: "15px" }}>
                  Try adjusting your filters or search terms
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Collection;
