import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
 Bold,
 Italic,
 Strikethrough,
 List,
 ListOrdered,
 Quote,
 Code,
 Code2,
 Link as LinkIcon,
 Undo2,
 Redo2,
 Heading2,
 Heading3,
 Minus,
} from "lucide-react";
import { useEffect } from "react";

const ToolbarButton = ({ onClick, active, disabled, children, title }) => (
 <button
 type="button"
 onClick={onClick}
 disabled={disabled}
 title={title}
 className={`p-1.5 rounded hover:bg-ink-100 disabled:opacity-30 disabled:cursor-not-allowed transition ${
 active ? "bg-amber-100 text-amber-700" : "text-ink-600"
 }`}
 >
 {children}
 </button>
);

const Divider = () => <div className="w-px h-5 bg-ink-200 mx-1" />;

export default function RichTextEditor({
 value = "",
 onChange,
 placeholder = "Bắt đầu viết nội dung…",
 minHeight = "min-h-[200px]",
}) {
 const editor = useEditor({
 extensions: [
 StarterKit.configure({
 heading: { levels: [2, 3] },
 codeBlock: {},
 }),
 Link.configure({
 openOnClick: false,
 HTMLAttributes: {
 class: "text-amber-600 underline",
 },
 }),
 Placeholder.configure({ placeholder }),
 ],
 content: value,
 editorProps: {
 attributes: {
 class: `prose prose-ink max-w-none focus:outline-none ${minHeight} px-4 py-3`,
 },
 },
 onUpdate: ({ editor }) => {
 onChange?.(editor.getHTML());
 },
 });

 useEffect(() => {
 if (editor && value !== editor.getHTML()) {
 editor.commands.setContent(value || "");
 }
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [value]);

 if (!editor) return null;

 const setLink = () => {
 const previousUrl = editor.getAttributes("link").href;
 const url = window.prompt("Nhập URL (để trống để bỏ link):", previousUrl);
 if (url === null) return;
 if (url === "") {
 editor.chain().focus().extendMarkRange("link").unsetLink().run();
 return;
 }
 editor
 .chain()
 .focus()
 .extendMarkRange("link")
 .setLink({ href: url })
 .run();
 };

 return (
 <div className="border border-ink-200 rounded-lg bg-white overflow-hidden focus-within:border-amber-500 transition">
 {/* Toolbar */}
 <div className="flex items-center flex-wrap gap-0.5 p-2 border-b border-ink-100 bg-ink-50/50">
 <ToolbarButton
 onClick={() => editor.chain().focus().toggleBold().run()}
 active={editor.isActive("bold")}
 title="Bold (Ctrl+B)"
 >
 <Bold size={15} />
 </ToolbarButton>
 <ToolbarButton
 onClick={() => editor.chain().focus().toggleItalic().run()}
 active={editor.isActive("italic")}
 title="Italic (Ctrl+I)"
 >
 <Italic size={15} />
 </ToolbarButton>
 <ToolbarButton
 onClick={() => editor.chain().focus().toggleStrike().run()}
 active={editor.isActive("strike")}
 title="Strikethrough"
 >
 <Strikethrough size={15} />
 </ToolbarButton>
 <ToolbarButton
 onClick={() => editor.chain().focus().toggleCode().run()}
 active={editor.isActive("code")}
 title="Inline code"
 >
 <Code size={15} />
 </ToolbarButton>

 <Divider />

 <ToolbarButton
 onClick={() =>
 editor.chain().focus().toggleHeading({ level: 2 }).run()
 }
 active={editor.isActive("heading", { level: 2 })}
 title="Heading 2"
 >
 <Heading2 size={15} />
 </ToolbarButton>
 <ToolbarButton
 onClick={() =>
 editor.chain().focus().toggleHeading({ level: 3 }).run()
 }
 active={editor.isActive("heading", { level: 3 })}
 title="Heading 3"
 >
 <Heading3 size={15} />
 </ToolbarButton>

 <Divider />

 <ToolbarButton
 onClick={() => editor.chain().focus().toggleBulletList().run()}
 active={editor.isActive("bulletList")}
 title="Bullet list"
 >
 <List size={15} />
 </ToolbarButton>
 <ToolbarButton
 onClick={() => editor.chain().focus().toggleOrderedList().run()}
 active={editor.isActive("orderedList")}
 title="Numbered list"
 >
 <ListOrdered size={15} />
 </ToolbarButton>
 <ToolbarButton
 onClick={() => editor.chain().focus().toggleBlockquote().run()}
 active={editor.isActive("blockquote")}
 title="Quote"
 >
 <Quote size={15} />
 </ToolbarButton>
 <ToolbarButton
 onClick={() => editor.chain().focus().toggleCodeBlock().run()}
 active={editor.isActive("codeBlock")}
 title="Code block"
 >
 <Code2 size={15} />
 </ToolbarButton>
 <ToolbarButton
 onClick={() => editor.chain().focus().setHorizontalRule().run()}
 title="Divider"
 >
 <Minus size={15} />
 </ToolbarButton>

 <Divider />

 <ToolbarButton
 onClick={setLink}
 active={editor.isActive("link")}
 title="Link"
 >
 <LinkIcon size={15} />
 </ToolbarButton>

 <div className="flex-1" />

 <ToolbarButton
 onClick={() => editor.chain().focus().undo().run()}
 disabled={!editor.can().undo()}
 title="Undo (Ctrl+Z)"
 >
 <Undo2 size={15} />
 </ToolbarButton>
 <ToolbarButton
 onClick={() => editor.chain().focus().redo().run()}
 disabled={!editor.can().redo()}
 title="Redo (Ctrl+Y)"
 >
 <Redo2 size={15} />
 </ToolbarButton>
 </div>

 <EditorContent editor={editor} />
 </div>
 );
}
