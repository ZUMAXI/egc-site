export default function LoginPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-3 text-5xl font-black">Вход в EgC</h1>

        <p className="mb-10 text-zinc-400">
          Позже здесь будет вход через Telegram. После входа профиль будет
          создаваться автоматически.
        </p>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-3xl font-bold">Telegram аккаунт</h2>

          <p className="mt-4 text-zinc-300">
            Для регистрации понадобится Telegram. Гость сможет создать профиль,
            а администрация потом выдаст роль участника или админа.
          </p>

          <button className="mt-8 rounded-2xl bg-white px-7 py-3 font-bold text-black">
            Войти через Telegram
          </button>

          <p className="mt-4 text-sm text-zinc-500">
            Кнопка пока декоративная. Следующим шагом подключим настоящую
            авторизацию через Telegram Bot.
          </p>
        </div>
      </div>
    </main>
  );
}