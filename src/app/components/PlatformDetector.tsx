"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        platform?: string;
        ready?: () => void;
        expand?: () => void;
      };
    };
  }
}

const telegramDesktopPlatforms = [
  "tdesktop",
  "macos",
  "weba",
  "webk",
  "web",
];

const telegramMobilePlatforms = [
  "android",
  "android_x",
  "ios",
];

export default function PlatformDetector() {
  useEffect(() => {
    const root = document.documentElement;
    const telegramWebApp = window.Telegram?.WebApp;
    const platform = telegramWebApp?.platform?.toLowerCase() || "";

    root.classList.remove(
      "telegram-desktop",
      "telegram-mobile",
      "browser-desktop",
      "browser-mobile"
    );

    if (telegramWebApp) {
      telegramWebApp.ready?.();
      telegramWebApp.expand?.();

      if (telegramMobilePlatforms.includes(platform)) {
        root.classList.add("telegram-mobile");
      } else if (telegramDesktopPlatforms.includes(platform)) {
        root.classList.add("telegram-desktop");
      } else if (window.innerWidth >= 900) {
        root.classList.add("telegram-desktop");
      } else {
        root.classList.add("telegram-mobile");
      }

      return;
    }

    if (window.innerWidth >= 900) {
      root.classList.add("browser-desktop");
    } else {
      root.classList.add("browser-mobile");
    }

    function handleResize() {
      root.classList.toggle("browser-desktop", window.innerWidth >= 900);
      root.classList.toggle("browser-mobile", window.innerWidth < 900);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return null;
}