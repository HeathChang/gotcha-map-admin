'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Stack, Text, Textarea } from 'null_ong2-design-system';
import type {
  StoreOverrideFormProps,
  StoreOverrideFormValues,
} from './StoreOverrideForm.types';

const storeOverrideFormSchema = z.object({
  productId: z.string().trim().max(64),
  productName: z.string().trim().min(1, '제품명을 입력해주세요.').max(255),
  productInfo: z.string().trim().max(2000),
  imageUrl: z
    .string()
    .trim()
    .max(512)
    .refine((v) => v === '' || /^https?:\/\//.test(v), {
      message: '비워두거나 http(s):// 로 시작하는 URL 을 입력하세요.',
    }),
  price: z.coerce
    .number({ invalid_type_error: '가격을 숫자로 입력하세요.' })
    .int('가격은 정수로 입력하세요.')
    .gte(0, '가격은 0 이상이어야 합니다.'),
  stock: z
    .string()
    .trim()
    .refine((v) => v === '' || /^\d+$/.test(v), {
      message: '재고는 비워두거나 0 이상 정수로 입력하세요.',
    }),
});

const EMPTY_VALUES: StoreOverrideFormValues = {
  productId: '',
  productName: '',
  productInfo: '',
  imageUrl: '',
  price: 0,
  stock: '',
};

function toFormValues(
  initial: StoreOverrideFormProps['initial'],
): StoreOverrideFormValues {
  if (!initial) return EMPTY_VALUES;
  return {
    productId: initial.productId ?? '',
    productName: initial.productName,
    productInfo: initial.productInfo ?? '',
    imageUrl: initial.imageUrl ?? '',
    price: initial.price,
    stock: initial.stock === null ? '' : String(initial.stock),
  };
}

export function StoreOverrideForm({
  initial,
  onSubmit,
  onCancel,
  isSubmitting,
}: StoreOverrideFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StoreOverrideFormValues>({
    resolver: zodResolver(storeOverrideFormSchema),
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
            label="제품명"
            placeholder="예: 치이카와 키링 (매장 한정)"
            required
            error={errors.productName?.message}
            {...register('productName')}
          />
        </Stack>

        <Stack spacing="sm">
          <Input
            label="연결 제품 ID (productId)"
            placeholder="비워두면 매장 전용 신규 제품"
            error={errors.productId?.message}
            {...register('productId')}
          />
          <Text size="xs" color="muted">
            글로벌 카탈로그 제품을 덮어쓰려면 해당 productId 를 입력하세요. 비워두면 이 매장에만
            존재하는 신규 제품으로 등록됩니다.
          </Text>
        </Stack>

        <div className="grid grid-cols-2 gap-3">
          <Stack spacing="sm">
            <Input
              label="가격 (원)"
              type="number"
              min="0"
              step="1"
              required
              error={errors.price?.message}
              {...register('price')}
            />
          </Stack>
          <Stack spacing="sm">
            <Input
              label="재고"
              type="number"
              min="0"
              step="1"
              placeholder="비워두면 무제한"
              error={errors.stock?.message}
              {...register('stock')}
            />
          </Stack>
        </div>

        <Stack spacing="sm">
          <Input
            label="이미지 URL"
            placeholder="https://..."
            error={errors.imageUrl?.message}
            {...register('imageUrl')}
          />
        </Stack>

        <Stack spacing="sm">
          <Textarea
            label="제품 정보"
            rows={3}
            placeholder="매장 전용 설명 / 특이사항 (선택)"
            error={errors.productInfo?.message}
            {...register('productInfo')}
          />
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
