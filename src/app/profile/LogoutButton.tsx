"use client";

export default function LogoutButton() {
  async function logout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    window.location.href = "/login";
  }

  return (
    <button
      onClick={logout}
      className="mt-4 inline-block rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-bold text-white transition hover:bg-white/10"
    >
      Выйти из аккаунта
    </button>
  );
}