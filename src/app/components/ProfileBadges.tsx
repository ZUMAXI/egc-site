type Props = {
  position?: string | null;
  accessRole?: string | null;
};

function getPositionStyle(position?: string | null) {
  if (position === "Host") {
    return {
      label: "✦ Host",
      className: "border-red-500/40 bg-red-500/20 text-red-300 shadow-[0_0_18px_rgba(239,68,68,0.25)]",
    };
  }

  if (position === "Clerk") {
    return {
      label: "✧ Clerk",
      className: "border-amber-500/40 bg-amber-500/20 text-amber-300 shadow-[0_0_18px_rgba(245,158,11,0.2)]",
    };
  }

  if (position?.startsWith("White ")) {
    return {
      label: getChessLabel(position),
      className: "border-white/50 bg-white text-black",
    };
  }

  if (position?.startsWith("Black ")) {
    return {
      label: getChessLabel(position),
      className: "border-zinc-400/40 bg-zinc-950 text-white shadow-[0_0_18px_rgba(255,255,255,0.12)]",
    };
  }

  return {
    label: "♟ Guest",
    className: "border-zinc-500/30 bg-zinc-500/20 text-zinc-300",
  };
}

function getChessLabel(position?: string | null) {
  const icons: Record<string, string> = {
    "White King": "♔",
    "Black King": "♚",
    "White Queen": "♕",
    "Black Queen": "♛",
    "White Bishop": "♗",
    "Black Bishop": "♝",
    "White Knight": "♘",
    "Black Knight": "♞",
    "White Rook": "♖",
    "Black Rook": "♜",
  };

  return `${icons[position || ""] || "♟"} ${position || "Guest"}`;
}

function getAccessStyle(accessRole?: string | null) {
  switch (accessRole) {
    case "host":
      return {
        label: "✦ Host",
        className: "border-red-500/40 bg-red-500/20 text-red-300",
      };

    case "admin":
      return {
        label: "🛡 Админ",
        className: "border-yellow-500/40 bg-yellow-500/20 text-yellow-300",
      };

    case "member":
      return {
        label: "👤 Участник",
        className: "border-blue-500/40 bg-blue-500/20 text-blue-300",
      };

    default:
      return {
        label: "👥 Гость",
        className: "border-zinc-500/30 bg-zinc-500/20 text-zinc-300",
      };
  }
}

export default function ProfileBadges({ position, accessRole }: Props) {
  const positionBadge = getPositionStyle(position);
  const accessBadge = getAccessStyle(accessRole);

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      <div
        className={`rounded-full border px-3 py-1 text-sm font-semibold ${positionBadge.className}`}
      >
        {positionBadge.label}
      </div>

      <div
        className={`rounded-full border px-3 py-1 text-sm font-semibold ${accessBadge.className}`}
      >
        {accessBadge.label}
      </div>
    </div>
  );
}