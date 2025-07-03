"use client";

import MarkdownRenderer from "./MarkdownRenderer";

export default function MarkdownClientWrapper({ content }: { content: string }) {
  return <MarkdownRenderer content={content} />;
}
