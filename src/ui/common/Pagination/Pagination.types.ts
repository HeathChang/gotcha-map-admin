export interface PaginationProps {
  /** 현재 페이지 (1-base) */
  page: number;
  /** 페이지당 항목 수 */
  pageSize: number;
  /** 전체 항목 수 */
  total: number;
  /** 페이지 이동 요청 */
  onPageChange: (next: number) => void;
  /**
   * 좌측 범위 텍스트 뒤에 " · {note}" 형태로 덧붙일 부가 정보.
   * 예) 삭제 진행 중 표시.
   */
  note?: string;
}
