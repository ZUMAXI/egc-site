import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import {
  escapeTelegramHtml,
  sendTelegramMessage,
} from "@/lib/telegramBot";

function getName(profile: any) {
  return (
    profile?.nickname ||
    profile?.telegram_name ||
    profile?.telegram_username ||
    "Администратор"
  );
}

async function sendNewsBroadcast(title: string, author: string) {
  const { data: profiles, error } = await supabaseAdmin
    .from("profiles")
    .select("telegram_id")
    .not("telegram_id", "is", null);

  if (error) {
    console.error("News broadcast profiles error:", error);

    return {
      total: 0,
      sent: 0,
      failed: 0,
    };
  }

  const telegramIds = Array.from(
    new Set(
      (profiles || [])
        .map((profile) => String(profile.telegram_id || "").trim())
        .filter(Boolean)
    )
  );

  if (telegramIds.length === 0) {
    return {
      total: 0,
      sent: 0,
      failed: 0,
    };
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "";

  const text = [
    "📰 <b>Новая новость EgC</b>",
    "",
    `<b>${escapeTelegramHtml(title)}</b>`,
    "",
    author
      ? `Автор: ${escapeTelegramHtml(author)}`
      : "Автор: EgC",
    "",
    "Полная новость уже доступна в приложении.",
  ].join("\n");

  let sent = 0;
  let failed = 0;

  /*
   * Отправляем небольшими группами, чтобы не создавать
   * слишком много запросов к Telegram одновременно.
   */
  const batchSize = 15;

  for (let index = 0; index < telegramIds.length; index += batchSize) {
    const batch = telegramIds.slice(index, index + batchSize);

    const results = await Promise.all(
      batch.map((chatId) =>
        sendTelegramMessage({
          chatId,
          text,
          button: siteUrl
            ? {
                text: "📖 Читать новость",
                url: `${siteUrl}/news`,
              }
            : undefined,
        })
      )
    );

    for (const result of results) {
      if (result.ok) {
        sent += 1;
      } else {
        failed += 1;
      }
    }
  }

  return {
    total: telegramIds.length,
    sent,
    failed,
  };
}

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

    const { data: currentUser, error: currentUserError } =
      await supabaseAdmin
        .from("profiles")
        .select(
          "id, access_role, nickname, telegram_name, telegram_username"
        )
        .eq("telegram_id", telegramId)
        .maybeSingle();

    if (currentUserError) {
      console.error("News current user error:", currentUserError);

      return NextResponse.json(
        { error: "Не удалось проверить администратора." },
        { status: 500 }
      );
    }

    const accessRole = currentUser?.access_role || "guest";

    if (
      !currentUser ||
      (accessRole !== "host" && accessRole !== "admin")
    ) {
      return NextResponse.json(
        { error: "Недостаточно прав." },
        { status: 403 }
      );
    }

    const body = await request.json();

    const title =
      typeof body.title === "string"
        ? body.title.trim()
        : "";

    const content =
      typeof body.content === "string"
        ? body.content.trim()
        : "";

    const author =
      typeof body.author === "string"
        ? body.author.trim()
        : "";

    const imageUrl =
      typeof body.image_url === "string"
        ? body.image_url.trim()
        : "";

    if (!title) {
      return NextResponse.json(
        { error: "Укажи заголовок новости." },
        { status: 400 }
      );
    }

    if (!content || content === "<p></p>") {
      return NextResponse.json(
        { error: "Добавь текст новости." },
        { status: 400 }
      );
    }

    const newsData = {
      title,
      content,
      author: author || "EgC",
      image_url: imageUrl || null,
    };

    const isEditing = Boolean(body.id);
    let savedNews;

    if (isEditing) {
      const newsId = Number(body.id);

      if (!Number.isFinite(newsId)) {
        return NextResponse.json(
          { error: "Некорректный ID новости." },
          { status: 400 }
        );
      }

      const { data, error } = await supabaseAdmin
        .from("news")
        .update(newsData)
        .eq("id", newsId)
        .select("*")
        .single();

      if (error) {
        console.error("News update error:", error);

        return NextResponse.json(
          {
            error: "Не удалось обновить новость.",
            details: error.message,
          },
          { status: 500 }
        );
      }

      savedNews = data;
    } else {
      const { data, error } = await supabaseAdmin
        .from("news")
        .insert(newsData)
        .select("*")
        .single();

      if (error) {
        console.error("News insert error:", error);

        return NextResponse.json(
          {
            error: "Не удалось создать новость.",
            details: error.message,
          },
          { status: 500 }
        );
      }

      savedNews = data;
    }

    const adminName = getName(currentUser);

    const { error: logError } = await supabaseAdmin
      .from("admin_logs")
      .insert({
        admin_profile_id: currentUser.id,
        admin_name: adminName,
        action_type: isEditing ? "news_update" : "news_create",
        target_name: title,
        action: isEditing
          ? `Изменил новость "${title}"`
          : `Создал новость "${title}"`,
      });

    if (logError) {
      console.error("News admin log error:", logError);
    }

    let notification = {
      total: 0,
      sent: 0,
      failed: 0,
    };

    /*
     * Рассылка выполняется только при создании новой новости.
     * При обычном редактировании повторного уведомления не будет,
     * чтобы не отправлять пользователям лишние сообщения.
     */
    if (!isEditing) {
      notification = await sendNewsBroadcast(
        title,
        author || "EgC"
      );
    }

    return NextResponse.json({
      ok: true,
      news: savedNews,
      notification,
    });
  } catch (error) {
    console.error("Save news error:", error);

    return NextResponse.json(
      {
        error: "Произошла ошибка при сохранении новости.",
      },
      { status: 500 }
    );
  }
}