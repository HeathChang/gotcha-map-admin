export interface PasswordResetFormValues {
  password: string;
}

export interface PasswordResetFormProps {
  // 대상 운영자 표시용 라벨 (이메일 등).
  targetLabel: string;
  onSubmit: (values: PasswordResetFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}
