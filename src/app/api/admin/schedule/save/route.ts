import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const data = {
    day_name: body.day_name,
    start_time: body.start_time || null,
    end_time: body.end_time || null,
    title: body.title,
    accent: body.accent,
    sort_order: Number(body.sort_order || 1),
  };

  const result = body.id
    ? await supabaseAdmin.from("event_schedule").update(data).eq("id", body.id)
    : await supabaseAdmin.from("event_schedule").insert(data);

  if (result.error) {
    return NextResponse.json({ error: result.error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}