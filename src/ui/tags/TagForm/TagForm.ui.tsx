'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Stack, Text } from 'null_ong2-design-system';
import type { TagFormProps, TagFormValues } from './TagForm.types';

// BE 의 adminCreateTagSchema 와 1:1 매칭. 빈 relationType 은 BE 로 보내기 전 null 로 변환된다.
const tagFormSchema = z.object({
  name: z.string().trim().min(1, '태그명을 입력해주세요.').max(100),
  relationType: z.string().trim().max(50),
});

const EMPTY_VALUES: TagFormValues = {
  name: '',
  relationType: '',
};

function toFormValues(initial: TagFormProps['initial']): TagFormValues {
  if (!initial) return EMPTY_VALUES;
  return {
    name: initial.name,
    relationType: initial.relationType ?? '',
  };
}

export function TagForm({ initial, onSubmit, onCancel, isSubmitting }: TagFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TagFormValues>({
    resolver: zodResolver(tagFormSchema),
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
            label="태그명"
            placeholder="예: 산리오"
            required
            error={errors.name?.message}
            {...register('name')}
          />
        </Stack>

        <Stack spacing="sm">
          <Input
            label="분류 (relationType)"
            placeholder="예: character / category (선택)"
            error={errors.relationType?.message}
            {...register('relationType')}
          />
          <Text size="xs" color="muted">
            제품을 묶는 분류값입니다. 비워두면 분류 없음으로 저장됩니다.
          </Text>
        </Stack>

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
