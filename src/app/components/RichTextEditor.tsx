"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";

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

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Начни писать текст...",
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,

    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),

      Underline,

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
          "[&_h1]:text-white",

          "[&_h2]:mb-3",
          "[&_h2]:mt-5",
          "[&_h2]:text-3xl",
          "[&_h2]:font-black",
          "[&_h2]:leading-tight",
          "[&_h2]:text-white",

          "[&_h3]:mb-3",
          "[&_h3]:mt-5",
          "[&_h3]:text-2xl",
          "[&_h3]:font-bold",
          "[&_h3]:text-white",

          "[&_ul]:my-4",
          "[&_ul]:list-disc",
          "[&_ul]:pl-7",

          "[&_ol]:my-4",
          "[&_ol]:list-decimal",
          "[&_ol]:pl-7",

          "[&_li]:my-1",

          "[&_blockquote]:my-5",
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

  if (!editor) {
    return (
      <div className="rounded-3xl border border-white/10 bg-black/60 p-6 text-zinc-500">
        Загружаем редактор…
      </div>
    );
  }

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
            editor.chain().focus().unsetAllMarks().clearNodes().run()
          }
        />
      </div>

      <div className="relative">
        {editor.isEmpty ? (
          <div className="pointer-events-none absolute left-5 top-5 text-zinc-600">
            {placeholder}
          </div>
        ) : null}

        <EditorContent editor={editor} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-white/[0.02] px-4 py-3 text-xs text-zinc-500">
        <span>
          Выдели текст и выбери нужное оформление.
        </span>

        <span>
          {editor.storage.characterCount?.characters?.() || ""}
        </span>
      </div>
    </div>
  );
}