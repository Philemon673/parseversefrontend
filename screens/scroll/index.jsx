"use client";

import { useEffect, useState } from "react";

export default function ScrollToTop({
  threshold = 100,
  className = "",
  children,
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > threshold);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={`
        fixed bottom-10 right-10
        bg-[#7b48b5] text-white
        p-4 w-10 h-10 rounded-full
        flex items-center justify-center
        shadow-lg
        text-xl
        transition-all duration-300
        z-50
        ${className}
      `}
    >
      {children || "↑"}
    </button>
  );
}