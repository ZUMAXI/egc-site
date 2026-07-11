import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

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

    const { data: currentUser, error: userError } =
      await supabaseAdmin
        .from("profiles")
        .select(
          "nickname, telegram_name, telegram_username, access_role"
        )
        .eq("telegram_id", telegramId)
        .maybeSingle();

    if (userError) {
      console.error("Rules user error:", userError);

      return NextResponse.json(
        { error: "Не удалось проверить пользователя." },
        { status: 500 }
      );
    }

    if (
      !currentUser ||
      !["admin", "host"].includes(currentUser.access_role || "")
    ) {
      return NextResponse.json(
        { error: "Недостаточно прав." },
        { status: 403 }
      );
    }

    const body = await request.json();

    const title =
      typeof body.title === "string" ? body.title.trim() : "";

    const category =
      typeof body.category === "string"
        ? body.category.trim()
        : "Правила";

    const content =
      typeof body.content === "string"
        ? body.content.trim()
        : "";

    const imageUrl =
      typeof body.image_url === "string"
        ? body.image_url.trim()
        : "";

    const orderNumber = Number(body.order_number || 1);

    if (!title) {
      return NextResponse.json(
        { error: "Укажи название правила." },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { error: "Укажи категорию правила." },
        { status: 400 }
      );
    }

    if (!content || content === "<p></p>") {
      return NextResponse.json(
        { error: "Добавь текст правила." },
        { status: 400 }
      );
    }

    if (
      !Number.isFinite(orderNumber) ||
      orderNumber < 1
    ) {
      return NextResponse.json(
        { error: "Порядок должен быть больше нуля." },
        { status: 400 }
      );
    }

    const ruleData = {
      title,
      category,
      content,
      order_number: orderNumber,
      image_url: imageUrl || null,
    };

    let savedRule;

    if (body.id) {
      const { data, error } = await supabaseAdmin
        .from("rules")
        .update(ruleData)
        .eq("id", body.id)
        .select()
        .single();

      if (error) {
        console.error("Rule update error:", error);

        return NextResponse.json(
          {
            error: "Не удалось обновить правило.",
            details: error.message,
          },
          { status: 500 }
        );
      }

      savedRule = data;
    } else {
      const { data, error } = await supabaseAdmin
        .from("rules")
        .insert(ruleData)
        .select()
        .single();

      if (error) {
        console.error("Rule insert error:", error);

        return NextResponse.json(
          {
            error: "Не удалось создать правило.",
            details: error.message,
          },
          { status: 500 }
        );
      }

      savedRule = data;
    }

    const adminName =
      currentUser.nickname ||
      currentUser.telegram_name ||
      currentUser.telegram_username ||
      "Администратор";

    const { error: logError } = await supabaseAdmin
      .from("admin_logs")
      .insert({
        admin_name: adminName,
        action: body.id
          ? `Изменил правило "${title}"`
          : `Создал правило "${title}"`,
      });

    if (logError) {
      console.error("Rule log error:", logError);
    }

    return NextResponse.json({
      ok: true,
      rule: savedRule,
    });
  } catch (error) {
    console.error("Save rule error:", error);

    return NextResponse.json(
      { error: "Произошла ошибка при сохранении правила." },
      { status: 500 }
    );
  }
}