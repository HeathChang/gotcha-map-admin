'use client';

import { Button, Heading, Input, Modal, Select, Stack, Text } from 'null_ong2-design-system';
import { AdminUserTable } from '@/ui/admins/AdminUserTable/AdminUserTable.ui';
import { AdminUserForm } from '@/ui/admins/AdminUserForm/AdminUserForm.ui';
import { PasswordResetForm } from '@/ui/admins/PasswordResetForm/PasswordResetForm.ui';
import { ListStateView } from '@/ui/common/ListStateView/ListStateView.ui';
import { Pagination } from '@/ui/common/Pagination/Pagination.ui';
import { useAdminUserList, type AdminRoleFilter } from './useAdminUserList';

const ROLE_FILTER_OPTIONS: ReadonlyArray<{ value: AdminRoleFilter; label: string }> = [
  { value: 'all', label: '전체 역할' },
  { value: 'admin', label: '관리자' },
  { value: 'staff', label: '운영' },
  { value: 'member', label: '점주' },
];

export function AdminUserListContainer() {
  const {
    admins,
    isLoading,
    errorMessage,
    searchInput,
    setSearchInput,
    roleFilter,
    setRoleFilter,
    page,
    pageSize,
    total,
    setPage,
    isCreateOpen,
    openCreate,
    closeCreate,
    storeOptions,
    storeOptionsLoading,
    submitCreate,
    isCreating,
    toggleStatus,
    pendingStatusId,
    passwordTarget,
    openPasswordReset,
    closePasswordReset,
    submitPasswordReset,
    isResettingPassword,
  } = useAdminUserList();

  return (
    <Stack spacing="lg">
      <Stack spacing="2">
        <Heading as="h1" size="lg">
          운영자 관리
        </Heading>
        <Text size="sm" color="muted">
          운영자(admin/staff) 및 매장 점주(member) 계정을 생성하고 활성/비활성·비밀번호를 관리합니다.
        </Text>
      </Stack>

      <div className="flex items-end justify-between gap-3">
        <div className="flex flex-1 items-end gap-3">
          <div className="max-w-md flex-1">
            <Input
              placeholder="이메일 또는 이름으로 검색"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <div className="w-40">
            <Select
              options={ROLE_FILTER_OPTIONS as Array<{ value: string; label: string }>}
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as AdminRoleFilter)}
            />
          </div>
        </div>
        <Button variant="primary" onClick={openCreate}>
          + 신규 운영자
        </Button>
      </div>

      <ListStateView
        isLoading={isLoading}
        errorMessage={errorMessage}
        errorTitle="운영자 목록을 불러오지 못했습니다"
      >
        <AdminUserTable
          admins={admins}
          onToggleStatus={toggleStatus}
          onResetPassword={openPasswordReset}
          pendingStatusId={pendingStatusId}
        />

        <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
      </ListStateView>

      <Modal isOpen={isCreateOpen} onClose={closeCreate} title="신규 운영자 생성" size="md">
        {isCreateOpen ? (
          <AdminUserForm
            storeOptions={storeOptions}
            storeOptionsLoading={storeOptionsLoading}
            onSubmit={submitCreate}
            onCancel={closeCreate}
            isSubmitting={isCreating}
          />
        ) : null}
      </Modal>

      <Modal
        isOpen={passwordTarget !== null}
        onClose={closePasswordReset}
        title="비밀번호 재설정"
        size="sm"
      >
        {passwordTarget ? (
          <PasswordResetForm
            targetLabel={passwordTarget.email}
            onSubmit={submitPasswordReset}
            onCancel={closePasswordReset}
            isSubmitting={isResettingPassword}
          />
        ) : null}
      </Modal>
    </Stack>
  );
}
