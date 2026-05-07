import { Badge } from 'null_ong2-design-system';
import type { InquiryStatusBadgeProps } from './InquiryStatusBadge.types';
import {
  INQUIRY_STATUS_LABEL_MAP,
  INQUIRY_STATUS_VARIANT_MAP,
} from './inquiryStatusBadge.constants';

export function InquiryStatusBadge({ status }: InquiryStatusBadgeProps) {
  return (
    <Badge variant={INQUIRY_STATUS_VARIANT_MAP[status]} size="sm">
      {INQUIRY_STATUS_LABEL_MAP[status]}
    </Badge>
  );
}
