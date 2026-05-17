import type { AdminStore } from '@/types/store.types';

export interface StoreFormValues {
  name: string;
  address: string;
  lat: number;
  lon: number;
  phone: string;
  description: string;
  imageUrl: string;
  openingHours: string;
  rating: number;
}

export interface StoreFormProps {
  // null: 신규 생성 / AdminStore: 수정.
  initial: AdminStore | null;
  onSubmit: (values: StoreFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}
