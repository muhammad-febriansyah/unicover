import { useState } from 'react';

interface Props {
    value: number;
    onChange: (val: number) => void;
    placeholder?: string;
    required?: boolean;
}

export default function CurrencyInput({ value, onChange, placeholder = '0', required }: Props) {
    const [display, setDisplay] = useState(
        value > 0 ? value.toLocaleString('id-ID') : '',
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\D/g, '');
        const num = Number(raw) || 0;
        setDisplay(num > 0 ? num.toLocaleString('id-ID') : '');
        onChange(num);
    };

    return (
        <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 13, fontWeight: 600, color: '#94A3B8', zIndex: 1 }}>Rp</span>
            <input
                type="text"
                inputMode="numeric"
                value={display}
                onChange={handleChange}
                placeholder={placeholder}
                required={required}
                style={{
                    width: '100%',
                    height: 42,
                    padding: '0 14px 0 40px',
                    border: '1px solid #E8EAF1',
                    borderRadius: 9,
                    background: '#F8FAFC',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    color: '#0F172A',
                    fontFamily: 'inherit',
                }}
            />
        </div>
    );
}
