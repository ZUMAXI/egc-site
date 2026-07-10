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

    const { data: currentUser, error: userError } = await supabaseAdmin
      .from("profiles")
      .select(
        "nickname, telegram_name, telegram_username, access_role"
      )
      .eq("telegram_id", telegramId)
      .maybeSingle();

    if (userError) {
      console.error("Rules current user error:", userError);

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

    const content =
      typeof body.content === "string" ? body.content.trim() : "";

    const sortOrder = Number(body.sort_order || 1);

    if (!title) {
      return NextResponse.json(
        { error: "Укажи название правила." },
        { status: 400 }
      );
    }

    if (!content || content === "<p></p>") {
      return NextResponse.json(
        { error: "Добавь текст правила." },
        { status: 400 }
      );
    }

    if (!Number.isFinite(sortOrder) || sortOrder < 1) {
      return NextResponse.json(
        { error: "Порядок отображения должен быть больше нуля." },
        { status: 400 }
      );
    }

    const ruleData = {
      title,
      content,
      sort_order: sortOrder,
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
      console.error("Rule admin log error:", logError);
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