import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
// use your own icon import if react-icons is not available
import { GoArrowUpRight } from "react-icons/go";
import { useNavigate } from "react-router-dom";

const CardNav = ({
  logo,
  logoAlt = "Logo",
  items,
  className = "",
  ease = "power3.out",
  baseColor = "#fff",
  menuColor,
  buttonBgColor,
  buttonTextColor,
}) => {
  const navigate = useNavigate();
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navRef = useRef(null);
  const cardsRef = useRef([]);
  const tlRef = useRef(null);

  const calculateHeight = () => {
    const navEl = navRef.current;
    if (!navEl) return 260;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) {
      const contentEl = navEl.querySelector(".card-nav-content");
      if (contentEl) {
        const wasVisible = contentEl.style.visibility;
        const wasPointerEvents = contentEl.style.pointerEvents;
        const wasPosition = contentEl.style.position;
        const wasHeight = contentEl.style.height;

        contentEl.style.visibility = "visible";
        contentEl.style.pointerEvents = "auto";
        contentEl.style.position = "static";
        contentEl.style.height = "auto";

        contentEl.offsetHeight;

        const topBar = 60;
        const padding = 16;
        const contentHeight = contentEl.scrollHeight;

        contentEl.style.visibility = wasVisible;
        contentEl.style.pointerEvents = wasPointerEvents;
        contentEl.style.position = wasPosition;
        contentEl.style.height = wasHeight;

        return topBar + contentHeight + padding;
      }
    }
    return 260;
  };

  const createTimeline = () => {
    const navEl = navRef.current;
    if (!navEl) return null;

    gsap.set(navEl, { height: 60, overflow: "hidden" });
    gsap.set(cardsRef.current, { y: 50, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    tl.to(navEl, {
      height: calculateHeight,
      duration: 0.4,
      ease,
    });

    tl.to(
      cardsRef.current,
      { y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.08 },
      "-=0.1"
    );

    return tl;
  };

  useLayoutEffect(() => {
    const tl = createTimeline();
    tlRef.current = tl;

    return () => {
      tl?.kill();
      tlRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ease, items]);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!tlRef.current) return;

      if (isExpanded) {
        const newHeight = calculateHeight();
        gsap.set(navRef.current, { height: newHeight });

        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          newTl.progress(1);
          tlRef.current = newTl;
        }
      } else {
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          tlRef.current = newTl;
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded]);

  const toggleMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;
    if (!isExpanded) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      tl.play(0);
    } else {
      setIsHamburgerOpen(false);
      tl.eventCallback("onReverseComplete", () => setIsExpanded(false));
      tl.reverse();
    }
  };

  const setCardRef = (i) => (el) => {
    if (el) cardsRef.current[i] = el;
  };

  return (
    /* card-nav-container */
    <div
      className={`absolute top-8 left-1/2 transform -translate-x-1/2 w-[90%] max-w-4xl z-50 ${className}`}
    >
      <nav
        ref={navRef}
        className={`block h-15 p-0 bg-white border border-white/10 rounded-xl shadow-md relative overflow-hidden ${
          isExpanded ? "open" : ""
        }`}
        style={{ backgroundColor: baseColor, willChange: "height" }}
      >
        {/* card-nav-top */}
        <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-between mt-2.5 px-2 py-2 z-[2]">
          {/* hamburger-menu */}
          <div
            className={`h-full flex flex-col items-center justify-center cursor-pointer gap-1.5 pb-2.5 ${
              isHamburgerOpen ? "open" : ""
            }`}
            onClick={toggleMenu}
            role="button"
            aria-label={isExpanded ? "Close menu" : "Open menu"}
            tabIndex={0}
            style={{ color: menuColor || "#000" }}
          >
            {/* hamburger-line */}
            <div
              className={`w-7 h-0.5 bg-current transition-transform duration-300 ease-in-out origin-center ${
                isHamburgerOpen ? "transform translate-y-1 rotate-45" : ""
              }`}
            />
            <div
              className={`w-7 h-0.5 bg-current transition-transform duration-300 ease-in-out origin-center ${
                isHamburgerOpen ? "transform -translate-y-1 -rotate-45" : ""
              }`}
            />
          </div>

          {/* logo-container */}
          <div className="flex items-center absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {/* başlık */}
            <p className="text-black pb-5 font-bold text-lg ">
              İlaç Takip Uygulaması
            </p>
          </div>

          <div>
            {/* jsx-settings-button */}
            <img className="h-7 mb-1" src="icons8-settings-48.png"></img>
          </div>

          {/* <button // ayar butonu değişecek
            type="button"
            className="card-nav-settings-button"
            style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
          >
            <span className="settings-icon">&#9881;</span>
          </button> */}
        </div>

        {/* card-nav-content */}
        <div
          className={`absolute left-0 right-0 top-15 bottom-0 p-2 flex items-end gap-3 z-[1] md:flex-row md:items-stretch md:gap-2 md:justify-start ${
            isExpanded
              ? "visible pointer-events-auto"
              : "invisible pointer-events-none"
          }`}
          aria-hidden={!isExpanded}
        >
          {(items || []).slice(0, 3).map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              className={`h-full flex-1 min-w-0 rounded-lg relative flex flex-col p-3 gap-2 select-none md:h-auto md:min-h-15 md:flex-auto md:max-h-none`} /* nav-card nav-card-${idx} */
              ref={setCardRef(idx)}
              style={{ backgroundColor: item.bgColor, color: item.textColor }}
            >
              <div
                className="font-normal text-[22px] tracking-[-0.5px] flex flex-col items-center md:text-lg" /* nav-card-label */
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <span>{item.label}</span>
                {idx === 0 && (
                  <img
                    src="/icons8-test-account-48.png"
                    alt="Profil"
                    onClick={() => navigate("/profiles")}
                    style={{
                      width: 90,
                      height: 90,
                      marginTop: 20,
                      display: "block",
                      margin: "8px auto 0",
                      cursor: "pointer",
                    }}
                  />
                )}
                {idx === 1 && (
                  <img
                    src="/icons8-medicine-48.png"
                    alt="İlaçlar"
                    onClick={() => navigate("/medicine")}
                    style={{
                      width: 90,
                      height: 90,
                      marginTop: 20,
                      display: "block",
                      margin: "8px auto 0",
                      cursor: "pointer",
                    }}
                  />
                )}
                {idx === 2 && (
                  <img
                    src="/icons8-calendar-48.png"
                    alt="Takvim"
                    onClick={() => navigate("/calendar")}
                    style={{
                      width: 90,
                      height: 90,
                      marginTop: 20,
                      display: "block",
                      margin: "8px auto 0",
                      cursor: "pointer",
                    }}
                  />
                )}
              </div>
              {/* nav-card-links */}
              <div className="mt-auto flex flex-col gap-0.5">
                {item.links?.map((lnk, i) => (
                  <a
                    key={`${lnk.label}-${i}`}
                    className="text-base cursor-pointer no-underline transition-opacity duration-300 ease-in-out inline-flex items-center gap-1.5 hover:opacity-75 md:text-[15px]" /* nav-card-link */
                    href={lnk.href}
                    aria-label={lnk.ariaLabel}
                  >
                    <GoArrowUpRight
                      className="" /* nav-card-link-icon */
                      aria-hidden="true"
                    />
                    {lnk.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default CardNav;
