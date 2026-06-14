'use client';

import { useRef, useState } from 'react';
import { Button, Text } from 'null_ong2-design-system';
import { uploadAdminImage } from '@/api/admin/banners.api';
import { resolveAdminImageUrl } from '@/lib/imageUrl';

interface ImageUploadFieldProps {
  label?: string;
  value: string;
  onChange: (imageUrl: string) => void;
  required?: boolean;
  error?: string;
  disabled?: boolean;
}

/**
 * 파일 선택 → 즉시 BE 업로드 → 반환된 상대경로(`/uploads/...`)를 폼 값으로 set.
 * 어드민 전반의 이미지 업로드 공통 위젯(현재 배너에서 사용).
 */
export function ImageUploadField({
  label = '이미지',
  value,
  onChange,
  required,
  error,
  disabled,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const preview = resolveAdminImageUrl(value);

  const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const imageUrl = await uploadAdminImage(file);
      onChange(imageUrl);
    } catch {
      setUploadError('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setUploading(false);
      // 같은 파일 재선택도 onChange 가 발생하도록 input 값 초기화.
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Text size="sm" weight="medium">
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </Text>

      {preview ? (
        <img
          src={preview}
          alt="배너 미리보기"
          className="h-32 w-full rounded-md border border-admin-border object-cover"
        />
      ) : (
        <div className="flex h-32 w-full items-center justify-center rounded-md border border-dashed border-admin-border bg-gray-50">
          <Text size="sm" color="muted">
            이미지를 업로드하세요
          </Text>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
        onChange={handleSelect}
        disabled={disabled || uploading}
      />

      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={disabled || uploading}
        >
          {uploading ? '업로드 중…' : value ? '이미지 변경' : '이미지 선택'}
        </Button>
      </div>

      {(uploadError ?? error) ? (
        <Text size="sm" className="text-red-500">
          {uploadError ?? error}
        </Text>
      ) : null}
    </div>
  );
}
