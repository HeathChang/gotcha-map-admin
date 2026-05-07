'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import dayjs from 'dayjs';
import {
  Button,
  Heading,
  Select,
  Stack,
  Text,
  Textarea,
} from 'null_ong2-design-system';
import type {
  InquiryAnswerFormProps,
  InquiryAnswerFormValues,
} from './InquiryAnswerForm.types';
import {
  INQUIRY_STATUS_OPTIONS,
} from '@/ui/inquiries/InquiryStatusBadge/inquiryStatusBadge.constants';

const answerSchema = z.object({
  status: z.enum(['pending', 'processing', 'completed', 'rejected']),
  answer: z.string().min(1, '답변 내용을 입력하세요.'),
});

const STATUS_SELECT_OPTIONS = INQUIRY_STATUS_OPTIONS.map((opt) => ({
  value: opt.value,
  label: opt.label,
}));

export function InquiryAnswerForm({
  inquiry,
  onSubmit,
  isSubmitting,
}: InquiryAnswerFormProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InquiryAnswerFormValues>({
    resolver: zodResolver(answerSchema),
    defaultValues: {
      status: inquiry.status,
      answer: inquiry.answer ?? '',
    },
  });

  useEffect(() => {
    reset({ status: inquiry.status, answer: inquiry.answer ?? '' });
  }, [inquiry, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing="lg">
        <Stack spacing="2">
          <Heading as="h3" size="lg">
            {inquiry.title}
          </Heading>
          <Text size="xs" color="muted">
            {inquiry.userEmail} · {dayjs(inquiry.createdAt).format('YYYY-MM-DD HH:mm')}
          </Text>
        </Stack>

        <div className="rounded-md border border-admin-border bg-gray-50 p-4">
          <Text size="sm">{inquiry.content}</Text>
        </div>

        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select
              label="처리 상태"
              options={STATUS_SELECT_OPTIONS}
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              required
            />
          )}
        />

        <Textarea
          label="답변"
          rows={6}
          placeholder="답변 내용을 입력하세요…"
          required
          error={errors.answer?.message}
          {...register('answer')}
        />

        <div className="flex justify-end">
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? '저장 중…' : '답변 저장'}
          </Button>
        </div>
      </Stack>
    </form>
  );
}
