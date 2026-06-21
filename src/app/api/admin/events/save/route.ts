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

  const data = {
    title: body.title,
    type: body.type,
    description: body.description,
    weekday: body.weekday,
    start_time: body.start_time,
    event_date: body.event_date || null,
    status: body.status || "Скоро",
    reward_steps: Number(body.reward_steps || 0),
    reward_moves: Number(body.reward_moves || 0),
    image_url: body.image_url,
  };

  if (body.id) {
    await supabaseAdmin.from("events").update(data).eq("id", body.id);
  } else {
    await supabaseAdmin.from("events").insert(data);
  }

  return NextResponse.json({ ok: true });
}