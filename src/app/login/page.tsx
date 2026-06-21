import TelegramLoginButton from "./TelegramLoginButton";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-3 text-5xl font-black">Вход в EgC</h1>

        <p className="mb-10 text-zinc-400">
          Открой эту страницу через кнопку бота Telegram.
        </p>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-3xl font-bold">Telegram аккаунт</h2>

          <p className="mt-4 text-zinc-300">
            Если ты открыл сайт через кнопку «Войти в EgC» в боте, нажми кнопку ниже.
          </p>

          <div className="mt-8">
            <TelegramLoginButton />
          </div>
        </div>
      </div>
    </main>
  );
}