import React, { useEffect, useRef, useState } from "react";
import Hero1 from "../assets/Download Black and white image of a wave with a black background_ The image has a moody and mysterious feel to it for free.jpg";
import Hero2 from "../assets/Wavy Background Abstract Black For With Smooth Lines Stock Fotografi Backgrounds _ JPG Free Download - Pikbest.jpg";
import Hero3 from "../assets/download1.jpg";

const PremiumCollection = () => {
  const sectionRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const ticking = useRef(false);
  const lastScrollY = useRef(0);

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsTablet(window.innerWidth >= 768 && window.innerWidth <= 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const cardStyle = {
    height: isTablet ? "50vh" : "60vh",
    maxHeight: isTablet ? "500px" : "600px",
    borderRadius: "20px",
    transition:
      "transform 0.5s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.5s cubic-bezier(0.19, 1, 0.22, 1)",
    willChange: "transform, opacity",
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    const handleScroll = () => {
      if (!ticking.current) {
        lastScrollY.current = window.scrollY;

        window.requestAnimationFrame(() => {
          if (!sectionRef.current) return;

          const sectionRect = sectionRef.current.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const totalScrollDistance = viewportHeight * 2;

          let progress = 0;
          if (sectionRect.top <= 0) {
            progress = Math.min(
              1,
              Math.max(0, Math.abs(sectionRect.top) / totalScrollDistance)
            );
          }

          if (progress >= 0.66) {
            setActiveCardIndex(2);
          } else if (progress >= 0.33) {
            setActiveCardIndex(1);
          } else {
            setActiveCardIndex(0);
          }

          ticking.current = false;
        });

        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const isFirstCardVisible = isIntersecting;
  const isSecondCardVisible = activeCardIndex >= 1;
  const isThirdCardVisible = activeCardIndex >= 2;

  return (
    <div ref={sectionRef} style={{ position: "relative", height: "300vh" }}>
      <section
        id="premium-collection"
        style={{
          width: "100%",
          height: "100vh",
          paddingBottom: isTablet ? "30px" : "40px",
          position: "sticky",
          top: 0,
          overflow: "hidden",
          backgroundColor: "#fff",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            paddingLeft: isTablet ? "20px" : "24px",
            paddingRight: isTablet ? "20px" : "24px",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ marginBottom: isTablet ? "8px" : "12px" }}>
            <h2
              style={{
                fontSize: isTablet ? "32px" : "40px",
                fontWeight: "700",
                marginBottom: isTablet ? "8px" : "12px",
                textAlign: "center",
              }}
            >
              Explore Our Collections
            </h2>
            <p
              style={{
                textAlign: "center",
                fontSize: isTablet ? "16px" : "18px",
                color: "#666",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              Discover perfect styles for Men, Women, Kids, Tools, and Eats
            </p>
          </div>

          <div
            ref={cardsContainerRef}
            style={{ position: "relative", flex: 1, perspective: "1000px" }}
          >
            {/* First Card - Men's Collection */}
            <div
              style={{
                ...cardStyle,
                position: "absolute",
                inset: 0,
                overflow: "hidden",
                boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
                zIndex: 10,
                transform: `translateY(${
                  isFirstCardVisible ? (isTablet ? "70px" : "90px") : "200px"
                }) scale(${isTablet ? 0.85 : 0.9})`,
                opacity: isFirstCardVisible ? 0.9 : 0,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 0,
                  backgroundImage: `url(${Hero1})`,
                  backgroundSize: "cover",
                  backgroundPosition: "top center",
                  backgroundBlendMode: "overlay",
                  backgroundColor: "rgba(0,0,0,0.4)",
                }}
              ></div>

              <div
                style={{
                  position: "absolute",
                  top: isTablet ? "12px" : "16px",
                  right: isTablet ? "12px" : "16px",
                  zIndex: 20,
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: isTablet ? "6px 12px" : "8px 16px",
                    borderRadius: "999px",
                    backgroundColor: "rgba(255,255,255,0.2)",
                    backdropFilter: "blur(8px)",
                    color: "#fff",
                    fontSize: isTablet ? "12px" : "14px",
                  }}
                >
                  Men's Collection
                </div>
              </div>

              <div
                style={{
                  position: "relative",
                  zIndex: 10,
                  padding: isTablet ? "24px" : "32px",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div style={{ maxWidth: "600px" }}>
                  <h3
                    style={{
                      fontSize: isTablet ? "24px" : "32px",
                      fontWeight: 700,
                      color: "#fff",
                      marginBottom: isTablet ? "12px" : "16px",
                    }}
                  >
                    Stylish Men's Apparel
                  </h3>
                  <p
                    style={{
                      color: "#fff",
                      fontSize: isTablet ? "16px" : "18px",
                      lineHeight: "1.6",
                    }}
                  >
                    Discover our premium collection of men's Topwear,
                    Bottomwear, and Accessories. From casual to formal, we have
                    everything for the modern man.
                  </p>
                </div>
              </div>
            </div>

            {/* Second Card - Women's Collection */}
            <div
              style={{
                ...cardStyle,
                position: "absolute",
                inset: 0,
                overflow: "hidden",
                boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
                zIndex: 20,
                transform: `translateY(${
                  isSecondCardVisible
                    ? activeCardIndex === 1
                      ? isTablet
                        ? "40px"
                        : "55px"
                      : isTablet
                      ? "30px"
                      : "45px"
                    : "200px"
                }) scale(${isTablet ? 0.9 : 0.95})`,
                opacity: isSecondCardVisible ? 1 : 0,
                pointerEvents: isSecondCardVisible ? "auto" : "none",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 0,
                  backgroundImage: `url(${Hero2})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundBlendMode: "overlay",
                  backgroundColor: "rgba(0,0,0,0.4)",
                }}
              ></div>

              <div
                style={{
                  position: "absolute",
                  top: isTablet ? "12px" : "16px",
                  right: isTablet ? "12px" : "16px",
                  zIndex: 20,
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: isTablet ? "6px 12px" : "8px 16px",
                    borderRadius: "999px",
                    backgroundColor: "rgba(255,255,255,0.2)",
                    backdropFilter: "blur(8px)",
                    color: "#fff",
                    fontSize: isTablet ? "12px" : "14px",
                  }}
                >
                  Women's Collection
                </div>
              </div>

              <div
                style={{
                  position: "relative",
                  zIndex: 10,
                  padding: isTablet ? "24px" : "32px",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div style={{ maxWidth: "600px" }}>
                  <h3
                    style={{
                      fontSize: isTablet ? "24px" : "32px",
                      fontWeight: 700,
                      color: "#fff",
                      marginBottom: isTablet ? "12px" : "16px",
                    }}
                  >
                    Elegant Women's Fashion
                  </h3>
                  <p
                    style={{
                      color: "#fff",
                      fontSize: isTablet ? "16px" : "18px",
                      lineHeight: "1.6",
                    }}
                  >
                    Explore our stunning collection of women's Dresses, Topwear,
                    Bottomwear, and Accessories. Find the perfect pieces to
                    express your unique style.
                  </p>
                </div>
              </div>
            </div>

            {/* Third Card - Kids, Tools & Eats */}
            <div
              style={{
                ...cardStyle,
                position: "absolute",
                inset: 0,
                overflow: "hidden",
                boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
                zIndex: 30,
                transform: `translateY(${
                  isThirdCardVisible
                    ? activeCardIndex === 2
                      ? isTablet
                        ? "10px"
                        : "15px"
                      : "0"
                    : "200px"
                }) scale(1)`,
                opacity: isThirdCardVisible ? 1 : 0,
                pointerEvents: isThirdCardVisible ? "auto" : "none",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 0,
                  backgroundImage: `url(${Hero3})`,
                  backgroundSize: "cover",
                  backgroundPosition: "bottom center",
                  backgroundBlendMode: "overlay",
                  backgroundColor: "rgba(0,0,0,0.4)",
                }}
              ></div>

              <div
                style={{
                  position: "absolute",
                  top: isTablet ? "12px" : "16px",
                  right: isTablet ? "12px" : "16px",
                  zIndex: 20,
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: isTablet ? "6px 12px" : "8px 16px",
                    borderRadius: "999px",
                    backgroundColor: "rgba(255,255,255,0.2)",
                    backdropFilter: "blur(8px)",
                    color: "#fff",
                    fontSize: isTablet ? "12px" : "14px",
                  }}
                >
                  Kids, Tools & Eats
                </div>
              </div>

              <div
                style={{
                  position: "relative",
                  zIndex: 10,
                  padding: isTablet ? "24px" : "32px",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div style={{ maxWidth: "600px" }}>
                  <h3
                    style={{
                      fontSize: isTablet ? "24px" : "32px",
                      fontWeight: 700,
                      color: "#fff",
                      marginBottom: isTablet ? "12px" : "16px",
                    }}
                  >
                    For Everyone{" "}
                    <span style={{ color: "#FC4D0A" }}>& Everything</span>
                  </h3>
                  <p
                    style={{
                      color: "#fff",
                      fontSize: isTablet ? "16px" : "18px",
                      lineHeight: "1.6",
                    }}
                  >
                    Discover our diverse range of Kids' clothing, essential
                    Tools for your home, and delicious Eats for every occasion.
                    Everything you need in one place.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PremiumCollection;
