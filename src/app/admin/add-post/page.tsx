"use client";

import { useState, useRef } from "react";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css";
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import "../../styles/toastui-editor-dark.css";

import dynamic from "next/dynamic";

const Editor = dynamic(
  async () => {
    const { Editor } = await import("@toast-ui/react-editor");
    const colorSyntax = (await import("@toast-ui/editor-plugin-color-syntax")).default;
    const { forwardRef } = await import("react");

    return forwardRef(function Comp(props: any, ref: any) {
      return (
        <Editor
          {...props}
          ref={ref}
          plugins={[[colorSyntax, { preset: ['#FFFFFF'] }]]}
          theme = 'dark'
        />
      );
    });
  },
  { ssr: false }
);


export default function AddPost() {
  
  const [title, setTitle] = useState("");
  const editorRef = useRef<any>(null);
  const [imageUrl, setImageUrl] = useState(""); // New state for image URL
  const [secret, setSecret] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const content = (editorRef.current as any)?.getInstance().getMarkdown(); // Get content from Toast UI Editor
    console.log("Markdown içerik:", content);

    if (!content) {
      setMessage("Hata: İçerik boş olamaz.");
      return;
    }

    const res = await fetch("/api/add-post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content, imageUrl, secret }), // Include imageUrl
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("Yazı başarıyla eklendi!");
      setTitle("");
      editorRef.current?.getInstance().setMarkdown(""); // Clear editor content
      setImageUrl(""); // Clear image URL after successful submission
      setSecret("");
    } else {
      setMessage(`Hata: ${data.message}`);
    }
  };
  const initialMarkdown = `<span style="color:#FFFFFF;">Başlangıç yazısı</span>`;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-cyan-400">Yeni Yazı Ekle</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Başlık</label>
            <input
              type="text"
              id="title"
              placeholder="Yazı Başlığı"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-1">İçerik</label>
            <Editor
              ref={editorRef}
              initialValue={initialMarkdown}
              previewStyle="vertical"
              height="400px"
              initialEditType="markdown"
              useCommandShortcut={true}
              toolbarItems={[
                ['heading', 'bold', 'italic', 'strike'],
                ['hr', 'quote'],
                ['ul', 'ol', 'task'],
                ['table', 'image', 'link'],
                ['code', 'codeblock'],
              ]}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
            />
          </div>
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-300 mb-1">Resim Linki (Opsiyonel)</label>
            <input
              type="url"
              id="imageUrl"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
            />
          </div>
          <div>
            <label htmlFor="secret" className="block text-sm font-medium text-gray-300 mb-1">Gizli Anahtar</label>
            <input
              type="password"
              id="secret"
              placeholder="Gizli Anahtar"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              required
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            Yazıyı Ekle
          </button>
        </form>
        {message && <p className="mt-6 text-center text-lg font-medium text-green-400">{message}</p>}
      </div>
    </div>
  );
}
