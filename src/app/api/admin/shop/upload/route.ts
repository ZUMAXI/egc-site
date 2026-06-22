import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  const ext = file.name.split(".").pop();

  const fileName =
    Date.now() + "-" + Math.random().toString(36).slice(2) + "." + ext;

  const { error } = await supabaseAdmin.storage
    .from("shop-images")
    .upload(fileName, file);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  const { data } = supabaseAdmin.storage
    .from("shop-images")
    .getPublicUrl(fileName);

  return NextResponse.json({ url: data.publicUrl });
}