import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const data = {
    title: body.title,
    category: body.category,
    content: body.content,
    sort_order: Number(body.sort_order || 1),
  };

  if (body.id) {
    await supabaseAdmin.from("lore").update(data).eq("id", body.id);
  } else {
    await supabaseAdmin.from("lore").insert(data);
  }

  return NextResponse.json({ ok: true });
}