"use client";

import { Viewer } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import "../styles/toastui-editor-dark.css";

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="toastui-editor-dark">
      <Viewer initialValue={content} />
    </div>
  );
}
