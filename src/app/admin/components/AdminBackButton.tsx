"use client";

import { useRouter } from "next/navigation";

export default function AdminBackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/admin")}
      className="mb-6 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-bold text-white transition hover:bg-white/10"
    >
      ← Назад в админ-панель
    </button>
  );
}