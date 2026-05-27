'use client';

import { useEffect, useState } from 'react';

interface UsePaginatedSearchOptions {
  /** 검색어 입력 → 서버 호출 사이의 디바운스 (ms). 기본 300. */
  debounceMs?: number;
  /**
   * 검색어 외에 페이지를 1로 되돌려야 하는 추가 의존성.
   * 예) 상태 필터 변경 시 첫 페이지로. 식별자 변경만 감지하므로
   * 매 렌더 새 참조를 넘기지 않도록 주의한다.
   */
  resetPageDeps?: ReadonlyArray<unknown>;
}

interface UsePaginatedSearchResult {
  /** 입력 필드에 그대로 바인딩할 raw 값 */
  searchInput: string;
  setSearchInput: (next: string) => void;
  /** 디바운스 + trim 된 검색어. 쿼리 키/파라미터에 사용한다. */
  debouncedQ: string;

  page: number;
  setPage: (next: number) => void;
  resetPage: () => void;
}

/**
 * 어드민 목록 페이지 공통의 "검색어 디바운스 + 페이지네이션 상태" 머신.
 *
 * inquiries / stores 가 동일하게 반복하던 로직을 추출했다. 응답 envelope
 * (flat `total` vs `pagination.total`) 차이는 호출부 훅이 흡수하므로 여기엔
 * total/totalPages 를 두지 않는다.
 */
export function usePaginatedSearch(
  options: UsePaginatedSearchOptions = {},
): UsePaginatedSearchResult {
  const { debounceMs = 300, resetPageDeps = [] } = options;

  const [searchInput, setSearchInput] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');
  const [page, setPage] = useState(1);

  // 입력마다 BE 를 호출하지 않도록 디바운스한다.
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQ(searchInput.trim()), debounceMs);
    return () => clearTimeout(id);
  }, [searchInput, debounceMs]);

  // 검색어 / 외부 필터가 바뀌면 항상 첫 페이지로.
  useEffect(() => {
    setPage(1);
    // resetPageDeps 는 호출부에서 길이가 고정되므로 spread 가 안전하다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ, ...resetPageDeps]);

  return {
    searchInput,
    setSearchInput,
    debouncedQ,
    page,
    setPage,
    resetPage: () => setPage(1),
  };
}
