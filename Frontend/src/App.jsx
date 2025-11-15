import React, { useEffect } from "react";
import { gsap } from "gsap";
import SplitText from "./libs/SplitText"; // 👈 adjust path
import "";
import { IonIcon } from "@ionic/react"; // you can also use CDN or react-icons

const App = () => {
  useEffect(() => {
    gsap.registerPlugin(SplitText);

    document.fonts.ready.then(() => {
      function createSplitTexts(elements) {
        const splits = {};
        elements.forEach(({ key, selector, type }) => {
          const config = { type, mask: type };
          if (type === "chars") config.charsClass = "char";
          if (type === "lines") config.charsClass = "line";
          splits[key] = SplitText.create(selector, config);
        });
        return splits;
      }

      const splitElements = [
        { key: "logoChars", selector: ".preloader-logo h1", type: "chars" },
        { key: "footerLines", selector: ".preloader-footer p", type: "lines" },
        { key: "headerChars", selector: ".header h1", type: "chars" },
        { key: "heroFooterH3", selector: ".hero-footer h3", type: "lines" },
        { key: "heroFooterP", selector: ".hero-footer p", type: "lines" },
        { key: "btnLabels", selector: ".btn-label span", type: "lines" },
      ];
      const splits = createSplitTexts(splitElements);

      gsap.set([splits.logoChars.chars], { x: "100%" });
      gsap.set(
        [
          splits.footerLines.lines,
          splits.headerChars.chars,
          splits.heroFooterH3.lines,
          splits.heroFooterP.lines,
          splits.btnLabels.lines,
        ],
        { y: "100%" }
      );
      gsap.set(".btn-icon", { clipPath: "circle(0% at 50% 50%)" });
      gsap.set(".btn", { scale: 0 });

      function animateProgress(duration = 4) {
        const t1 = gsap.timeline();
        const counterSteps = 5;
        let currentProgress = 0;

        for (let i = 0; i < counterSteps; i++) {
          const finalStep = i === counterSteps - 1;
          const targetProgress = finalStep
            ? 1
            : Math.min(currentProgress + Math.random() * 0.3 + 0.1, 0.9);
          currentProgress = targetProgress;

          t1.to(".preloader-progress-bar", {
            scaleX: targetProgress,
            duration: duration / counterSteps,
            ease: "power2.out",
          });
        }

        return t1;
      }

      const t1 = gsap.timeline({ delay: 0.5 });

      t1.to(splits.logoChars.chars, {
        x: "0%",
        stagger: 0.05,
        duration: 1,
        ease: "power4.inOut",
      })
        .to(
          splits.footerLines.lines,
          {
            y: "0%",
            stagger: 0.1,
            duration: 1,
            ease: "power4.inOut",
          },
          "0.25"
        )
        .add(animateProgress(), "<")
        .set(".preloader-progress", { backgroundColor: "var(--base-300)" })
        .to(
          splits.logoChars.chars,
          {
            x: "-100%",
            stagger: 0.05,
            duration: 1,
            ease: "power4.inOut",
          },
          "-=0.5"
        )
        .to(
          splits.footerLines.lines,
          {
            x: "-100%",
            stagger: 0.1,
            duration: 1,
            ease: "power4.inOut",
          },
          "<"
        )
        .to(
          ".preloader-progress",
          {
            opacity: 0,
            duration: 0.5,
            ease: "power3.out",
          },
          "-=0.25"
        )
        .to(
          ".preloader-mask",
          {
            scale: 5,
            duration: 2.5,
            ease: "power3.out",
          },
          "<"
        )
        .to(
          ".hero-img",
          {
            scale: 1,
            duration: 1.5,
            ease: "power3.out",
          },
          "<"
        )
        .to(splits.logoChars.chars, {
          y: "0",
          stagger: 0.05,
          duration: 1,
          ease: "power4.out",
          delay: -2,
        })
        .to(
          [splits.heroFooterH3.lines, splits.heroFooterP.lines],
          {
            y: "0",
            stagger: 0.1,
            duration: 1,
            ease: "power4.out",
          },
          "-=1.5"
        )
        .to(
          ".btn",
          {
            scale: 1,
            duration: 1,
            ease: "power4.out",
            onStart: () => {
              t1.to(".btn-icon", {
                clipPath: "circle(100% at 50% 50%)",
                duration: 1,
                ease: "power2.out",
                delay: -1.25,
              }).to(splits.btnLabels.lines, {
                y: 0,
                duration: 1,
                ease: "power4.out",
                delay: -1.25,
              });
            },
          },
          "<"
        );
    });
  }, []);

  return (
    <div className="container">
      {/* Preloader */}
      <div className="preloader-progress">
        <div className="preloader-progress-bar"></div>
        <div className="preloader-logo">
          <svg
            className="preloader-svg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 2544 1348"
          >
            <path d="M 740.110 372.195 C 706.344 374.993, 678.511 399.566, 671.449 432.814 C 669.329 442.794, 669.329 755.206, 671.449 765.186 C 674.653 780.270, 681.191 792.154, 692.519 803.481 C 703.848 814.811, 715.737 821.352, 730.814 824.549 C 740.870 826.682, 1653.130 826.682, 1663.186 824.549 C 1678.263 821.352, 1690.152 814.811, 1701.481 803.481 C 1712.809 792.154, 1719.347 780.270, 1722.551 765.186 C 1724.671 755.206, 1724.671 442.794, 1722.551 432.814 C 1719.347 417.730, 1712.809 405.846, 1701.481 394.519 C 1693.073 386.110, 1686.137 381.439, 1675.957 377.327 C 1661.853 371.630, 1694.706 372.017, 1202.304 371.748 C 952.712 371.612, 744.724 371.813, 740.110 372.195" />
          </svg>
          <h1>Sena</h1>
        </div>
      </div>
      <div class="preloader-mask"></div>
      <div className="preloader-content">
        <div className="preloader-footer">
          <p>
            Designing and developing seamless digital experiences with precision
            and creativity.
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-img">
            <img src="/hero.png" alt="Hero" />
          </div>
          <div className="hero-content">
            <div className="header">
              <h1>Sena</h1>
            </div>
            <div className="contact-btn">
              <div className="btn">
                <div className="btn-label">
                  <span>Contact</span>
                </div>
                <div className="btn-icon">
                  <IonIcon name="arrow-forward-sharp" />
                </div>
              </div>
            </div>
            <div className="menu-btn">
              <div className="btn">
                <div className="btn-label">
                  <span>Menu</span>
                </div>
                <div className="btn-icon">
                  <IonIcon name="menu-sharp" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default App;
