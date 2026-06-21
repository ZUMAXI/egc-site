"use client";

import { useEffect, useRef } from "react";

export default function TelegramLoginButton() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    ref.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", "egc_account_bot");
    script.setAttribute("data-size", "large");
    script.setAttribute(
      "data-auth-url",
      "https://egc-site.vercel.app/api/auth/telegram"
    );

    ref.current.appendChild(script);
  }, []);

  return <div ref={ref} />;
}