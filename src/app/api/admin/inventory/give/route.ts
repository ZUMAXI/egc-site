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

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("nickname, telegram_name, telegram_username")
    .eq("id", body.profile_id)
    .single();

  const { data: item } = await supabaseAdmin
    .from("shop_items")
    .select("name")
    .eq("id", body.shop_item_id)
    .single();

  const result = await supabaseAdmin.from("inventory").insert({
    profile_id: Number(body.profile_id),
    shop_item_id: Number(body.shop_item_id),
  });

  if (result.error) {
    return NextResponse.json(
      { error: result.error.message },
      { status: 500 }
    );
  }

  const adminName =
    admin?.nickname ||
    admin?.telegram_name ||
    admin?.telegram_username ||
    "Администратор";

  const profileName =
    profile?.nickname ||
    profile?.telegram_name ||
    profile?.telegram_username ||
    "Участник";

  await supabaseAdmin.from("admin_logs").insert({
    admin_name: adminName,
    action: `Выдал предмет "${item?.name}" участнику ${profileName}`,
  });

  return NextResponse.json({ ok: true });
}