'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Heading, Input, Label, Stack, Text, Textarea } from 'null_ong2-design-system';
import type { StoreFormProps, StoreFormValues } from './StoreForm.types';

// BE 의 adminCreateStoreSchema 와 1:1 매칭. 빈 문자열은 BE 로 보내기 전에 null 로 변환된다.
const storeFormSchema = z.object({
  name: z.string().trim().min(1, '매장명을 입력해주세요.').max(255),
  address: z.string().trim().min(1, '주소를 입력해주세요.').max(500),
  lat: z.coerce.number({ invalid_type_error: '위도를 숫자로 입력하세요.' }).gte(-90).lte(90),
  lon: z.coerce.number({ invalid_type_error: '경도를 숫자로 입력하세요.' }).gte(-180).lte(180),
  phone: z.string().trim().max(20),
  description: z.string().trim().max(2000),
  imageUrl: z
    .string()
    .trim()
    .max(512)
    .refine((v) => v === '' || /^https?:\/\//.test(v), {
      message: '비워두거나 http(s):// 로 시작하는 URL 을 입력하세요.',
    }),
  openingHours: z.string().trim().max(255),
  rating: z.coerce.number().min(0).max(5),
});

const EMPTY_VALUES: StoreFormValues = {
  name: '',
  address: '',
  lat: 37.4979,
  lon: 127.0276,
  phone: '',
  description: '',
  imageUrl: '',
  openingHours: '',
  rating: 0,
};

export function StoreForm({ initial, onSubmit, onCancel, isSubmitting }: StoreFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StoreFormValues>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: initial
      ? {
          name: initial.name,
          address: initial.address,
          lat: initial.lat,
          lon: initial.lon,
          phone: initial.phone ?? '',
          description: initial.description ?? '',
          imageUrl: initial.imageUrl ?? '',
          openingHours: initial.openingHours ?? '',
          rating: initial.rating,
        }
      : EMPTY_VALUES,
  });

  useEffect(() => {
    if (initial) {
      reset({
        name: initial.name,
        address: initial.address,
        lat: initial.lat,
        lon: initial.lon,
        phone: initial.phone ?? '',
        description: initial.description ?? '',
        imageUrl: initial.imageUrl ?? '',
        openingHours: initial.openingHours ?? '',
        rating: initial.rating,
      });
    } else {
      reset(EMPTY_VALUES);
    }
  }, [initial, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing="lg">
        <Heading as="h3" size="lg">
          {initial ? '매장 수정' : '신규 매장 등록'}
        </Heading>

        <Stack spacing="sm">
          <Label htmlFor="store-name" required>
            매장명
          </Label>
          <Input id="store-name" {...register('name')} />
          {errors.name && (
            <Text size="sm" color="danger">
              {errors.name.message}
            </Text>
          )}
        </Stack>

        <Stack spacing="sm">
          <Label htmlFor="store-address" required>
            주소
          </Label>
          <Input id="store-address" {...register('address')} />
          {errors.address && (
            <Text size="sm" color="danger">
              {errors.address.message}
            </Text>
          )}
        </Stack>

        <div className="grid grid-cols-2 gap-3">
          <Stack spacing="sm">
            <Label htmlFor="store-lat" required>
              위도 (lat)
            </Label>
            <Input id="store-lat" type="number" step="0.000001" {...register('lat')} />
            {errors.lat && (
              <Text size="sm" color="danger">
                {errors.lat.message}
              </Text>
            )}
          </Stack>
          <Stack spacing="sm">
            <Label htmlFor="store-lon" required>
              경도 (lon)
            </Label>
            <Input id="store-lon" type="number" step="0.000001" {...register('lon')} />
            {errors.lon && (
              <Text size="sm" color="danger">
                {errors.lon.message}
              </Text>
            )}
          </Stack>
        </div>

        <Stack spacing="sm">
          <Label htmlFor="store-phone">전화번호</Label>
          <Input id="store-phone" placeholder="02-000-0000" {...register('phone')} />
          {errors.phone && (
            <Text size="sm" color="danger">
              {errors.phone.message}
            </Text>
          )}
        </Stack>

        <Stack spacing="sm">
          <Label htmlFor="store-hours">영업시간</Label>
          <Input
            id="store-hours"
            placeholder="매일 11:00 ~ 23:00"
            {...register('openingHours')}
          />
          {errors.openingHours && (
            <Text size="sm" color="danger">
              {errors.openingHours.message}
            </Text>
          )}
        </Stack>

        <Stack spacing="sm">
          <Label htmlFor="store-image">이미지 URL</Label>
          <Input id="store-image" placeholder="https://..." {...register('imageUrl')} />
          {errors.imageUrl && (
            <Text size="sm" color="danger">
              {errors.imageUrl.message}
            </Text>
          )}
        </Stack>

        <Stack spacing="sm">
          <Label htmlFor="store-rating">평점 (0–5)</Label>
          <Input
            id="store-rating"
            type="number"
            step="0.1"
            min="0"
            max="5"
            {...register('rating')}
          />
          {errors.rating && (
            <Text size="sm" color="danger">
              {errors.rating.message}
            </Text>
          )}
        </Stack>

        <Stack spacing="sm">
          <Label htmlFor="store-description">설명</Label>
          <Textarea
            id="store-description"
            rows={4}
            placeholder="매장 소개 / 특이사항"
            {...register('description')}
          />
          {errors.description && (
            <Text size="sm" color="danger">
              {errors.description.message}
            </Text>
          )}
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
