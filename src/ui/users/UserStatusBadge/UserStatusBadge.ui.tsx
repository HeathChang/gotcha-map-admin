import { Badge } from 'null_ong2-design-system';
import type { UserStatusBadgeProps } from './UserStatusBadge.types';
import {
  USER_STATUS_LABEL_MAP,
  USER_STATUS_VARIANT_MAP,
} from './userStatusBadge.constants';

export function UserStatusBadge({ status }: UserStatusBadgeProps) {
  return (
    <Badge variant={USER_STATUS_VARIANT_MAP[status]} size="sm">
      {USER_STATUS_LABEL_MAP[status]}
    </Badge>
  );
}
