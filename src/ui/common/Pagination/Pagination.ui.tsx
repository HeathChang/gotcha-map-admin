import { Button, Text } from 'null_ong2-design-system';
import type { PaginationProps } from './Pagination.types';

/**
 * 목록 하단 공통 페이지네이션. inquiries / stores 가 동일하게 인라인으로
 * 갖고 있던 범위 텍스트 + 이전/다음 버튼을 추출했다.
 * lastPage·rangeStart·rangeEnd 계산을 내부로 캡슐화한다.
 */
export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  note,
}: PaginationProps) {
  const lastPage = Math.max(1, Math.ceil(total / pageSize));
  const rangeStart = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, total);

  return (
    <div className="flex items-center justify-between">
      <Text size="sm" color="muted">
        {total === 0 ? '결과 없음' : `${rangeStart}–${rangeEnd} / 총 ${total}건`}
        {note ? ` · ${note}` : ''}
      </Text>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
        >
          이전
        </Button>
        <Text size="sm" color="muted">
          {page} / {lastPage}
        </Text>
        <Button
          variant="ghost"
          size="sm"
          disabled={page >= lastPage}
          onClick={() => onPageChange(Math.min(lastPage, page + 1))}
        >
          다음
        </Button>
      </div>
    </div>
  );
}
