"use client";

import Script from "next/script";
import { useState } from "react";
import toast from "react-hot-toast";

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData: string;
        ready: () => void;
        expand: () => void;
      };
    };
  }
}

export default function TelegramLoginButton() {
  const [loading, setLoading] = useState(false);

  async function login() {
    setLoading(true);

    window.Telegram?.WebApp?.ready();
    window.Telegram?.WebApp?.expand();

    const initData = window.Telegram?.WebApp?.initData;

    if (!initData) {
      toast.error("Открой сайт через кнопку Open в Telegram.");
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

    if (res.ok) {
      toast.success("Вход выполнен!");

      setTimeout(() => {
        window.location.href = "/profile";
      }, 700);
    } else {
      toast.error("Ошибка входа через Telegram.");
      setLoading(false);
    }
  }

  return (
    <>
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        strategy="beforeInteractive"
      />

      <button
        onClick={login}
        disabled={loading}
        className="rounded-2xl bg-white px-7 py-3 font-bold text-black transition hover:scale-105 disabled:opacity-50"
      >
        {loading ? "Входим..." : "Войти через Telegram"}
      </button>
    </>
  );
}