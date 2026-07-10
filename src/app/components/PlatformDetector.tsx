"use client";

import { useEffect } from "react";

type TelegramWebApp = {
  platform?: string;
  version?: string;
  ready?: () => void;
  expand?: () => void;
  requestFullscreen?: () => void;
  isVersionAtLeast?: (version: string) => boolean;
};

type TelegramWindow = Window & {
  Telegram?: {
    WebApp?: TelegramWebApp;
  };
};

const desktopPlatforms = [
  "tdesktop",
  "macos",
  "weba",
  "webk",
  "web",
];

const mobilePlatforms = [
  "android",
  "android_x",
  "ios",
];

export default function PlatformDetector() {
  useEffect(() => {
    const root = document.documentElement;
    const telegramWindow = window as TelegramWindow;
    const telegramWebApp = telegramWindow.Telegram?.WebApp;

    const platform =
      telegramWebApp?.platform?.toLowerCase() || "";

    function clearClasses() {
      root.classList.remove(
        "telegram-desktop",
        "telegram-mobile",
        "browser-desktop",
        "browser-mobile"
      );
    }

    function applyBrowserClass() {
      clearClasses();

      if (window.innerWidth >= 900) {
        root.classList.add("browser-desktop");
      } else {
        root.classList.add("browser-mobile");
      }
    }

    clearClasses();

    if (!telegramWebApp) {
      applyBrowserClass();

      window.addEventListener("resize", applyBrowserClass);

      return () => {
        window.removeEventListener("resize", applyBrowserClass);
      };
    }

    telegramWebApp.ready?.();
    telegramWebApp.expand?.();

    const isMobile = mobilePlatforms.includes(platform);
    const isDesktop =
      desktopPlatforms.includes(platform) || !isMobile;

    if (isMobile) {
      root.classList.add("telegram-mobile");
    }

    if (isDesktop) {
      root.classList.add("telegram-desktop");

      const supportsFullscreen =
        telegramWebApp.isVersionAtLeast?.("8.0") ?? false;

      if (supportsFullscreen) {
        try {
          telegramWebApp.requestFullscreen?.();
        } catch (error) {
          console.error("Не удалось открыть Mini App на весь экран:", error);
        }
      }
    }
  }, []);

  return null;
}