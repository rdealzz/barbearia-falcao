'use client';

import { Camera, Loader2, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { Avatar } from '@/components/ui/avatar';

const MAX_SIZE_IN_BYTES = 2 * 1024 * 1024;

interface AvatarPickerProps {
  name: string;
  defaultValue?: string;
}

/**
 * Seleção da foto de perfil. Hoje o arquivo é convertido em data URL e
 * enviado junto do formulário; ao ativar o Supabase Storage, basta trocar
 * `readAsDataURL` pelo upload e guardar a URL pública retornada.
 */
export function AvatarPicker({ name, defaultValue }: AvatarPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(defaultValue ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    if (file.size > MAX_SIZE_IN_BYTES) {
      setError('A imagem precisa ter no máximo 2 MB.');
      return;
    }

    setError(null);
    setLoading(true);

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(String(reader.result));
      setLoading(false);
    };
    reader.onerror = () => {
      setError('Não foi possível ler a imagem.');
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <input type="hidden" name="avatarUrl" value={preview} />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="group relative rounded-full"
        aria-label="Alterar foto de perfil"
      >
        <Avatar name={name} src={preview || undefined} size="xl" ring />
        <span className="absolute inset-0 grid place-items-center rounded-full bg-canvas/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {loading ? (
            <Loader2 className="size-5 animate-spin text-content" />
          ) : (
            <Camera className="size-5 text-content" />
          )}
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-xs text-muted transition-colors hover:text-content"
        >
          Alterar foto
        </button>
        {preview ? (
          <button
            type="button"
            onClick={() => setPreview('')}
            className="inline-flex items-center gap-1 text-xs text-subtle transition-colors hover:text-falcao-700 dark:text-falcao-300"
          >
            <Trash2 className="size-3" />
            Remover
          </button>
        ) : null}
      </div>

      <p className="max-w-xs text-center text-xs leading-relaxed text-subtle">
        Sua foto aparece para o barbeiro no dia do atendimento, o que facilita a identificação na
        chegada.
      </p>

      {error ? (
        <p role="alert" className="text-xs text-falcao-700 dark:text-falcao-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}
