import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const telegramId = cookieStore.get("egc_user")?.value;

  if (!telegramId) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const body = await request.json();

  await supabaseAdmin
    .from("profiles")
    .update({
      nickname: body.nickname,
      bio: body.bio,
      avatar_url: body.avatar_url,
    })
    .eq("telegram_id", telegramId);

  return NextResponse.json({ ok: true });
}