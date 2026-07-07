import Placeholder from '@tiptap/extension-placeholder';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, Underline, List, ListOrdered, LinkIcon, Strikethrough } from 'lucide-react';

interface Props {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    minHeight?: number;
}

const toolbarBtn = (active: boolean): React.CSSProperties => ({
    width: 30,
    height: 30,
    border: 'none',
    background: active ? '#EEF2FF' : 'transparent',
    borderRadius: 6,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: active ? '#2547F9' : '#475569',
    fontSize: 13,
    fontWeight: active ? 700 : 400,
    fontFamily: 'inherit',
});

export default function RichTextEditor({ value, onChange, placeholder = 'Tulis konten...', minHeight = 200 }: Props) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({ placeholder }),
        ],
        content: value,
        onUpdate: ({ editor }) => onChange(editor.getHTML()),
        editorProps: {
            attributes: {
                style: `min-height: ${minHeight}px; padding: 12px 14px; outline: none; font-size: 13.5px; line-height: 1.6; color: #0F172A; font-family: inherit;`,
            },
        },
    });

    if (!editor) {
        return <div style={{ minHeight, background: '#F8FAFC', border: '1px solid #E8EAF1', borderRadius: 9 }} />;
    }

    return (
        <div style={{ border: '1px solid #E8EAF1', borderRadius: 9, overflow: 'hidden', background: '#F8FAFC' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 2, padding: '7px 8px', borderBottom: '1px solid #E9EDF2', background: '#fff' }}>
                <button type="button" style={toolbarBtn(editor.isActive('bold'))} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold"><Bold size={14} /></button>
                <button type="button" style={toolbarBtn(editor.isActive('italic'))} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic"><Italic size={14} /></button>
                <button type="button" style={toolbarBtn(editor.isActive('underline'))} onClick={() => editor.chain().focus().toggleUnderline?.() ?? editor.chain().focus().toggleStrike().run()} title="Underline"><Underline size={14} /></button>
                <button type="button" style={toolbarBtn(editor.isActive('strike'))} onClick={() => editor.chain().focus().toggleStrike().run()} title="Strikethrough"><Strikethrough size={14} /></button>
                <div style={{ width: 1, height: 18, background: '#ECEDF1', margin: '0 5px' }} />
                <button type="button" style={toolbarBtn(editor.isActive('bulletList'))} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet List"><List size={14} /></button>
                <button type="button" style={toolbarBtn(editor.isActive('orderedList'))} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Ordered List"><ListOrdered size={14} /></button>
                <div style={{ width: 1, height: 18, background: '#ECEDF1', margin: '0 5px' }} />
                <button type="button" style={toolbarBtn(false)} onClick={() => {
                    const url = window.prompt('URL:');

                    if (url) {
editor.chain().focus().setLink({ href: url }).run();
}
                }} title="Link"><LinkIcon size={14} /></button>
            </div>
            <EditorContent editor={editor} />
        </div>
    );
}
