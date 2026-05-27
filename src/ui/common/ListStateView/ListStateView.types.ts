import type { ReactNode } from 'react';

export interface ListStateViewProps {
  /** 목록 쿼리 로딩 중 여부 */
  isLoading: boolean;
  /** 에러 메시지 (없으면 null) */
  errorMessage: string | null;
  /** 에러 Alert 제목 (예: '매장 목록을 불러오지 못했습니다') */
  errorTitle: string;
  /** 로딩 스피너 레이블. 기본 '목록 불러오는 중'. */
  loadingLabel?: string;
  /** 로딩이 아닐 때 렌더링할 본문 (테이블 + 페이지네이션 등) */
  children: ReactNode;
}
