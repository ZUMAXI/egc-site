import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const allowedTypes = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
];

const maxFileSize = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const telegramId = cookieStore.get("egc_user")?.value;

    if (!telegramId) {
      return NextResponse.json(
        { error: "Необходимо войти в аккаунт." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Файл не выбран." },
        { status: 400 }
      );
    }

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Поддерживаются только PNG, JPG, WEBP и GIF." },
        { status: 400 }
      );
    }

    if (file.size > maxFileSize) {
      return NextResponse.json(
        { error: "Размер изображения не должен превышать 5 МБ." },
        { status: 400 }
      );
    }

    const extension =
      file.name.split(".").pop()?.toLowerCase() ||
      file.type.split("/").pop() ||
      "jpg";

    const safeExtension = extension === "jpeg" ? "jpg" : extension;

    const filePath = `${telegramId}/avatar-${Date.now()}.${safeExtension}`;

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabaseAdmin.storage
      .from("avatars")
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error("Avatar upload error:", uploadError);

      return NextResponse.json(
        { error: "Не удалось загрузить изображение." },
        { status: 500 }
      );
    }

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from("avatars").getPublicUrl(filePath);

    return NextResponse.json({
      ok: true,
      url: publicUrl,
    });
  } catch (error) {
    console.error("Upload avatar error:", error);

    return NextResponse.json(
      { error: "Произошла ошибка при загрузке аватара." },
      { status: 500 }
    );
  }
}