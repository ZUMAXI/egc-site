"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function BuyButton({ itemId }: { itemId: number }) {
  const [buying, setBuying] = useState(false);

  async function buyItem() {
    setBuying(true);

    const res = await fetch("/api/shop/buy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ item_id: itemId }),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success("Товар успешно куплен!");

      setTimeout(() => {
        window.location.href = "/profile";
      }, 1000);
    } else {
      toast.error(data.error || "Не удалось купить товар.");
      setBuying(false);
    }
  }

  return (
    <button
      onClick={buyItem}
      disabled={buying}
      className="mt-5 w-full rounded-2xl bg-white px-5 py-3 font-bold text-black transition hover:scale-105 disabled:opacity-50"
    >
      {buying ? "Покупаем..." : "Купить"}
    </button>
  );
}