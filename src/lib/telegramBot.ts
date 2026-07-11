type TelegramButton = {
  text: string;
  url: string;
};

type SendTelegramMessageOptions = {
  chatId: string | number;
  text: string;
  button?: TelegramButton;
};

type TelegramApiResponse = {
  ok: boolean;
  description?: string;
  error_code?: number;
};

export async function sendTelegramMessage({
  chatId,
  text,
  button,
}: SendTelegramMessageOptions) {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    console.error("TELEGRAM_BOT_TOKEN is missing");

    return {
      ok: false,
      error: "Missing Telegram bot token",
    };
  }

  if (!chatId) {
    return {
      ok: false,
      error: "Missing Telegram chat ID",
    };
  }

  try {
    const replyMarkup = button
      ? {
          inline_keyboard: [
            [
              {
                text: button.text,
                url: button.url,
              },
            ],
          ],
        }
      : undefined;

    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: String(chatId),
          text,
          parse_mode: "HTML",
          disable_web_page_preview: true,
          reply_markup: replyMarkup,
        }),
      }
    );

    const data = (await response.json()) as TelegramApiResponse;

    if (!response.ok || !data.ok) {
      console.error("Telegram sendMessage error:", {
        chatId,
        status: response.status,
        description: data.description,
        errorCode: data.error_code,
      });

      return {
        ok: false,
        error: data.description || "Telegram message failed",
      };
    }

    return {
      ok: true,
    };
  } catch (error) {
    console.error("Telegram request error:", error);

    return {
      ok: false,
      error: "Telegram request failed",
    };
  }
}

export function escapeTelegramHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}