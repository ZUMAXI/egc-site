import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

function getName(profile: any) {
  return (
    profile?.nickname ||
    profile?.telegram_name ||
    profile?.telegram_username ||
    "Участник"
  );
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const telegramId = cookieStore.get("egc_user")?.value;

  if (!telegramId) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const { data: currentUser } = await supabaseAdmin
    .from("profiles")
    .select("id, nickname, telegram_name, telegram_username, access_role")
    .eq("telegram_id", telegramId)
    .single();

  const currentAccessRole = currentUser?.access_role || "guest";

  if (currentAccessRole !== "host" && currentAccessRole !== "admin") {
    return NextResponse.json({ error: "No access" }, { status: 403 });
  }

  const body = await request.json();

  const { data: oldProfile } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", body.id)
    .single();

  if (!oldProfile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const updateData: any = {
    position: body.position,
    rank: body.rank || "ГОСТЬ",
    steps: body.steps,
    moves: body.moves,
    bio: body.bio,
    avatar_url: body.avatar_url,
  };

  if (currentAccessRole === "host") {
    updateData.access_role = body.access_role;
  }

  const result = await supabaseAdmin
    .from("profiles")
    .update(updateData)
    .eq("id", body.id);

  if (result.error) {
    return NextResponse.json({ error: result.error.message }, { status: 500 });
  }

  const adminName = getName(currentUser);
  const targetName = getName(oldProfile);
  const logs: any[] = [];

  function addLog(action: string) {
    logs.push({
      admin_profile_id: currentUser?.id || null,
      admin_name: adminName,
      action,
    });
  }

  if (oldProfile.position !== updateData.position) {
    addLog(
      `Изменил должность участника "${targetName}": "${oldProfile.position || "Guest"}" → "${updateData.position || "Guest"}"`
    );
  }

  if (oldProfile.rank !== updateData.rank) {
    addLog(
      `Изменил ранг участника "${targetName}": "${oldProfile.rank || "ГОСТЬ"}" → "${updateData.rank || "ГОСТЬ"}"`
    );
  }

  if (
    currentAccessRole === "host" &&
    oldProfile.access_role !== updateData.access_role
  ) {
    addLog(
      `Изменил доступ участника "${targetName}": "${oldProfile.access_role || "guest"}" → "${updateData.access_role || "guest"}"`
    );
  }

  const oldSteps = Number(oldProfile.steps || 0);
  const newSteps = Number(updateData.steps || 0);
  const oldMoves = Number(oldProfile.moves || 0);
  const newMoves = Number(updateData.moves || 0);

  if (oldSteps !== newSteps || oldMoves !== newMoves) {
    const stepsDiff = newSteps - oldSteps;
    const movesDiff = newMoves - oldMoves;

    if (body.reward_reason) {
      addLog(
        `Начислил награду "${body.reward_reason}" участнику "${targetName}": шаги ${stepsDiff >= 0 ? "+" : ""}${stepsDiff}, ходы ${movesDiff >= 0 ? "+" : ""}${movesDiff}`
      );
    } else {
      addLog(
        `Вручную изменил валюту участника "${targetName}": шаги ${oldSteps} → ${newSteps}, ходы ${oldMoves} → ${newMoves}`
      );
    }
  }

  if (oldProfile.bio !== updateData.bio) {
    addLog(`Изменил описание профиля участника "${targetName}"`);
  }

  if (oldProfile.avatar_url !== updateData.avatar_url) {
    addLog(`Изменил аватар участника "${targetName}"`);
  }

  if (logs.length > 0) {
    await supabaseAdmin.from("admin_logs").insert(logs);
  }

  return NextResponse.json({ ok: true });
}