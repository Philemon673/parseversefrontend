"use client";

import { ReactNode, useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/mentor-component/siderbar";
import Navbar from "@/mentor-component/navbars";

interface DashboardLayoutProps {
  children: ReactNode;
}

// ── Add pages where Navbar should hide on scroll ──────────────────────────────
const HIDE_ON_SCROLL_PAGES = [
  "/mentor-dashboard/chat",
  "/mentor-dashboard/notification",
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [navbarVisible, setNavbarVisible] = useState(true);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hideOnScroll = HIDE_ON_SCROLL_PAGES.includes(pathname);
  

  useEffect(() => {
    // Reset to visible on every route change
    setNavbarVisible(true);

    if (!hideOnScroll) return;

    function handleScroll() {
      setNavbarVisible(false);

      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }

      scrollTimerRef.current = setTimeout(() => {
        setNavbarVisible(true);
      }, 800);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
    };
  }, [pathname, hideOnScroll]);

  return (
    <html lang="en">
      <body className="">
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex flex-1 flex-col">

            {/* Navbar — slides up when scrolling, reappears when stopped */}
            <div
              className={`sticky top-0 z-50 transition-all duration-300 ease-in-out ${navbarVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-full pointer-events-none"
                }`}
            >
              <Navbar />
            </div>

            <main className="flex-1 overflow-y-auto bg-[#f2f3fa] p-6">
              {children}
            </main>

          </div>
        </div>
      </body>
    </html>
  );
}
