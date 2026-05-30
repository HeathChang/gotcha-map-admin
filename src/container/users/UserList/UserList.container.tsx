'use client';

import { Heading, Input, Modal, Select, Stack, Text } from 'null_ong2-design-system';
import { UserTable } from '@/ui/users/UserTable/UserTable.ui';
import { UserStatusForm } from '@/ui/users/UserStatusForm/UserStatusForm.ui';
import { ListStateView } from '@/ui/common/ListStateView/ListStateView.ui';
import { Pagination } from '@/ui/common/Pagination/Pagination.ui';
import { useUserList, type UserStatusFilter } from './useUserList';

const STATUS_FILTER_OPTIONS: ReadonlyArray<{ value: UserStatusFilter; label: string }> = [
  { value: 'all', label: '전체 상태' },
  { value: '1', label: '활성' },
  { value: '0', label: '비활성' },
  { value: '-1', label: '탈퇴' },
];

export function UserListContainer() {
  const {
    users,
    isLoading,
    errorMessage,
    searchInput,
    setSearchInput,
    statusFilter,
    setStatusFilter,
    page,
    pageSize,
    total,
    setPage,
    selected,
    openStatusChange,
    closeStatusChange,
    submitStatus,
    isSubmitting,
  } = useUserList();

  return (
    <Stack spacing="lg">
      <Stack spacing="2">
        <Heading as="h1" size="lg">
          회원 관리
        </Heading>
        <Text size="sm" color="muted">
          회원 목록을 조회하고 상태(활성/비활성/탈퇴)를 변경합니다. 이메일은 super_admin 만 풀 노출되며, 그 외 운영자는 자동 마스킹됩니다.
        </Text>
      </Stack>

      <div className="flex items-end gap-3">
        <div className="max-w-md flex-1">
          <Input
            placeholder="이메일 또는 닉네임으로 검색"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <div className="w-40">
          <Select
            options={STATUS_FILTER_OPTIONS as Array<{ value: string; label: string }>}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as UserStatusFilter)}
          />
        </div>
      </div>

      <ListStateView
        isLoading={isLoading}
        errorMessage={errorMessage}
        errorTitle="회원 목록을 불러오지 못했습니다"
      >
        <UserTable
          users={users}
          onChangeStatus={openStatusChange}
          selectedUserId={selected?.userId ?? null}
        />

        <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
      </ListStateView>

      <Modal
        isOpen={selected !== null}
        onClose={closeStatusChange}
        title="회원 상태 변경"
        size="md"
      >
        {selected ? (
          <UserStatusForm
            user={selected}
            onSubmit={submitStatus}
            onCancel={closeStatusChange}
            isSubmitting={isSubmitting}
          />
        ) : null}
      </Modal>
    </Stack>
  );
}
