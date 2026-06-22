import type { AdminRole } from '@/types/admin.types';

export interface AdminUserFormValues {
  email: string;
  password: string;
  name: string;
  role: AdminRole;
  // member 일 때만 의미를 가진다. 빈 문자열 = 미선택.
  storeId: string;
}

export interface AdminStoreOption {
  storeId: string;
  name: string;
}

export interface AdminUserFormProps {
  storeOptions: ReadonlyArray<AdminStoreOption>;
  storeOptionsLoading: boolean;
  onSubmit: (values: AdminUserFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}
