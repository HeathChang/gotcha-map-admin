'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Select, Stack, Text } from 'null_ong2-design-system';
import type {
  StoreProductFormProps,
  StoreProductFormValues,
} from './StoreProductForm.types';

// price 는 0 이상 정수, stock 은 비워두면 무제한(null).
const storeProductFormSchema = z.object({
  productId: z.string().trim().min(1, '제품을 선택해주세요.'),
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

const EMPTY_VALUES: StoreProductFormValues = {
  productId: '',
  price: 0,
  stock: '',
};

function toFormValues(
  initial: StoreProductFormProps['initial'],
): StoreProductFormValues {
  if (!initial) return EMPTY_VALUES;
  return {
    productId: initial.productId,
    price: initial.price,
    stock: initial.stock === null ? '' : String(initial.stock),
  };
}

export function StoreProductForm({
  initial,
  productOptions,
  onSubmit,
  onCancel,
  isSubmitting,
}: StoreProductFormProps) {
  const isEdit = initial !== null;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StoreProductFormValues>({
    resolver: zodResolver(storeProductFormSchema),
    defaultValues: toFormValues(initial),
  });

  useEffect(() => {
    reset(toFormValues(initial));
  }, [initial, reset]);

  const productSelectOptions = productOptions.map((opt) => ({
    value: opt.productId,
    label: opt.productName,
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing="lg">
        {isEdit ? (
          <Stack spacing="sm">
            <Text size="sm" weight="medium">
              {initial?.productName}
            </Text>
            <Text size="xs" color="muted">
              제품은 변경할 수 없습니다. 가격·재고만 수정하세요.
            </Text>
          </Stack>
        ) : (
          <Stack spacing="sm">
            <Select
              label="제품"
              required
              placeholder="제품을 선택하세요"
              options={productSelectOptions}
              error={errors.productId?.message}
              {...register('productId')}
            />
          </Stack>
        )}

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
          <Text size="xs" color="muted">
            재고를 비워두면 무제한(재고 미관리)으로 저장됩니다.
          </Text>
        </Stack>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
            취소
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? '저장 중…' : isEdit ? '수정 저장' : '등록'}
          </Button>
        </div>
      </Stack>
    </form>
  );
}
