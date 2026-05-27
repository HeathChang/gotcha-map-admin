'use client';

import { useState } from 'react';

/**
 * 생성/수정 모달의 상태. `edit` 일 때만 대상 엔티티를 들고 있어
 * 컨테이너가 `modal.mode` 로 좁히면 `modal.entity` 가 타입-안전하게 보장된다.
 */
export type CrudModalState<TEntity> =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; entity: TEntity };

export interface UseCrudModalResult<TEntity> {
  modal: CrudModalState<TEntity>;
  isOpen: boolean;
  openCreate: () => void;
  openEdit: (entity: TEntity) => void;
  close: () => void;
}

/**
 * CRUD 목록 페이지 공통의 "닫힘 / 신규 / 수정" 모달 상태 머신.
 * stores 에서 인라인으로 쓰던 union 을 추출했고, announcements·tags·products
 * 등 앞으로 추가될 CRUD 페이지가 그대로 재사용한다.
 */
export function useCrudModal<TEntity>(): UseCrudModalResult<TEntity> {
  const [modal, setModal] = useState<CrudModalState<TEntity>>({ mode: 'closed' });

  return {
    modal,
    isOpen: modal.mode !== 'closed',
    openCreate: () => setModal({ mode: 'create' }),
    openEdit: (entity) => setModal({ mode: 'edit', entity }),
    close: () => setModal({ mode: 'closed' }),
  };
}
