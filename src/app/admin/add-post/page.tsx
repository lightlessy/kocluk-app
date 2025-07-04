'use client';

import React, { useState, useCallback, useRef, ChangeEvent } from 'react';
import { EditorContent, useEditor, Editor, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import TextAlign from '@tiptap/extension-text-align';
import Link from 'next/link';
import TiptapLink from '@tiptap/extension-link';
import Dropcursor from '@tiptap/extension-dropcursor';
import { FaSmile } from "react-icons/fa";

// Emoji seçici ve ikonlar için kütüphaneler
import {
  Bold, Italic, Underline as UnderlineIcon, Heading1, Heading2, Heading3, Heading4, Heading5, Heading6, List, ListOrdered, Quote, Image as ImageIcon, Palette, Minus, Maximize, Minimize, Trash2, AlignLeft, AlignCenter, AlignRight, Link2
} from 'lucide-react';

// == BÖLÜM 1: STİL TANIMLAMALARI ==
const editorStyles = `
  .ProseMirror li {
    list-style-position: inside;
  }
  .ProseMirror li::marker {
    color: white !important;
  }
  .ProseMirror {
    outline: none;
    min-height: 400px;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    padding: 0.75rem 1rem;
    transition: border-color 0.2s;
    padding-bottom: 8rem;
    white-space: pre-wrap; /* Boş satırları ve \n'leri göster */
    word-break: break-word;
  }
  .ProseMirror:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4);
  }
  .ProseMirror > * + * { margin-top: 0.75em; }
  .ProseMirror ul, .ProseMirror ol { padding: 0 1rem; }
  .ProseMirror h1 { font-size: 2.25rem; font-weight: 700; }
  .ProseMirror h2 { font-size: 1.875rem; font-weight: 600; }
  .ProseMirror h3 { font-size: 1.5rem; font-weight: 600; }
  .ProseMirror h4 { font-size: 1.25rem; font-weight: 600; }
  .ProseMirror h5 { font-size: 1.125rem; font-weight: 600; }
  .ProseMirror h6 { font-size: 1rem; font-weight: 600; }
  .ProseMirror code { background-color: rgba(97, 97, 97, 0.1); color: #616161; padding: 0.25rem 0.5rem; border-radius: 0.25rem; }
  .ProseMirror pre { background: #0D0D0D; color: #FFF; font-family: 'JetBrainsMono', monospace; padding: 0.75rem 1rem; border-radius: 0.5rem; }
  .ProseMirror blockquote { padding-left: 1rem; border-left: 3px solid rgba(0,0,0,0.1); }
  .ProseMirror img { max-width: 100%; height: auto; cursor: pointer; border-radius: 0.5rem; display: block; }
  .ProseMirror img[data-align="left"] { float: left; margin-right: 1rem; }
  .ProseMirror img[data-align="right"] { float: right; margin-left: 1rem; }
  .ProseMirror img[data-align="center"] { margin-left: auto; margin-right: auto; }
  .ProseMirror .ProseMirror-selectednode { outline: 3px solid #68CEF8; }
  .ProseMirror table { border-collapse: collapse; table-layout: fixed; width: 100%; margin: 0; overflow: hidden; }
  .ProseMirror td, .ProseMirror th { min-width: 1em; border: 2px solid #ced4da; padding: 3px 5px; vertical-align: top; box-sizing: border-box; position: relative; }
  .ProseMirror th { font-weight: bold; text-align: left; background-color: #f1f3f5; }
`;

// == BÖLÜM 2: BİLEŞENLER ==


/**
 * Araç Çubuğu Bileşeni (Toolbar)
 */
interface ToolbarProps {
  editor: Editor | null;
  onStickerButtonClick: () => void;
}

const Toolbar = ({ editor, onStickerButtonClick }: ToolbarProps) => {
  const [showTextColor, setShowTextColor] = useState(false);
  const [showBgColor, setShowBgColor] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // useCallback burası koşulsuz en üstte olsun:
  const setLink = useCallback(() => {
    if (!editor) return; // editor yoksa işlemi iptal et

    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null; // renderdan önce kontrol

 
  return (
    <div className="flex items-center gap-1 p-2 bg-gray-500 border-t md:border-t-0 md:border-b border-gray-200 overflow-x-auto whitespace-nowrap fixed bottom-0 left-0 right-0 z-10 md:relative md:flex-wrap md:mb-3 md:rounded-md">
      {/* Formatlama */}
      <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'bg-gray-300 p-2.5 rounded' : 'p-2.5 rounded hover:bg-gray-250'}><Bold className="text-blue-400" size={20} /></button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'bg-gray-300 p-2.5 rounded' : 'p-2.5 rounded hover:bg-gray-200'}><Italic className="text-blue-400" size={20} /></button>
      <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'bg-gray-300 p-2.5 rounded' : 'p-2.5 rounded hover:bg-gray-200'}><UnderlineIcon className="text-blue-400" size={20} /></button>
      {/* Renkli metin */}
      <button
        onClick={() => setShowTextColor(true)}
        className="p-2.5 rounded hover:bg-gray-200"
        title="Metin Rengi"
      >
        <Palette className="text-blue-400" size={20} />
      </button>
      {/* Renkli arka plan */}
      <button
        onClick={() => setShowBgColor(true)}
        className="p-2.5 rounded hover:bg-gray-200"
        title="Arka Plan Rengi"
      >
        <Palette className="text-yellow-400" size={20} />
      </button>

      <div className="border-l h-6 mx-2"></div>

      {/* Hizalama */}
      <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={editor.isActive({ textAlign: 'left' }) ? 'bg-gray-300 p-2.5 rounded' : 'p-2.5 rounded hover:bg-gray-200'}><AlignLeft className="text-blue-400" size={20} /></button>
      <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={editor.isActive({ textAlign: 'center' }) ? 'bg-gray-300 p-2.5 rounded' : 'p-2.5 rounded hover:bg-gray-200'}><AlignCenter className="text-blue-400" size={20} /></button>
      <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={editor.isActive({ textAlign: 'right' }) ? 'bg-gray-300 p-2.5 rounded' : 'p-2.5 rounded hover:bg-gray-200'}><AlignRight className="text-blue-400" size={20} /></button>

      <div className="border-l h-6 mx-2"></div>

      {/* Başlıklar */}
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'bg-gray-300 p-2.5 rounded' : 'p-2.5 rounded hover:bg-gray-200'}><Heading1 className="text-blue-400" size={20} /></button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'bg-gray-300 p-2.5 rounded' : 'p-2.5 rounded hover:bg-gray-200'}><Heading2 className="text-blue-400" size={20} /></button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? 'bg-gray-300 p-2.5 rounded' : 'p-2.5 rounded hover:bg-gray-200'}><Heading3 className="text-blue-400" size={20} /></button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()} className={editor.isActive('heading', { level: 4 }) ? 'bg-gray-300 p-2.5 rounded' : 'p-2.5 rounded hover:bg-gray-200'}><Heading4 className="text-blue-400" size={20} /></button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()} className={editor.isActive('heading', { level: 5 }) ? 'bg-gray-300 p-2.5 rounded' : 'p-2.5 rounded hover:bg-gray-200'}><Heading5 className="text-blue-400" size={20} /></button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()} className={editor.isActive('heading', { level: 6 }) ? 'bg-gray-300 p-2.5 rounded' : 'p-2.5 rounded hover:bg-gray-200'}><Heading6 className="text-blue-400" size={20} /></button>
      
      <div className="border-l h-6 mx-2"></div>

      {/* Listeler */}
      <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'bg-gray-300 p-2.5 rounded' : 'p-2.5 rounded hover:bg-gray-200'}><List className="text-blue-400" size={20} /></button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'bg-gray-300 p-2.5 rounded' : 'p-2.5 rounded hover:bg-gray-200'}><ListOrdered className="text-blue-400" size={20} /></button>

      <div className="border-l h-6 mx-2"></div>

      {/* Diğerleri */}
      <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive('blockquote') ? 'bg-gray-300 p-2.5 rounded' : 'p-2.5 rounded hover:bg-gray-200'}><Quote className="text-blue-400" size={20} /></button>
      <button onClick={() => editor.chain().focus().setHorizontalRule().run()} className="p-2.5 rounded hover:bg-gray-200"><Minus className="text-blue-400" size={20} /></button>
      <button onClick={setLink} className={editor.isActive('link') ? 'bg-gray-300 p-2.5 rounded' : 'p-2.5 rounded hover:bg-gray-200'}><Link2 className="text-blue-400" size={20} /></button>

      <div className="border-l h-6 mx-2"></div>

      {/* Medya ve Diğerleri */}
      <button onClick={() => fileInputRef.current?.click()} className="p-2.5 rounded hover:bg-gray-200" title="Resim Yükle"><ImageIcon className="text-blue-400" size={20} /></button>
      <input type="file" ref={fileInputRef} onChange={(e: ChangeEvent<HTMLInputElement>) => {
          if (e.target.files?.[0]) {
              const file = e.target.files[0];
              const reader = new FileReader();
              reader.onload = (readEvent) => {
                  editor.chain().focus().setImage({ src: readEvent.target?.result as string }).run();
              };
              reader.readAsDataURL(file);
          }
      }} className="hidden" accept="image/*" />
      
      <div className="relative">
        <button onClick={onStickerButtonClick} className="p-2.5 rounded hover:bg-gray-200">
          <FaSmile className="text-blue-400" size={20} />
        </button>
      </div>

      {/* Renk modalları */}
      <ColorModal
        open={showTextColor}
        onClose={() => setShowTextColor(false)}
        onSelect={color => editor.chain().focus().setColor(color).run()}
        title="Metin Rengi Seç"
      />
      <ColorModal
        open={showBgColor}
        onClose={() => setShowBgColor(false)}
        onSelect={color => editor.chain().focus().setHighlight({ color }).run()}
        title="Arka Plan Rengi Seç"
      />
    </div>
  );
};

/**
 * Ana Zengin Metin Editörü Bileşeni
 */
interface RichTextEditorProps {
  editor: Editor | null; // Editör örneğini prop olarak alacak
  onUpdate: (newContent: string) => void;
  onStickerButtonClick: () => void;
}

const RichTextEditorComponent = ({ editor, onStickerButtonClick }: RichTextEditorProps) => {
  const [showTextColor, setShowTextColor] = useState(false);
  const [showBgColor, setShowBgColor] = useState(false);
  const [imageWidth, setImageWidth] = useState<string>("100%");

  return (
    <div className=" w-full h-full flex flex-col-reverse md:flex-col p-4 rounded-lg shadow-md">
      <Toolbar
        editor={editor}
        onStickerButtonClick={onStickerButtonClick}
      />
      {editor && (
        <>
          {/* Metin seçimi için Balon Menü */}
          <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}
            className="bg-black text-white rounded-lg p-1 flex gap-1 shadow-xl border border-gray-800"
          >
            {!editor.isActive('image') && (
              <>
                <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'bg-gray-700 p-2 rounded' : 'p-2 rounded hover:bg-gray-600'}><Bold size={18} /></button>
                <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'bg-gray-700 p-2 rounded' : 'p-2 rounded hover:bg-gray-600'}><Italic size={18} /></button>
                <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'bg-gray-700 p-2 rounded' : 'p-2 rounded hover:bg-gray-600'}><UnderlineIcon size={18} /></button>
                {/* Mobil uyumlu renk seçici */}
                <button
                  onClick={() => setShowTextColor(true)}
                  className="p-2 rounded hover:bg-gray-600"
                  title="Metin Rengi"
                >
                  <Palette className="text-blue-400" size={18} />
                </button>
                <button
                  onClick={() => setShowBgColor(true)}
                  className="p-2 rounded hover:bg-gray-600"
                  title="Arka Plan Rengi"
                >
                  <Palette className="text-yellow-400" size={18} />
                </button>
              </>
            )}
          </BubbleMenu>
          {/* Renk modalları */}
          <ColorModal
            open={showTextColor}
            onClose={() => setShowTextColor(false)}
            onSelect={color => editor.chain().focus().setColor(color).run()}
            title="Metin Rengi Seç"
          />
          <ColorModal
            open={showBgColor}
            onClose={() => setShowBgColor(false)}
            onSelect={color => editor.chain().focus().setHighlight({ color }).run()}
            title="Arka Plan Rengi Seç"
          />
          {/* Resim seçimi için Balon Menü */}
          <BubbleMenu
            editor={editor}
            shouldShow={({ editor }) => editor.isActive('image')}
            tippyOptions={{ duration: 100, placement: 'top' }}
            className="bg-black text-white rounded-lg p-2 flex gap-2 shadow-xl border border-gray-800"
          >
            {/* Genişlik inputu */}
            <input
              type="text"
              value={imageWidth}
              onChange={e => setImageWidth(e.target.value)}
              onBlur={() => editor.chain().focus().updateAttributes('image', { width: imageWidth, height: 'auto' }).run()}
              placeholder="örn: 120px, 50%, 300px"
              className="w-20 px-1 py-0.5 rounded text-white"
              style={{ fontSize: 14 }}
            />
            <button
              onClick={() => editor.chain().focus().updateAttributes('image', { width: imageWidth, height: 'auto' }).run()}
              className="p-2 rounded hover:bg-gray-600"
              title="Uygula"
            >Uygula</button>
            <div className="border-l h-5 self-center"></div>
            <button onClick={() => editor.chain().focus().updateAttributes('image', { 'data-align': 'left' }).run()} className={editor.isActive('image', { 'data-align': 'left' }) ? 'bg-gray-700 p-2 rounded' : 'p-2 rounded hover:bg-gray-600'}><AlignLeft size={18} /></button>
            <button onClick={() => editor.chain().focus().updateAttributes('image', { 'data-align': 'center' }).run()} className={editor.isActive('image', { 'data-align': 'center' }) ? 'bg-gray-700 p-2 rounded' : 'p-2 rounded hover:bg-gray-600'}><AlignCenter size={18} /></button>
            <button onClick={() => editor.chain().focus().updateAttributes('image', { 'data-align': 'right' }).run()} className={editor.isActive('image', { 'data-align': 'right' }) ? 'bg-gray-700 p-2 rounded' : 'p-2 rounded hover:bg-gray-600'}><AlignRight size={18} /></button>
            <div className="border-l h-5 self-center"></div>
            <button onClick={() => editor.chain().focus().deleteSelection().run()} className="p-2 rounded hover:bg-red-500"><Trash2 size={18} /></button>
          </BubbleMenu>
        </>
      )}
      
      <style>{editorStyles}</style>
      
      <div className="flex-grow overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};


// == Renk Seçici Modalı ==
const ColorModal = ({
  open,
  onClose,
  onSelect,
  title,
  defaultColor = ""
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (color: string) => void;
  title: string;
  defaultColor?: string;
}) => {
  const [color, setColor] = useState(defaultColor);
  if (!open) return null;
  return (
   <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40">
  <div className="bg-white rounded-lg shadow-lg p-4 w-80 max-w-full">
    <div className="flex justify-between items-center mb-2">
      <span className="font-bold">{title}</span>
      <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-xl">&times;</button>
    </div>

    <div className="flex flex-col items-center gap-2 mb-2">
      <input
        type="color"
        value={color}
        onChange={e => setColor(e.target.value)}
        className="w-16 h-16 border-0"
      />
      <input
        type="text"
        value={color}
        onChange={e => setColor(e.target.value)}
        className="border rounded px-2 py-1 w-full"
        maxLength={7}
      />
    </div>

    <button
      className="w-full bg-blue-600 text-white rounded py-2 font-bold"
      onClick={() => { onSelect(color); onClose(); }}
    >
      Rengi Seç
    </button>
  </div>
</div>

  );
};

// == Sticker Modalı (Sadece Emoji) ==
const stickerList = [
  { emoji: "😃", label: "Smile" },
  { emoji: "😂", label: "Laugh" },
  { emoji: "😍", label: "Heart Eyes" },
  { emoji: "👍", label: "Thumbs Up" },
  { emoji: "🚀", label: "Rocket" },
  { emoji: "😺", label: "Cat" },
  { emoji: "🐶", label: "Dog" },
  { emoji: "🍎", label: "Apple" },
  { emoji: "☕", label: "Coffee" },
  { emoji: "⭐", label: "Star" },
  { emoji: "🔥", label: "Fire" },
  { emoji: "🥳", label: "Party" },
  { emoji: "💡", label: "Idea" },
  { emoji: "🎉", label: "Celebrate" },
  { emoji: "❤️", label: "Heart" },
];

const StickerModal = ({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (emoji: string) => void;
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-4 w-80 max-w-full">
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold">Sticker (Emoji) Seç</span>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-xl">&times;</button>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          {stickerList.map((sticker, i) => (
            <button
              key={i}
              className="p-2 hover:bg-gray-200 rounded text-2xl"
              onClick={() => {
                onSelect(sticker.emoji);
                onClose();
              }}
              title={sticker.label}
            >
              {sticker.emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// == BÖLÜM 3: ANA UYGULAMA BİLEŞENİ ==
export default function App() {
  const [editorContent, setEditorContent] = useState(`
    <h1>Yeni Editöre Merhaba Deyin! ✨</h1>
    <p style="text-align: center">Artık metinlerinizi ve resimlerinizi kolayca hizalayabilirsiniz. Bu paragraf ortalanmış durumda.</p>
    <p style="text-align: right">Bu ise sağa yaslandı. Yaratıcılığınızı konuşturun! 🎨</p>
    <p>Ayrıca stickerlar da ekleyebilirsiniz! İşte birkaçı: 😂👍🚀</p>
    <img src="https://placehold.co/600x400/818cf8/ffffff?text=Beni+Hizala!" data-align="center" />
    <p>Yukarıdaki resme tıklayarak hizalama ve silme seçeneklerini görebilirsiniz.</p>
  `);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showStickerPicker, setShowStickerPicker] = useState(false);

  // Yeni state'ler
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiKeyError, setApiKeyError] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit, Underline, TextStyle, Color, Dropcursor,
      Highlight.configure({ multicolor: true }),
      Image.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            'data-align': {
              default: null,
              parseHTML: element => element.getAttribute('data-align'),
              renderHTML: attributes => {
                if (attributes['data-align']) {
                  return { 'data-align': attributes['data-align'] };
                }
                return {};
              },
            },
            width: {
              default: '100%',
              parseHTML: element => element.getAttribute('width') || element.style.width || '100%',
              renderHTML: attributes => {
                if (attributes.width) {
                  return { width: attributes.width };
                }
                return {};
              },
            },
            height: {
              default: 'auto',
              parseHTML: element => element.getAttribute('height') || element.style.height || 'auto',
              renderHTML: attributes => {
                if (attributes.height) {
                  return { height: attributes.height };
                }
                return {};
              },
            },
          };
        },
      }).configure({
        HTMLAttributes: {
          class: 'cursor-pointer rounded-lg',
        },
      }),
      Table.configure({ resizable: true }),
      TableRow, TableHeader, TableCell,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      TiptapLink.configure({
        openOnClick: false,
        autolink: true,
      }),
      Dropcursor,
    ],
    content: editorContent,
    onUpdate: ({ editor }) => setEditorContent(editor.getHTML()),
  });


  const handleContentUpdate = useCallback((newContent: string) => {
    console.log("İçerik güncellendi...");
    setEditorContent(newContent);
  }, []);
  
  const toggleFullScreen = () => setIsFullScreen(!isFullScreen);

  // Sticker seçildiğinde emoji olarak ekle
  const handleStickerSelect = (emoji: string) => {
    if (editor) {
      editor.chain().focus().insertContent(emoji).run();
    }
    setShowStickerPicker(false);
  };

  const handleStickerButtonClick = () => {
    setShowStickerPicker(!showStickerPicker);
  };

  // Boş satırların preview'da da görünmesi için: 
  // 1. HTML'de ardışık <p></p> veya <p><br></p> bloklarını <br> ile göster.
  // 2. Preview'da HTML'i işlerken boş paragrafları <br> ile değiştir.

  // Yardımcı fonksiyon: Boş <p></p> bloklarını <p><br></p> ile değiştirerek görünür hale getirir
  function preserveEmptyLines(html: string) {
    // Tiptap'ın ürettiği boş paragrafları (<p></p> veya <p>&nbsp;</p>)
    // görsel olarak bir satır boşluk kaplaması için <p><br></p> ile değiştiriyoruz.
    return html.replace(/<p>(\s|&nbsp;)*<\/p>/g, '<p><br></p>');
  }

  // Yayınla butonu için handler
  const handlePublish = async () => {
    setApiKeyError('');
    if (!apiKey.trim()) {
      setApiKeyError('API anahtarı zorunludur.');
      return;
    }
    if (!title.trim()) {
      alert('Başlık zorunludur.');
      return;
    }
    try {
      const res = await fetch('/api/add-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // fetch API'de header anahtarları küçük harf olmamalı, string olmalı
          'x-api-key': encodeURIComponent(apiKey),
        } as Record<string, string>,
        body: JSON.stringify({
          title,
          imageUrl,
          content: editorContent,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data?.error || 'Gönderi kaydedilemedi.');
        return;
      }
      alert('Gönderi başarıyla yayınlandı!');
      // İsteğe bağlı: Formu temizle
      setTitle('');
      setImageUrl('');
      setApiKey('');
      setEditorContent('');
      if (editor) editor.commands.setContent('');
    } catch (err) {
      alert('Bir hata oluştu.'+ err);
    }
  };

  return (
    <div className={` min-h-screen font-sans transition-all duration-300 ${isFullScreen ? '' : 'p-2  sm:p-6 md:p-24'}`}>
      <div className="max-w-4xl mx-auto mb-6 flex justify-end">
        <Link href="/admin/delete-post" className="text-blue-500 hover:underline">
          Go to Delete Post Page
        </Link>
      </div>

      {/* Başlık inputu */}
      <div className="max-w-4xl mx-auto mb-6">
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Başlık"
          className="w-full text-3xl md:text-4xl font-bold border-1 border-gray-200 focus:border-blue-500 outline-none py-2 px-2 mb-2"
          required
        />
      </div>
      {!isFullScreen && (
        <header className="mb-6 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-200 ">Gelişmiş Metin Editörü</h1>
          <p className="text-xl text-gray-400 mt-2">Daha fazla özellik, daha fazla özgürlük, Mutlu Beyzalar.</p>
        </header>
      )}
      <div className={`${isFullScreen ? 'fixed inset-0 z-50' : 'relative max-w-4xl mx-auto'}`}>
        <button 
          onClick={toggleFullScreen} 
          className="absolute top-2 right-2 z-20 p-2 rounded-full bg-blue-600 hover:bg-red-300 transition-colors"
          title={isFullScreen ? "Tam Ekrandan Çık" : "Tam Ekran Modu"}
        >
          {isFullScreen ? <Minimize size={20} /> : <Maximize size={20} />}
        </button>
        <RichTextEditorComponent
          editor={editor}
          onUpdate={handleContentUpdate}
          onStickerButtonClick={handleStickerButtonClick}
        />
        {/* Altında: Resim URL ve API Key alanları */}
        <div className="flex flex-col gap-4 mt-6">
          {/* Opsiyonel Resim URL */}
          <input
            type="text"
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            placeholder="Opsiyonel: Kapak Resmi URL"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:border-blue-500 outline-none"
          />
          {/* Zorunlu API Key */}
          <div>
            <input
              type="text"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="Zorunlu: Özel API Anahtarı"
              className={`w-full border ${apiKeyError ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:border-blue-500 outline-none`}
              required
            />
            {apiKeyError && <div className="text-red-500 text-sm mt-1">{apiKeyError}</div>}
          </div>
        </div>
      </div>
      {/* Sadece ortada açılan StickerModal */}
      <StickerModal
        open={showStickerPicker}
        onClose={() => setShowStickerPicker(false)}
        onSelect={handleStickerSelect}
      />
      {/* İçerik önizlemesi */}
      {!isFullScreen && (
        <div className="mt-12 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-blue-600 border-b pb-2 mb-4">İçeriğin Önizlemesi</h2>
          <div 
            className="ProseMirror prose max-w-none p-6 rounded-lg shadow-md"
            style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
            dangerouslySetInnerHTML={{ __html: preserveEmptyLines(editorContent) }} 
          />
        </div>
      )}
      {/* Yayınla butonu */}
      <div className="max-w-4xl mx-auto mt-8 mb-8 flex justify-end">
        <button
          onClick={handlePublish}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded text-lg shadow transition"
        >
          Gönderiyi Yayınla
        </button>
      </div>
    </div>
  );
}

