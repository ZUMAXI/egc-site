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

async function sendLoreBroadcast(chapter: {
  title: string;
  chapter_number: number;
  is_finished: boolean;
}) {
  const { data: profiles, error } = await supabaseAdmin
    .from("profiles")
    .select("telegram_id")
    .not("telegram_id", "is", null);

  if (error) {
    console.error("Lore broadcast profiles error:", error);

    return {
      total: 0,
      sent: 0,
      failed: 0,
    };
  }

  const telegramIds = Array.from(
    new Set(
      (profiles || [])
        .map((profile) =>
          String(profile.telegram_id || "").trim()
        )
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
    "📖 <b>Новая глава лора EgC</b>",
    "",
    `<b>Глава ${chapter.chapter_number}: ${escapeTelegramHtml(
      chapter.title
    )}</b>`,
    "",
    chapter.is_finished
      ? "✅ Глава полностью завершена."
      : "🚧 Глава пока находится в разработке.",
    "",
    "Откройте приложение, чтобы прочитать продолжение истории.",
  ].join("\n");

  let sent = 0;
  let failed = 0;

  const batchSize = 15;

  for (
    let index = 0;
    index < telegramIds.length;
    index += batchSize
  ) {
    const batch = telegramIds.slice(
      index,
      index + batchSize
    );

    const results = await Promise.all(
      batch.map((chatId) =>
        sendTelegramMessage({
          chatId,
          text,
          button: siteUrl
            ? {
                text: "📖 Открыть лор",
                url: `${siteUrl}/lore`,
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
    const telegramId =
      cookieStore.get("egc_user")?.value;

    if (!telegramId) {
      return NextResponse.json(
        {
          error: "Необходимо войти в аккаунт.",
        },
        {
          status: 401,
        }
      );
    }

    const {
      data: currentUser,
      error: currentUserError,
    } = await supabaseAdmin
      .from("profiles")
      .select(
        `
          id,
          nickname,
          telegram_name,
          telegram_username,
          access_role
        `
      )
      .eq("telegram_id", telegramId)
      .maybeSingle();

    if (currentUserError) {
      console.error(
        "Lore current user error:",
        currentUserError
      );

      return NextResponse.json(
        {
          error:
            "Не удалось проверить администратора.",
        },
        {
          status: 500,
        }
      );
    }

    if (
      !currentUser ||
      !["admin", "host"].includes(
        currentUser.access_role || ""
      )
    ) {
      return NextResponse.json(
        {
          error: "Недостаточно прав.",
        },
        {
          status: 403,
        }
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

    const chapterNumber = Number(
      body.chapter_number || 1
    );

    const isFinished =
      body.is_finished === true;

    if (!title) {
      return NextResponse.json(
        {
          error: "Укажи название главы.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !content ||
      content === "<p></p>"
    ) {
      return NextResponse.json(
        {
          error: "Добавь текст главы.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !Number.isFinite(chapterNumber) ||
      chapterNumber < 1
    ) {
      return NextResponse.json(
        {
          error:
            "Номер главы должен быть больше нуля.",
        },
        {
          status: 400,
        }
      );
    }

    const loreData = {
      title,
      chapter_number: chapterNumber,
      content,
      is_finished: isFinished,
    };

    const isEditing = Boolean(body.id);
    let savedChapter;

    if (isEditing) {
      const chapterId = Number(body.id);

      if (!Number.isFinite(chapterId)) {
        return NextResponse.json(
          {
            error: "Некорректный ID главы.",
          },
          {
            status: 400,
          }
        );
      }

      const {
        data,
        error,
      } = await supabaseAdmin
        .from("lore")
        .update(loreData)
        .eq("id", chapterId)
        .select("*")
        .single();

      if (error) {
        console.error(
          "Lore update error:",
          error
        );

        return NextResponse.json(
          {
            error:
              "Не удалось обновить главу лора.",
            details: error.message,
          },
          {
            status: 500,
          }
        );
      }

      savedChapter = data;
    } else {
      const {
        data,
        error,
      } = await supabaseAdmin
        .from("lore")
        .insert(loreData)
        .select("*")
        .single();

      if (error) {
        console.error(
          "Lore insert error:",
          error
        );

        return NextResponse.json(
          {
            error:
              "Не удалось создать главу лора.",
            details: error.message,
          },
          {
            status: 500,
          }
        );
      }

      savedChapter = data;
    }

    const adminName = getName(currentUser);

    const {
      error: logError,
    } = await supabaseAdmin
      .from("admin_logs")
      .insert({
        admin_profile_id:
          currentUser.id || null,
        admin_name: adminName,
        action_type: isEditing
          ? "lore_update"
          : "lore_create",
        target_name: title,
        action: isEditing
          ? `Изменил главу лора "${title}"`
          : `Создал главу лора "${title}"`,
      });

    if (logError) {
      console.error(
        "Lore log error:",
        logError
      );
    }

    let notification = {
      total: 0,
      sent: 0,
      failed: 0,
    };

    /*
     * Рассылка выполняется только при создании
     * новой главы.
     *
     * При редактировании существующей главы
     * повторного уведомления не будет.
     */
    if (!isEditing) {
      notification =
        await sendLoreBroadcast({
          title,
          chapter_number: chapterNumber,
          is_finished: isFinished,
        });
    }

    return NextResponse.json({
      ok: true,
      chapter: savedChapter,
      notification,
    });
  } catch (error) {
    console.error(
      "Save lore error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Произошла ошибка при сохранении главы лора.",
      },
      {
        status: 500,
      }
    );
  }
}