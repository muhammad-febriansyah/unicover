import { Upload, X, ImageIcon } from 'lucide-react';
import { useState, useRef } from 'react';

interface Props {
    files: File[];
    onChange: (files: File[]) => void;
    existingImages?: { id: number; path: string; is_primary: boolean }[];
    onDeleteImage?: (id: number) => void;
    max?: number;
}

export default function ImageUpload({ files, onChange, existingImages = [], onDeleteImage, max = 6 }: Props) {
    const [previews, setPreviews] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = Array.from(e.target.files ?? []);
        const newFiles = [...files, ...selected].slice(0, max);

        const newPreviews = newFiles.map((f) => URL.createObjectURL(f));
        previews.forEach((p) => URL.revokeObjectURL(p));
        setPreviews(newPreviews);
        onChange(newFiles);
    };

    const remove = (index: number) => {
        const newFiles = files.filter((_, i) => i !== index);
        const newPreviews = previews.filter((_, i) => i !== index);

        if (previews[index]) {
            URL.revokeObjectURL(previews[index]);
        }

        setPreviews(newPreviews);
        onChange(newFiles);
    };

    const total = existingImages.length + files.length;

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 12 }}>
                {existingImages.map((img) => (
                    <div key={img.id} style={{ aspectRatio: '1', borderRadius: 11, position: 'relative', overflow: 'hidden', border: img.is_primary ? '2px solid #2547F9' : '1px solid #E8EAF1', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.05)' }}>
                        <img src={`/storage/${img.path}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        {img.is_primary && <span style={{ position: 'absolute', top: 6, left: 6, fontSize: 9, fontWeight: 600, color: '#fff', background: '#2547F9', padding: '2px 6px', borderRadius: 4 }}>Utama</span>}
                        {onDeleteImage && (
                            <button type="button" onClick={() => onDeleteImage(img.id)} style={{ position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: 6, border: 'none', background: 'rgba(0,0,0,.5)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <X size={13} />
                            </button>
                        )}
                    </div>
                ))}
                {files.map((file, i) => (
                    <div key={i} style={{ aspectRatio: '1', borderRadius: 11, position: 'relative', overflow: 'hidden', border: '1px solid #E8EAF1', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.05)' }}>
                        {previews[i] ? (
                            <img src={previews[i]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#CBD5E1' }}>
                                <ImageIcon size={28} />
                            </div>
                        )}
                        <button type="button" onClick={() => remove(i)} style={{ position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: 6, border: 'none', background: 'rgba(0,0,0,.5)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <X size={13} />
                        </button>
                    </div>
                ))}
                {total < max && (
                    <button type="button" onClick={() => inputRef.current?.click()} style={{ aspectRatio: '1', borderRadius: 11, border: '2px dashed #CBD5E1', background: '#F8FAFC', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer', color: '#64748B' }}>
                        <Upload size={20} />
                        <span style={{ fontSize: 11, fontWeight: 500 }}>Tambah</span>
                    </button>
                )}
            </div>
            <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleSelect} style={{ display: 'none' }} />
        </div>
    );
}
