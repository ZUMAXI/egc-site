import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const data = {
    name: body.name,
    description: body.description,
    image_url: body.image_url,
    sort_order: Number(body.sort_order || 1),
    leader_profile_id: body.leader_profile_id
      ? Number(body.leader_profile_id)
      : null,
  };

  if (body.id) {
    await supabaseAdmin.from("allies").update(data).eq("id", body.id);
  } else {
    await supabaseAdmin.from("allies").insert(data);
  }

  return NextResponse.json({ ok: true });
}