'use client';

import { useEffect } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import clsx from 'clsx';
import {
  Button,
  Heading,
  Input,
  Label,
  Select,
  Stack,
  Switch,
  Text,
  Textarea,
} from 'null_ong2-design-system';
import type { GenderTarget } from '@/types/product.types';
import type { ProductFormProps, ProductFormValues } from './ProductForm.types';

const GENDER_OPTIONS: ReadonlyArray<{ value: GenderTarget; label: string }> = [
  { value: 'ALL', label: '전체' },
  { value: 'M', label: '남성' },
  { value: 'F', label: '여성' },
];

// BE 의 adminCreateProductSchema 와 1:1 매칭 (가격 역전 검사 포함).
const productFormSchema = z
  .object({
    productName: z.string().trim().min(1, '제품명을 입력해주세요.').max(255),
    productManufacturer: z.string().trim().max(255),
    category: z.string().trim().max(100),
    productInfo: z.string().trim().max(10000),
    minPrice: z.coerce.number().int().nonnegative('0 이상이어야 합니다.'),
    maxPrice: z.coerce.number().int().nonnegative('0 이상이어야 합니다.'),
    imageUrl: z
      .string()
      .trim()
      .max(512)
      .refine((v) => v === '' || /^https?:\/\//.test(v), {
        message: '비워두거나 http(s):// URL 을 입력하세요.',
      }),
    isNew: z.boolean(),
    isPopular: z.boolean(),
    genderTarget: z.enum(['M', 'F', 'ALL']),
    images: z
      .array(
        z.object({
          url: z
            .string()
            .trim()
            .max(512)
            .refine((v) => v === '' || /^https?:\/\//.test(v), {
              message: 'http(s):// URL 만 가능합니다.',
            }),
        }),
      )
      .max(20),
    tagIds: z.array(z.string()).max(50),
  })
  .refine((d) => d.maxPrice >= d.minPrice, {
    message: 'maxPrice 는 minPrice 이상이어야 합니다.',
    path: ['maxPrice'],
  });

const EMPTY_VALUES: ProductFormValues = {
  productName: '',
  productManufacturer: '',
  category: '',
  productInfo: '',
  minPrice: 0,
  maxPrice: 0,
  imageUrl: '',
  isNew: false,
  isPopular: false,
  genderTarget: 'ALL',
  images: [],
  tagIds: [],
};

function toFormValues(initial: ProductFormProps['initial']): ProductFormValues {
  if (!initial) return EMPTY_VALUES;
  return {
    productName: initial.productName,
    productManufacturer: initial.productManufacturer ?? '',
    category: initial.category ?? '',
    productInfo: initial.productInfo ?? '',
    minPrice: initial.minPrice,
    maxPrice: initial.maxPrice,
    imageUrl: initial.imageUrl ?? '',
    isNew: initial.isNew,
    isPopular: initial.isPopular,
    genderTarget: initial.genderTarget,
    images: initial.images.map((url) => ({ url })),
    tagIds: initial.tags.map((t) => t.tagId),
  };
}

export function ProductForm({
  initial,
  tagOptions,
  onSubmit,
  onCancel,
  isSubmitting,
}: ProductFormProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: toFormValues(initial),
  });

  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({ control, name: 'images' });

  useEffect(() => {
    reset(toFormValues(initial));
  }, [initial, reset]);

  // tagIds 토글 — Controller 없이 watch + setValue 로 직접 다룬다.
  const selectedTagIds = watch('tagIds');
  const toggleTag = (tagId: string) => {
    const next = selectedTagIds.includes(tagId)
      ? selectedTagIds.filter((id) => id !== tagId)
      : [...selectedTagIds, tagId];
    setValue('tagIds', next, { shouldDirty: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing="lg">
        <Heading as="h3" size="lg">
          {initial ? '제품 수정' : '신규 제품 등록'}
        </Heading>

        {/* 기본 정보 */}
        <Stack spacing="sm">
          <Input
            label="제품명"
            required
            error={errors.productName?.message}
            {...register('productName')}
          />
        </Stack>

        <div className="grid grid-cols-2 gap-3">
          <Stack spacing="sm">
            <Input
              label="제조사"
              error={errors.productManufacturer?.message}
              {...register('productManufacturer')}
            />
          </Stack>
          <Stack spacing="sm">
            <Input
              label="카테고리"
              placeholder="예: 키링 / 피규어"
              error={errors.category?.message}
              {...register('category')}
            />
          </Stack>
        </div>

        {/* 가격 */}
        <div className="grid grid-cols-2 gap-3">
          <Stack spacing="sm">
            <Input
              label="최소 가격 (원)"
              type="number"
              min={0}
              required
              error={errors.minPrice?.message}
              {...register('minPrice')}
            />
          </Stack>
          <Stack spacing="sm">
            <Input
              label="최대 가격 (원)"
              type="number"
              min={0}
              required
              error={errors.maxPrice?.message}
              {...register('maxPrice')}
            />
          </Stack>
        </div>

        {/* 메인 이미지 + 노출 플래그 */}
        <Stack spacing="sm">
          <Input
            label="메인 이미지 URL"
            placeholder="https://..."
            error={errors.imageUrl?.message}
            {...register('imageUrl')}
          />
        </Stack>

        <div className="grid grid-cols-3 gap-3">
          <Controller
            name="isNew"
            control={control}
            render={({ field }) => (
              <Switch
                label="신상품 (isNew)"
                checked={field.value}
                onChange={(checked) => field.onChange(checked)}
              />
            )}
          />
          <Controller
            name="isPopular"
            control={control}
            render={({ field }) => (
              <Switch
                label="인기 (isPopular)"
                checked={field.value}
                onChange={(checked) => field.onChange(checked)}
              />
            )}
          />
          <Controller
            name="genderTarget"
            control={control}
            render={({ field }) => (
              <Select
                label="성별 타겟"
                options={GENDER_OPTIONS as Array<{ value: string; label: string }>}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value as GenderTarget)}
              />
            )}
          />
        </div>

        {/* 설명 */}
        <Stack spacing="sm">
          <Textarea
            label="제품 설명"
            rows={4}
            error={errors.productInfo?.message}
            {...register('productInfo')}
          />
        </Stack>

        {/* 갤러리 이미지 */}
        <Stack spacing="sm">
          <Label>갤러리 이미지 URL</Label>
          {imageFields.length === 0 ? (
            <Text size="xs" color="muted">
              메인 이미지 외 추가 노출 이미지. 비워둘 수 있습니다.
            </Text>
          ) : null}
          <Stack spacing="2">
            {imageFields.map((field, idx) => (
              <div key={field.id} className="flex items-start gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="https://..."
                    error={errors.images?.[idx]?.url?.message}
                    {...register(`images.${idx}.url`)}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeImage(idx)}
                >
                  제거
                </Button>
              </div>
            ))}
          </Stack>
          <div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => appendImage({ url: '' })}
              disabled={imageFields.length >= 20}
            >
              + 이미지 URL 추가
            </Button>
          </div>
        </Stack>

        {/* 태그 multi-select */}
        <Stack spacing="sm">
          <Label>태그</Label>
          {tagOptions.length === 0 ? (
            <Text size="xs" color="muted">
              등록된 태그가 없습니다. 태그 관리에서 먼저 생성하세요.
            </Text>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tagOptions.map((tag) => {
                const active = selectedTagIds.includes(tag.tagId);
                return (
                  <button
                    type="button"
                    key={tag.tagId}
                    onClick={() => toggleTag(tag.tagId)}
                    className={clsx(
                      'rounded-full border px-3 py-1 text-xs transition-colors',
                      active
                        ? 'border-admin-accent bg-admin-accent/10 text-admin-accent'
                        : 'border-admin-border text-gray-600 hover:bg-gray-50',
                    )}
                  >
                    {tag.name}
                    {tag.relationType ? (
                      <span className="ml-1 text-[10px] text-gray-400">· {tag.relationType}</span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          )}
          <Text size="xs" color="muted">
            저장 시 선택된 태그 목록으로 전체 교체됩니다.
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
