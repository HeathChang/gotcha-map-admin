import { Alert, Heading, Stack, Text } from 'null_ong2-design-system';
import type { PlaceholderPageProps } from './PlaceholderPage.types';

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <Stack spacing="lg">
      <Stack spacing="2">
        <Heading as="h1" size="lg">
          {title}
        </Heading>
        <Text size="sm" color="muted">
          {description}
        </Text>
      </Stack>
      <Alert variant="info" title="아직 구현되지 않았습니다">
        이 화면은 vision.md §4 v1 In Scope에 포함되어 있으며 다음 sub-goal에서
        Inquiries와 동일한 패턴으로 구현됩니다.
      </Alert>
    </Stack>
  );
}
