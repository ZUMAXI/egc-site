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

function formatEventDate(value: string | null) {
  if (!value) return "";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

async function sendEventBroadcast(event: {
  title: string;
  type: string;
  weekday: string;
  start_time: string;
  event_date: string | null;
  reward_steps: number;
  reward_moves: number;
}) {
  const { data: profiles, error } = await supabaseAdmin
    .from("profiles")
    .select("telegram_id")
    .not("telegram_id", "is", null);

  if (error) {
    console.error("Event broadcast profiles error:", error);

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

  const details: string[] = [];

  if (event.type) {
    details.push(`🎯 Тип: ${escapeTelegramHtml(event.type)}`);
  }

  if (event.weekday) {
    details.push(`🗓 День: ${escapeTelegramHtml(event.weekday)}`);
  }

  if (event.event_date) {
    details.push(
      `📅 Дата: ${escapeTelegramHtml(
        formatEventDate(event.event_date)
      )}`
    );
  }

  if (event.start_time) {
    details.push(
      `🕒 Время: ${escapeTelegramHtml(event.start_time)} МСК`
    );
  }

  if (event.reward_steps > 0 || event.reward_moves > 0) {
    details.push("");
    details.push("<b>Награда:</b>");

    if (event.reward_steps > 0) {
      details.push(`👣 +${event.reward_steps} шагов`);
    }

    if (event.reward_moves > 0) {
      details.push(`♟ +${event.reward_moves} ходов`);
    }
  }

  const text = [
    "📅 <b>Новое событие EgC</b>",
    "",
    `<b>${escapeTelegramHtml(event.title)}</b>`,
    "",
    ...details,
    "",
    "Полная информация уже доступна в приложении.",
  ]
    .filter((line, index, array) => {
      if (line !== "") return true;

      return index === 0 || array[index - 1] !== "";
    })
    .join("\n");

  let sent = 0;
  let failed = 0;

  const batchSize = 15;

  for (
    let index = 0;
    index < telegramIds.length;
    index += batchSize
  ) {
    const batch = telegramIds.slice(index, index + batchSize);

    const results = await Promise.all(
      batch.map((chatId) =>
        sendTelegramMessage({
          chatId,
          text,
          button: siteUrl
            ? {
                text: "📅 Открыть события",
                url: `${siteUrl}/events`,
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
      console.error(
        "Events current user error:",
        currentUserError
      );

      return NextResponse.json(
        { error: "Не удалось проверить администратора." },
        { status: 500 }
      );
    }

    if (
      !currentUser ||
      !["admin", "host"].includes(
        currentUser.access_role || ""
      )
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

    const type =
      typeof body.type === "string"
        ? body.type.trim()
        : "";

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : "";

    const weekday =
      typeof body.weekday === "string"
        ? body.weekday.trim()
        : "";

    const startTime =
      typeof body.start_time === "string"
        ? body.start_time.trim()
        : "";

    const eventDate =
      typeof body.event_date === "string" &&
      body.event_date.trim()
        ? body.event_date.trim()
        : null;

    const status =
      typeof body.status === "string" &&
      body.status.trim()
        ? body.status.trim()
        : "Скоро";

    const rewardSteps = Number(body.reward_steps || 0);
    const rewardMoves = Number(body.reward_moves || 0);

    const imageUrl =
      typeof body.image_url === "string"
        ? body.image_url.trim()
        : "";

    if (!title) {
      return NextResponse.json(
        { error: "Укажи название события." },
        { status: 400 }
      );
    }

    if (
      !description ||
      description === "<p></p>"
    ) {
      return NextResponse.json(
        { error: "Добавь описание события." },
        { status: 400 }
      );
    }

    if (
      !Number.isFinite(rewardSteps) ||
      rewardSteps < 0 ||
      !Number.isFinite(rewardMoves) ||
      rewardMoves < 0
    ) {
      return NextResponse.json(
        { error: "Награда не может быть отрицательной." },
        { status: 400 }
      );
    }

    const eventData = {
      title,
      type,
      description,
      weekday,
      start_time: startTime,
      event_date: eventDate,
      status,
      reward_steps: rewardSteps,
      reward_moves: rewardMoves,
      image_url: imageUrl || null,
    };

    const isEditing = Boolean(body.id);
    let savedEvent;

    if (isEditing) {
      const eventId = Number(body.id);

      if (!Number.isFinite(eventId)) {
        return NextResponse.json(
          { error: "Некорректный ID события." },
          { status: 400 }
        );
      }

      const { data, error } = await supabaseAdmin
        .from("events")
        .update(eventData)
        .eq("id", eventId)
        .select("*")
        .single();

      if (error) {
        console.error("Event update error:", error);

        return NextResponse.json(
          {
            error: "Не удалось обновить событие.",
            details: error.message,
          },
          { status: 500 }
        );
      }

      savedEvent = data;
    } else {
      const { data, error } = await supabaseAdmin
        .from("events")
        .insert(eventData)
        .select("*")
        .single();

      if (error) {
        console.error("Event insert error:", error);

        return NextResponse.json(
          {
            error: "Не удалось создать событие.",
            details: error.message,
          },
          { status: 500 }
        );
      }

      savedEvent = data;
    }

    const adminName = getName(currentUser);

    const { error: logError } = await supabaseAdmin
      .from("admin_logs")
      .insert({
        admin_profile_id: currentUser.id,
        admin_name: adminName,
        action_type: isEditing
          ? "event_update"
          : "event_create",
        target_name: title,
        action: isEditing
          ? `Изменил событие "${title}"`
          : `Создал событие "${title}"`,
      });

    if (logError) {
      console.error("Event admin log error:", logError);
    }

    let notification = {
      total: 0,
      sent: 0,
      failed: 0,
    };

    /*
     * Рассылка идёт только при создании нового события.
     * При редактировании старого события повторного сообщения не будет.
     */
    if (!isEditing) {
      notification = await sendEventBroadcast({
        title,
        type,
        weekday,
        start_time: startTime,
        event_date: eventDate,
        reward_steps: rewardSteps,
        reward_moves: rewardMoves,
      });
    }

    return NextResponse.json({
      ok: true,
      event: savedEvent,
      notification,
    });
  } catch (error) {
    console.error("Save event error:", error);

    return NextResponse.json(
      {
        error: "Произошла ошибка при сохранении события.",
      },
      { status: 500 }
    );
  }
}