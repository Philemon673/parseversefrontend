"use client";

import { ReactNode, useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/mentor-component/siderbar";
import Navbar from "@/mentor-component/navbars";
import { NotificationProvider } from "@/lib/notification-context";
import { AuthProvider, useAuth } from "@/lib/auth-context";

interface DashboardLayoutProps {
  children: ReactNode;
}

// ── Add pages where Navbar should hide on scroll ──────────────────────────────
const HIDE_ON_SCROLL_PAGES = [
  "/mentor-dashboard/chat",
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [navbarVisible, setNavbarVisible] = useState(true);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hideOnScroll = HIDE_ON_SCROLL_PAGES.includes(pathname);
  const isSessionPage = pathname.includes("/sessions/");

  const { user, isLoading } = useAuth();
  const router = require("next/navigation").useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace("/login");
      } else if (user.role !== "MENTOR" && user.role !== "ADMIN") {
        router.replace(`/${user.role.toLowerCase()}-dashboard/Home`);
      }
    }
  }, [user, isLoading, router]);

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

  if (isLoading || !user || (user.role !== "MENTOR" && user.role !== "ADMIN")) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#f8fafc]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <AuthProvider>
      <NotificationProvider>
        <div className="flex min-h-screen">
          {!isSessionPage && <Sidebar />}
          <div className="flex flex-1 flex-col">

            {/* Navbar — slides up when scrolling, reappears when stopped */}
            {!isSessionPage && (
              <div
                className={`sticky top-0 z-50 transition-all duration-300 ease-in-out ${navbarVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-full pointer-events-none"
                  }`}
              >
                <Navbar />
              </div>
            )}

            <main className={`flex-1 overflow-y-auto bg-[#f2f3fa] ${isSessionPage ? "p-0" : "p-6"}`}>
              {children}
            </main>

          </div>
        </div>
      </NotificationProvider>
    </AuthProvider>
  );
}
