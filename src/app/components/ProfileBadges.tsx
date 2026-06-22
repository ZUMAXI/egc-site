type Props = {
  position?: string | null;
  accessRole?: string | null;
};

export default function ProfileBadges({
  position,
  accessRole,
}: Props) {
  function roleClass() {
    switch (accessRole) {
      case "host":
        return "bg-red-500/20 text-red-300 border-red-500/30";

      case "admin":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";

      default:
        return "bg-zinc-500/20 text-zinc-300 border-zinc-500/30";
    }
  }

  function positionClass() {
    switch (position) {
      case "Black King":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";

      case "White King":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";

      default:
        return "bg-white/10 text-zinc-300 border-white/10";
    }
  }

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      <div
        className={`rounded-full border px-3 py-1 text-sm font-semibold ${positionClass()}`}
      >
        👑 {position || "Guest"}
      </div>

      <div
        className={`rounded-full border px-3 py-1 text-sm font-semibold ${roleClass()}`}
      >
        🛡 {accessRole || "guest"}
      </div>
    </div>
  );
}