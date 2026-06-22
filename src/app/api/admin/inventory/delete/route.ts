import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const telegramId = cookieStore.get("egc_user")?.value;

  const body = await request.json();

  const { data: admin } = await supabaseAdmin
    .from("profiles")
    .select("nickname, telegram_name, telegram_username")
    .eq("telegram_id", telegramId)
    .single();

  const { data: inventory } = await supabaseAdmin
    .from("inventory")
    .select(`
      id,
      owner:profiles (
        nickname,
        telegram_name,
        telegram_username
      ),
      item:shop_items (
        name
      )
    `)
    .eq("id", body.id)
    .single();

  await supabaseAdmin.from("inventory").delete().eq("id", body.id);

  const owner = Array.isArray(inventory?.owner)
    ? inventory?.owner[0]
    : inventory?.owner;

  const item = Array.isArray(inventory?.item)
    ? inventory?.item[0]
    : inventory?.item;

  const adminName =
    admin?.nickname ||
    admin?.telegram_name ||
    admin?.telegram_username ||
    "Администратор";

  const ownerName =
    owner?.nickname ||
    owner?.telegram_name ||
    owner?.telegram_username ||
    "Участник";

  const itemName = item?.name || "Предмет";

  await supabaseAdmin.from("admin_logs").insert({
    admin_name: adminName,
    action: `Удалил предмет "${itemName}" у ${ownerName}`,
  });

  return NextResponse.json({ ok: true });
}