import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const telegramId = cookieStore.get("egc_user")?.value;

  if (!telegramId) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const { data: currentUser } = await supabaseAdmin
    .from("profiles")
    .select("nickname, telegram_name, telegram_username")
    .eq("telegram_id", telegramId)
    .single();

  const body = await request.json();

  const data = {
    name: body.name || null,
    status: body.status || "🤝 Союз",
    description: body.description || null,
    image_url: body.image_url || null,
    sort_order: Number(body.sort_order || 1),
    leader_profile_id: body.leader_profile_id
      ? Number(body.leader_profile_id)
      : null,
  };

  const result = body.id
    ? await supabaseAdmin.from("allies").update(data).eq("id", body.id)
    : await supabaseAdmin.from("allies").insert(data);

  if (result.error) {
    return NextResponse.json(
      { error: result.error.message },
      { status: 500 }
    );
  }

  const adminName =
    currentUser?.nickname ||
    currentUser?.telegram_name ||
    currentUser?.telegram_username ||
    "Администратор";

  await supabaseAdmin.from("admin_logs").insert({
    admin_name: adminName,
    action: body.id
      ? `Изменил союз "${body.name}"`
      : `Создал союз "${body.name}"`,
  });

  return NextResponse.json({ ok: true });
}