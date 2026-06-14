'use client';

import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Stack, Switch } from 'null_ong2-design-system';
import { ImageUploadField } from '@/ui/common/ImageUploadField/ImageUploadField.ui';
import type { BannerFormProps, BannerFormValues } from './BannerForm.types';

const DEFAULT_LINK_URL = 'https://www.google.com';

// BE 의 adminCreateBannerSchema 와 1:1 매칭.
const bannerFormSchema = z.object({
  imageUrl: z.string().trim().min(1, '이미지를 업로드해주세요.').max(512),
  title: z.string().trim().max(255),
  linkUrl: z.string().trim().max(512),
  sortOrder: z.coerce.number().int().min(0),
  isActive: z.boolean(),
});

const EMPTY_VALUES: BannerFormValues = {
  imageUrl: '',
  title: '',
  linkUrl: DEFAULT_LINK_URL,
  sortOrder: 0,
  isActive: true,
};

function toFormValues(initial: BannerFormProps['initial']): BannerFormValues {
  if (!initial) return EMPTY_VALUES;
  return {
    imageUrl: initial.imageUrl,
    title: initial.title ?? '',
    linkUrl: initial.linkUrl ?? DEFAULT_LINK_URL,
    sortOrder: initial.sortOrder,
    isActive: initial.isActive,
  };
}

export function BannerForm({
  initial,
  onSubmit,
  onCancel,
  isSubmitting,
}: BannerFormProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BannerFormValues>({
    resolver: zodResolver(bannerFormSchema),
    defaultValues: toFormValues(initial),
  });

  useEffect(() => {
    reset(toFormValues(initial));
  }, [initial, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing="lg">
        <Controller
          name="imageUrl"
          control={control}
          render={({ field }) => (
            <ImageUploadField
              label="배너 이미지"
              required
              value={field.value}
              onChange={field.onChange}
              error={errors.imageUrl?.message}
              disabled={isSubmitting}
            />
          )}
        />

        <Stack spacing="sm">
          <Input
            label="제목 (선택, 관리용)"
            placeholder="배너 제목"
            error={errors.title?.message}
            {...register('title')}
          />
        </Stack>

        <Stack spacing="sm">
          <Input
            label="링크 URL (탭 시 이동 — 현재 앱에서는 미사용)"
            placeholder="https://www.google.com"
            error={errors.linkUrl?.message}
            {...register('linkUrl')}
          />
        </Stack>

        <Stack spacing="sm">
          <Input
            label="노출 순서 (작을수록 먼저)"
            type="number"
            min={0}
            error={errors.sortOrder?.message}
            {...register('sortOrder', { valueAsNumber: true })}
          />
        </Stack>

        <Controller
          name="isActive"
          control={control}
          render={({ field }) => (
            <Switch
              label="활성 (앱에 노출)"
              checked={field.value}
              onChange={(checked) => field.onChange(checked)}
            />
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
            취소
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? '저장 중…' : initial ? '수정 저장' : '등록'}
          </Button>
        </div>
      </Stack>
    </form>
  );
}
