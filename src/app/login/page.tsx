import Link from "next/link";
import TelegramLoginButton from "./TelegramLoginButton";

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
            Сначала открой бота и нажми Start, потом нажми кнопку входа ниже.
          </p>

          <Link
            href="https://t.me/egc_account_bot"
            target="_blank"
            className="mt-6 inline-block rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-bold text-white hover:bg-white/10"
          >
            Открыть бота
          </Link>

          <div className="mt-8">
            <TelegramLoginButton />
          </div>
        </div>
      </div>
    </main>
  );
}