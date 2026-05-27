'use client';

import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Stack, Switch, Textarea } from 'null_ong2-design-system';
import type {
  AnnouncementFormProps,
  AnnouncementFormValues,
} from './AnnouncementForm.types';

// BE 의 adminCreateAnnouncementSchema 와 1:1 매칭.
const announcementFormSchema = z.object({
  title: z.string().trim().min(1, '제목을 입력해주세요.').max(255),
  content: z.string().trim().min(1, '내용을 입력해주세요.').max(10000),
  isActive: z.boolean(),
});

const EMPTY_VALUES: AnnouncementFormValues = {
  title: '',
  content: '',
  isActive: true,
};

function toFormValues(
  initial: AnnouncementFormProps['initial'],
): AnnouncementFormValues {
  if (!initial) return EMPTY_VALUES;
  return {
    title: initial.title,
    content: initial.content,
    isActive: initial.isActive,
  };
}

export function AnnouncementForm({
  initial,
  onSubmit,
  onCancel,
  isSubmitting,
}: AnnouncementFormProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementFormSchema),
    defaultValues: toFormValues(initial),
  });

  useEffect(() => {
    reset(toFormValues(initial));
  }, [initial, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing="lg">
        <Stack spacing="sm">
          <Input
            label="제목"
            placeholder="공지 제목"
            required
            error={errors.title?.message}
            {...register('title')}
          />
        </Stack>

        <Stack spacing="sm">
          <Textarea
            label="내용"
            rows={8}
            placeholder="공지 내용을 입력하세요…"
            required
            error={errors.content?.message}
            {...register('content')}
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
