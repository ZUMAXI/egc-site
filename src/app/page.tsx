export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold mb-4">
        ♟ The Eternal Game of Chess
      </h1>

      <p className="text-xl text-gray-400 mb-10">
        Добро пожаловать в вечную игру.
      </p>

      <div className="flex gap-4">
        <button className="rounded-xl bg-white text-black px-6 py-3 font-semibold">
          Новости
        </button>

        <button className="rounded-xl border border-white px-6 py-3">
          Участники
        </button>
      </div>
    </main>
  );
}