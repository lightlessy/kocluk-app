"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import { useEffect, useState } from "react";

interface MarkdownEditorProps {
  content?: string;
  onChange?: (content: string) => void;
}
const colors = [
  "#f87171", // kırmızı
  "#34d399", // yeşil
  "#60a5fa", // mavi
  "#000000", // siyah
  "#fbbf24", // sarı
  "#a78bfa", // mor
  "#f43f5e", // koyu kırmızı
  "#10b981", // koyu yeşil
  // istediğin kadar ekle
];

export default function MarkdownEditor({ content = "", onChange }: MarkdownEditorProps) {
  const [color, setColor] = useState("#000000");

  const editor = useEditor({
    extensions: [StarterKit, TextStyle, Color],
    content,
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML());
      }
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  const setTextColor = (newColor: string) => {
    setColor(newColor);
    editor.chain().focus().setColor(newColor).run();
  };

  return (
    <div>
      {/* Renk seçici input */}
      <input
        type="color"
        value={color}
        onChange={(e) => setTextColor(e.target.value)}
        className="w-10 h-10 cursor-pointer rounded border border-gray-300"
        aria-label="Renk seçici"
      />

      <EditorContent editor={editor} className="border p-3 min-h-[300px]" />
    </div>
  );
}
