import type { AdminAnnouncement } from '@/types/announcement.types';

export interface AnnouncementTableProps {
  announcements: ReadonlyArray<AdminAnnouncement>;
  onEdit: (announcement: AdminAnnouncement) => void;
  onDelete: (announcement: AdminAnnouncement) => void;
  // 인라인 활성 토글. 표에서 바로 노출 on/off 한다.
  onToggleActive: (announcement: AdminAnnouncement) => void;
  selectedAnnounceId: string | null;
  // 토글 진행 중인 공지 ID — 중복 클릭 방지용.
  togglingId: string | null;
}
