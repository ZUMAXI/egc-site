type Props = {
  avatarUrl?: string | null;
  nickname?: string | null;
  accessRole?: string | null;
  size?: number;
};

export default function ProfileAvatar({
  avatarUrl,
  nickname,
  accessRole,
  size = 80,
}: Props) {
  function borderClass() {
    switch (accessRole) {
      case "host":
        return "border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]";

      case "admin":
        return "border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.4)]";

      default:
        return "border-zinc-500";
    }
  }

  return (
    <div
      className={`overflow-hidden rounded-full border-4 ${borderClass()}`}
      style={{
        width: size,
        height: size,
      }}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={nickname || "Участник"}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-white/10 text-3xl">
          ♟
        </div>
      )}
    </div>
  );
}