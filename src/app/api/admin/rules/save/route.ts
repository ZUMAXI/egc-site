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

async function sendRulesBroadcast(rule: {
  title: string;
  category: string;
}) {
  const { data: profiles, error } = await supabaseAdmin
    .from("profiles")
    .select("telegram_id")
    .not("telegram_id", "is", null);

  if (error) {
    console.error("Rules broadcast profiles error:", error);

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
    "📜 <b>Добавлены новые правила EgC</b>",
    "",
    `<b>${escapeTelegramHtml(rule.title)}</b>`,
    "",
    `Категория: ${escapeTelegramHtml(
      rule.category || "Правила"
    )}`,
    "",
    "Откройте приложение, чтобы ознакомиться с правилами полностью.",
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
                text: "📜 Открыть правила",
                url: `${siteUrl}/rules`,
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
      error: userError,
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

    if (userError) {
      console.error("Rules user error:", userError);

      return NextResponse.json(
        {
          error:
            "Не удалось проверить пользователя.",
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

    const orderNumber = Number(
      body.order_number || 1
    );

    if (!title) {
      return NextResponse.json(
        {
          error: "Укажи название правила.",
        },
        {
          status: 400,
        }
      );
    }

    if (!category) {
      return NextResponse.json(
        {
          error: "Укажи категорию правила.",
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
          error: "Добавь текст правила.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !Number.isFinite(orderNumber) ||
      orderNumber < 1
    ) {
      return NextResponse.json(
        {
          error:
            "Порядок должен быть больше нуля.",
        },
        {
          status: 400,
        }
      );
    }

    const ruleData = {
      title,
      category,
      content,
      order_number: orderNumber,
      image_url: imageUrl || null,
    };

    const isEditing = Boolean(body.id);
    let savedRule;

    if (isEditing) {
      const ruleId = Number(body.id);

      if (!Number.isFinite(ruleId)) {
        return NextResponse.json(
          {
            error: "Некорректный ID правила.",
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
        .from("rules")
        .update(ruleData)
        .eq("id", ruleId)
        .select("*")
        .single();

      if (error) {
        console.error(
          "Rule update error:",
          error
        );

        return NextResponse.json(
          {
            error:
              "Не удалось обновить правило.",
            details: error.message,
          },
          {
            status: 500,
          }
        );
      }

      savedRule = data;
    } else {
      const {
        data,
        error,
      } = await supabaseAdmin
        .from("rules")
        .insert(ruleData)
        .select("*")
        .single();

      if (error) {
        console.error(
          "Rule insert error:",
          error
        );

        return NextResponse.json(
          {
            error:
              "Не удалось создать правило.",
            details: error.message,
          },
          {
            status: 500,
          }
        );
      }

      savedRule = data;
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
          ? "rule_update"
          : "rule_create",
        target_name: title,
        action: isEditing
          ? `Изменил правило "${title}"`
          : `Создал правило "${title}"`,
      });

    if (logError) {
      console.error(
        "Rule log error:",
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
     * нового раздела правил.
     *
     * При редактировании существующего правила
     * повторного уведомления не будет.
     */
    if (!isEditing) {
      notification =
        await sendRulesBroadcast({
          title,
          category,
        });
    }

    return NextResponse.json({
      ok: true,
      rule: savedRule,
      notification,
    });
  } catch (error) {
    console.error(
      "Save rule error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Произошла ошибка при сохранении правила.",
      },
      {
        status: 500,
      }
    );
  }
}