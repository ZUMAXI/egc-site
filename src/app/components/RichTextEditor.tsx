"use client";

import { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { Color, TextStyle } from "@tiptap/extension-text-style";
import toast from "react-hot-toast";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

type ToolbarButtonProps = {
  label: string;
  title: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
};

const presetColors = [
  { name: "Белый", value: "#ffffff" },
  { name: "Серый", value: "#a1a1aa" },
  { name: "Красный", value: "#ef4444" },
  { name: "Оранжевый", value: "#f97316" },
  { name: "Жёлтый", value: "#eab308" },
  { name: "Зелёный", value: "#22c55e" },
  { name: "Бирюзовый", value: "#14b8a6" },
  { name: "Голубой", value: "#38bdf8" },
  { name: "Синий", value: "#3b82f6" },
  { name: "Фиолетовый", value: "#a855f7" },
  { name: "Розовый", value: "#ec4899" },
  { name: "Золотой", value: "#facc15" },
];

function ToolbarButton({
  label,
  title,
  active = false,
  disabled = false,
  onClick,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`min-h-10 rounded-xl border px-3 py-2 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-30 ${
        active
          ? "border-white bg-white text-black"
          : "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}

function normalizeHex(value: string) {
  let hex = value.trim();

  if (!hex.startsWith("#")) {
    hex = `#${hex}`;
  }

  if (/^#[0-9a-fA-F]{3}$/.test(hex)) {
    return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }

  if (/^#[0-9a-fA-F]{6}$/.test(hex)) {
    return hex.toLowerCase();
  }

  return null;
}

function rgbToHex(red: number, green: number, blue: number) {
  const toHex = (value: number) =>
    Math.max(0, Math.min(255, value)).toString(16).padStart(2, "0");

  return `#${toHex(red)}${toHex(green)}${toHex(blue)}`;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Начни писать текст...",
}: RichTextEditorProps) {
  const [showColors, setShowColors] = useState(false);
  const [hexColor, setHexColor] = useState("#ffffff");
  const [red, setRed] = useState("255");
  const [green, setGreen] = useState("255");
  const [blue, setBlue] = useState("255");

  const editor = useEditor({
    immediatelyRender: false,

    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),

      Underline,
      TextStyle,
      Color,

      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          class:
            "text-blue-400 underline decoration-blue-400/50 underline-offset-4",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),

      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],

    content: value || "",

    editorProps: {
      attributes: {
        class: [
          "min-h-[320px]",
          "w-full",
          "px-5",
          "py-5",
          "text-base",
          "leading-7",
          "text-zinc-200",
          "outline-none",

          "[&_p]:my-3",

          "[&_h1]:mb-4",
          "[&_h1]:mt-6",
          "[&_h1]:text-4xl",
          "[&_h1]:font-black",
          "[&_h1]:leading-tight",

          "[&_h2]:mb-3",
          "[&_h2]:mt-5",
          "[&_h2]:text-3xl",
          "[&_h2]:font-black",
          "[&_h2]:leading-tight",

          "[&_h3]:mb-3",
          "[&_h3]:mt-5",
          "[&_h3]:text-2xl",
          "[&_h3]:font-bold",

          "[&_ul]:my-4",
          "[&_ul]:list-disc",
          "[&_ul]:pl-7",

          "[&_ol]:my-4",
          "[&_ol]:list-decimal",
          "[&_ol]:pl-7",

          "[&_li]:my-1",

          "[&_blockquote]:my-5",
          "[&_blockquote]:rounded-2xl",
          "[&_blockquote]:border-l-4",
          "[&_blockquote]:border-white/20",
          "[&_blockquote]:bg-white/5",
          "[&_blockquote]:px-5",
          "[&_blockquote]:py-3",
          "[&_blockquote]:italic",
          "[&_blockquote]:text-zinc-300",

          "[&_code]:rounded-md",
          "[&_code]:bg-white/10",
          "[&_code]:px-1.5",
          "[&_code]:py-0.5",
          "[&_code]:font-mono",
          "[&_code]:text-sm",
          "[&_code]:text-emerald-300",

          "[&_pre]:my-5",
          "[&_pre]:overflow-x-auto",
          "[&_pre]:rounded-2xl",
          "[&_pre]:border",
          "[&_pre]:border-white/10",
          "[&_pre]:bg-zinc-950",
          "[&_pre]:p-5",

          "[&_pre_code]:bg-transparent",
          "[&_pre_code]:p-0",

          "[&_hr]:my-7",
          "[&_hr]:border-white/10",

          "[&_a]:text-blue-400",
          "[&_a]:underline",
          "[&_a]:underline-offset-4",
        ].join(" "),
      },
    },

    onUpdate: ({ editor: currentEditor }) => {
      const html = currentEditor.getHTML();

      if (html === "<p></p>") {
        onChange("");
        return;
      }

      onChange(html);
    },

    onSelectionUpdate: ({ editor: currentEditor }) => {
      const currentColor =
        currentEditor.getAttributes("textStyle").color || "#ffffff";

      setHexColor(currentColor);
    },
  });

  useEffect(() => {
    if (!editor) return;

    const currentContent = editor.getHTML();
    const nextContent = value || "";

    if (
      currentContent !== nextContent &&
      !(currentContent === "<p></p>" && nextContent === "")
    ) {
      editor.commands.setContent(nextContent, {
        emitUpdate: false,
      });
    }
  }, [editor, value]);

  function setLink() {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href || "";
    const url = window.prompt("Вставь ссылку:", previousUrl);

    if (url === null) return;

    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    const normalizedUrl =
      trimmedUrl.startsWith("http://") ||
      trimmedUrl.startsWith("https://") ||
      trimmedUrl.startsWith("mailto:")
        ? trimmedUrl
        : `https://${trimmedUrl}`;

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({
        href: normalizedUrl,
      })
      .run();
  }

  function applyColor(color: string) {
    if (!editor) return;

    editor.chain().focus().setColor(color).run();
    setHexColor(color);
  }

  function applyHexColor() {
    const normalizedColor = normalizeHex(hexColor);

    if (!normalizedColor) {
      toast.error("Укажи HEX-цвет, например #ff0000.");
      return;
    }

    applyColor(normalizedColor);
  }

  function applyRgbColor() {
    const redValue = Number(red);
    const greenValue = Number(green);
    const blueValue = Number(blue);

    if (
      !Number.isInteger(redValue) ||
      !Number.isInteger(greenValue) ||
      !Number.isInteger(blueValue) ||
      redValue < 0 ||
      redValue > 255 ||
      greenValue < 0 ||
      greenValue > 255 ||
      blueValue < 0 ||
      blueValue > 255
    ) {
      toast.error("Значения RGB должны быть целыми числами от 0 до 255.");
      return;
    }

    const color = rgbToHex(redValue, greenValue, blueValue);

    setHexColor(color);
    applyColor(color);
  }

  function removeColor() {
    if (!editor) return;

    editor.chain().focus().unsetColor().removeEmptyTextStyle().run();
    setHexColor("#ffffff");
  }

  if (!editor) {
    return (
      <div className="rounded-3xl border border-white/10 bg-black/60 p-6 text-zinc-500">
        Загружаем редактор…
      </div>
    );
  }

  const activeColor =
    editor.getAttributes("textStyle").color || "#ffffff";

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/70">
      <div className="flex flex-wrap gap-2 border-b border-white/10 bg-white/[0.03] p-3">
        <ToolbarButton
          label="B"
          title="Жирный текст"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />

        <ToolbarButton
          label="I"
          title="Курсив"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />

        <ToolbarButton
          label="U"
          title="Подчёркнутый текст"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        />

        <ToolbarButton
          label="S"
          title="Зачёркнутый текст"
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        />

        <div className="mx-1 hidden w-px bg-white/10 sm:block" />

        <ToolbarButton
          label="Текст"
          title="Обычный текст"
          active={editor.isActive("paragraph")}
          onClick={() => editor.chain().focus().setParagraph().run()}
        />

        <ToolbarButton
          label="H1"
          title="Большой заголовок"
          active={editor.isActive("heading", { level: 1 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        />

        <ToolbarButton
          label="H2"
          title="Средний заголовок"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        />

        <ToolbarButton
          label="H3"
          title="Маленький заголовок"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        />

        <div className="mx-1 hidden w-px bg-white/10 sm:block" />

        <ToolbarButton
          label="• Список"
          title="Маркированный список"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />

        <ToolbarButton
          label="1. Список"
          title="Нумерованный список"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />

        <ToolbarButton
          label="❝"
          title="Цитата"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        />

        <ToolbarButton
          label="Код"
          title="Блок кода"
          active={editor.isActive("codeBlock")}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        />

        <ToolbarButton
          label="—"
          title="Разделитель"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        />

        <div className="mx-1 hidden w-px bg-white/10 sm:block" />

        <ToolbarButton
          label="←"
          title="Выровнять слева"
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        />

        <ToolbarButton
          label="↔"
          title="Выровнять по центру"
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        />

        <ToolbarButton
          label="→"
          title="Выровнять справа"
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        />

        <ToolbarButton
          label="≡"
          title="Выровнять по ширине"
          active={editor.isActive({ textAlign: "justify" })}
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        />

        <div className="mx-1 hidden w-px bg-white/10 sm:block" />

        <button
          type="button"
          title="Цвет текста"
          onClick={() => setShowColors((current) => !current)}
          className={`flex min-h-10 items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold transition ${
            showColors
              ? "border-white bg-white text-black"
              : "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
          }`}
        >
          <span
            className="h-5 w-5 rounded-full border border-black/20"
            style={{ backgroundColor: activeColor }}
          />
          Цвет
        </button>

        <ToolbarButton
          label="🔗"
          title="Добавить или изменить ссылку"
          active={editor.isActive("link")}
          onClick={setLink}
        />

        <ToolbarButton
          label="Убрать 🔗"
          title="Удалить ссылку"
          disabled={!editor.isActive("link")}
          onClick={() =>
            editor.chain().focus().extendMarkRange("link").unsetLink().run()
          }
        />

        <div className="mx-1 hidden w-px bg-white/10 sm:block" />

        <ToolbarButton
          label="↶"
          title="Отменить действие"
          disabled={!editor.can().chain().focus().undo().run()}
          onClick={() => editor.chain().focus().undo().run()}
        />

        <ToolbarButton
          label="↷"
          title="Вернуть действие"
          disabled={!editor.can().chain().focus().redo().run()}
          onClick={() => editor.chain().focus().redo().run()}
        />

        <ToolbarButton
          label="Очистить"
          title="Убрать форматирование"
          onClick={() =>
            editor
              .chain()
              .focus()
              .unsetAllMarks()
              .clearNodes()
              .removeEmptyTextStyle()
              .run()
          }
        />
      </div>

      {showColors ? (
        <div className="grid gap-5 border-b border-white/10 bg-zinc-950 p-4">
          <div>
            <p className="mb-3 text-sm font-bold text-white">
              Готовые цвета
            </p>

            <div className="flex flex-wrap gap-3">
              {presetColors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  title={color.name}
                  onClick={() => applyColor(color.value)}
                  className={`h-10 w-10 rounded-full border-2 transition hover:scale-110 ${
                    activeColor.toLowerCase() === color.value.toLowerCase()
                      ? "border-white ring-2 ring-white/30"
                      : "border-white/20"
                  }`}
                  style={{
                    backgroundColor: color.value,
                  }}
                />
              ))}

              <button
                type="button"
                onClick={removeColor}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-zinc-300 transition hover:bg-white/10 hover:text-white"
              >
                Сбросить цвет
              </button>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <span className="text-sm font-bold text-white">
                Выбор любого цвета
              </span>

              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="color"
                  value={normalizeHex(hexColor) || "#ffffff"}
                  onChange={(event) => {
                    setHexColor(event.target.value);
                    applyColor(event.target.value);
                  }}
                  className="h-12 w-16 cursor-pointer rounded-xl border border-white/10 bg-black p-1"
                />

                <input
                  value={hexColor}
                  onChange={(event) => setHexColor(event.target.value)}
                  placeholder="#ffffff"
                  className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
                />

                <button
                  type="button"
                  onClick={applyHexColor}
                  className="rounded-xl bg-white px-5 py-3 font-bold text-black transition hover:scale-105"
                >
                  Применить HEX
                </button>
              </div>

              <p className="text-xs text-zinc-500">
                Пример: #ff0000, #22c55e или #fff.
              </p>
            </div>

            <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <span className="text-sm font-bold text-white">
                Цвет по RGB
              </span>

              <div className="grid grid-cols-3 gap-3">
                <label className="grid gap-1">
                  <span className="text-xs text-red-300">R</span>

                  <input
                    type="number"
                    min={0}
                    max={255}
                    value={red}
                    onChange={(event) => setRed(event.target.value)}
                    className="min-w-0 rounded-xl border border-white/10 bg-black px-3 py-3 text-white outline-none"
                  />
                </label>

                <label className="grid gap-1">
                  <span className="text-xs text-green-300">G</span>

                  <input
                    type="number"
                    min={0}
                    max={255}
                    value={green}
                    onChange={(event) => setGreen(event.target.value)}
                    className="min-w-0 rounded-xl border border-white/10 bg-black px-3 py-3 text-white outline-none"
                  />
                </label>

                <label className="grid gap-1">
                  <span className="text-xs text-blue-300">B</span>

                  <input
                    type="number"
                    min={0}
                    max={255}
                    value={blue}
                    onChange={(event) => setBlue(event.target.value)}
                    className="min-w-0 rounded-xl border border-white/10 bg-black px-3 py-3 text-white outline-none"
                  />
                </label>
              </div>

              <button
                type="button"
                onClick={applyRgbColor}
                className="w-fit rounded-xl bg-white px-5 py-3 font-bold text-black transition hover:scale-105"
              >
                Применить RGB
              </button>
            </div>
          </div>

          <p className="text-sm text-zinc-500">
            Сначала выдели нужный текст, затем выбери цвет.
          </p>
        </div>
      ) : null}

      <div className="relative">
        {editor.isEmpty ? (
          <div className="pointer-events-none absolute left-5 top-5 text-zinc-600">
            {placeholder}
          </div>
        ) : null}

        <EditorContent editor={editor} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-white/[0.02] px-4 py-3 text-xs text-zinc-500">
        <span>Выдели текст и выбери нужное оформление.</span>
        <span>EgC Editor</span>
      </div>
    </div>
  );
}