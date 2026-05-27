import { Alert, Spinner } from 'null_ong2-design-system';
import type { ListStateViewProps } from './ListStateView.types';

/**
 * 목록 페이지 공통의 에러 + 로딩 처리. inquiries / stores 가 동일하게
 * 반복하던 "에러 Alert 를 위에 노출하고, 로딩이면 스피너로 본문을 대체"
 * 패턴을 추출했다. 에러는 로딩 여부와 무관하게 항상 본문 위에 표시한다.
 */
export function ListStateView({
  isLoading,
  errorMessage,
  errorTitle,
  loadingLabel = '목록 불러오는 중',
  children,
}: ListStateViewProps) {
  return (
    <>
      {errorMessage ? (
        <Alert variant="danger" title={errorTitle}>
          {errorMessage}
        </Alert>
      ) : null}

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Spinner size="md" label={loadingLabel} />
        </div>
      ) : (
        children
      )}
    </>
  );
}
