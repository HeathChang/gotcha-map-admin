export interface LoginFormValues {
  email: string;
  password: string;
}

export interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => void;
  isSubmitting: boolean;
  errorMessage?: string | null;
}
