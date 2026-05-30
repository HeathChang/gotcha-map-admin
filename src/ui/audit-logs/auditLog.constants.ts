type BadgeVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

// 필터 Select 옵션 — 'all' 은 BE 로 보내지 않고 미필터를 의미한다.
export const AUDIT_TARGET_TYPE_OPTIONS: ReadonlyArray<{ value: string; label: string }> = [
  { value: 'all', label: '전체 대상' },
  { value: 'inquiry', label: '문의' },
  { value: 'tag', label: '태그' },
  { value: 'announcement', label: '공지' },
  { value: 'store', label: '매장' },
  { value: 'product', label: '제품' },
  { value: 'user', label: '회원' },
];

export const AUDIT_ACTION_OPTIONS: ReadonlyArray<{ value: string; label: string }> = [
  { value: 'all', label: '전체 액션' },
  { value: 'inquiry.answer', label: '문의 답변' },
  { value: 'tag.create', label: '태그 생성' },
  { value: 'tag.update', label: '태그 수정' },
  { value: 'tag.delete', label: '태그 삭제' },
  { value: 'announcement.create', label: '공지 생성' },
  { value: 'announcement.update', label: '공지 수정' },
  { value: 'announcement.delete', label: '공지 삭제' },
  { value: 'store.create', label: '매장 생성' },
  { value: 'store.update', label: '매장 수정' },
  { value: 'store.delete', label: '매장 삭제' },
  { value: 'product.create', label: '제품 생성' },
  { value: 'product.update', label: '제품 수정' },
  { value: 'product.delete', label: '제품 삭제' },
  { value: 'user.status', label: '회원 상태 변경' },
];

const ACTION_LABEL_MAP: Record<string, string> = Object.fromEntries(
  AUDIT_ACTION_OPTIONS.filter((o) => o.value !== 'all').map((o) => [o.value, o.label]),
);

/** action 키를 한글 라벨로. 매핑이 없으면 원문(예: store.update)을 그대로 노출. */
export function actionLabel(action: string): string {
  return ACTION_LABEL_MAP[action] ?? action;
}

/** action 의 동사(create/update/delete/answer)로 Badge 색을 정한다. */
export function actionVariant(action: string): BadgeVariant {
  const verb = action.split('.')[1] ?? '';
  switch (verb) {
    case 'create':
      return 'success';
    case 'update':
    case 'answer':
    case 'status':
      return 'info';
    case 'delete':
      return 'danger';
    default:
      return 'neutral';
  }
}
