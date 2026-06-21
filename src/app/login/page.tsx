import Script from "next/script";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-3 text-5xl font-black">Вход в EgC</h1>

        <p className="mb-10 text-zinc-400">
          Войди через Telegram, чтобы создать профиль на сайте.
        </p>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-3xl font-bold">Telegram аккаунт</h2>

          <p className="mt-4 text-zinc-300">
            После входа сайт автоматически создаст тебе профиль со статусом
            guest.
          </p>

          <div className="mt-8">
            <Script
              async
              src="https://telegram.org/js/telegram-widget.js?22"
              data-telegram-login="egc_account_bot"
              data-size="large"
              data-auth-url="https://egc-site.vercel.app/api/auth/telegram"
              data-request-access="write"
            />
          </div>
        </div>
      </div>
    </main>
  );
}