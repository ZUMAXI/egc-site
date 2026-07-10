"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type TelegramWebApp = {
  initData?: string;
  ready?: () => void;
  expand?: () => void;
};

type TelegramWindow = Window & {
  Telegram?: {
    WebApp?: TelegramWebApp;
  };
};

export default function TelegramLoginButton() {
  const [loading, setLoading] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    const telegramWindow = window as TelegramWindow;

    if (telegramWindow.Telegram?.WebApp) {
      telegramWindow.Telegram.WebApp.ready?.();
      telegramWindow.Telegram.WebApp.expand?.();
      setScriptReady(true);
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://telegram.org/js/telegram-web-app.js"]'
    ) as HTMLScriptElement | null;

    if (existingScript) {
      const checkTelegram = window.setInterval(() => {
        if (telegramWindow.Telegram?.WebApp) {
          window.clearInterval(checkTelegram);
          telegramWindow.Telegram.WebApp.ready?.();
          telegramWindow.Telegram.WebApp.expand?.();
          setScriptReady(true);
        }
      }, 100);

      const timeout = window.setTimeout(() => {
        window.clearInterval(checkTelegram);
      }, 5000);

      return () => {
        window.clearInterval(checkTelegram);
        window.clearTimeout(timeout);
      };
    }

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-web-app.js";
    script.async = true;

    script.onload = () => {
      telegramWindow.Telegram?.WebApp?.ready?.();
      telegramWindow.Telegram?.WebApp?.expand?.();
      setScriptReady(true);
    };

    script.onerror = () => {
      toast.error("Не удалось загрузить Telegram.");
    };

    document.head.appendChild(script);

    return () => {
      script.onload = null;
      script.onerror = null;
    };
  }, []);

  async function login() {
    if (loading) return;

    setLoading(true);

    try {
      const telegramWindow = window as TelegramWindow;
      const telegramWebApp = telegramWindow.Telegram?.WebApp;

      telegramWebApp?.ready?.();
      telegramWebApp?.expand?.();

      const initData = telegramWebApp?.initData;

      if (!initData) {
        toast.error(
          "Открой сайт через кнопку «Войти в EgC» внутри Telegram-бота."
        );
        setLoading(false);
        return;
      }

      const res = await fetch("/api/auth/telegram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ initData }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        toast.error(data?.error || "Ошибка входа через Telegram.");
        setLoading(false);
        return;
      }

      toast.success("Вход выполнен!");

      setTimeout(() => {
        window.location.href = "/profile";
      }, 700);
    } catch {
      toast.error("Не удалось выполнить вход.");
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-3">
      <button
        type="button"
        onClick={login}
        disabled={loading}
        className="w-fit rounded-2xl bg-white px-7 py-3 font-bold text-black transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Входим..." : "Войти через Telegram"}
      </button>

      {!scriptReady ? (
        <p className="text-sm text-zinc-500">
          Подключаем Telegram…
        </p>
      ) : null}
    </div>
  );
}