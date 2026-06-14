import type { AdminBanner } from '@/types/banner.types';

export interface BannerTableProps {
  banners: ReadonlyArray<AdminBanner>;
  onEdit: (banner: AdminBanner) => void;
  onDelete: (banner: AdminBanner) => void;
  // 인라인 활성 토글. 표에서 바로 노출 on/off 한다.
  onToggleActive: (banner: AdminBanner) => void;
  selectedBannerId: string | null;
  // 토글 진행 중인 배너 ID — 중복 클릭 방지용.
  togglingId: string | null;
}
