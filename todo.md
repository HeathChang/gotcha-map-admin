# GachaMap Admin — Todo

> Single Source of Truth: [.ruler/vision.md](.ruler/vision.md)
> 최종 갱신: 2026-05-30 — admin v1 화면 7종 전부 구현 완료 (login + inquiries + stores + tags + announcements + audit-logs + users + products)

---

## 완료된 작업

### 인프라 / 셋업
- [x] vision.md 작성 (운영자/콘텐츠/CS 3역할, v1 In Scope, Out of Scope, 기술 제약)
- [x] Next.js 14 App Router + TypeScript strict 스캐폴딩
- [x] `null_ong2-design-system` + Tailwind 통합
- [x] 폴더 구조 — `app/`, `src/{api,container,ui,types,lib}` 가챠맵 컨벤션(`*.ui.tsx`, `*.container.tsx`, `use*.ts`)
- [x] TanStack Query + axios + react-hook-form + zod + dayjs 설치
- [x] axios 인터셉터 — Bearer 자동 부착, `{data}` envelope 자동 unwrap, error → `AdminApiError`
- [x] SessionProvider + sessionStorage 기반 세션 관리
- [x] 어드민 셸 — 헤더(역할 배지/이메일/로그아웃) + 사이드 내비(역할별 노출 필터)
- [x] 인증 가드 레이아웃 — 미로그인 시 `/login?from=` 리다이렉트
- [x] FE 단위 검증: `yarn typecheck`, `yarn lint` 통과
- [x] FE/BE/DB 로컬 환경 셋업 (MariaDB 12.2 설치, `gachamap` DB+user, env 정비)
- [x] 마이그레이션 0001~0005 실행, super_admin 시드 (`ops@gachamap.io`)
- [x] DBeaver 연결 정보 정리

### 화면 (Worked Example)
- [x] **로그인** — `/login`
  - LoginForm.ui.tsx (Presentational, react-hook-form + zod)
  - useLogin.ts + Login.container.tsx (TanStack Mutation)
- [x] **문의 관리** — `/inquiries`
  - InquiryTable / InquiryStatusBadge / InquiryAnswerForm (Presentational)
  - useInquiryList + InquiryList.container (Query + Mutation, 모달, 상태 필터)
- [x] **매장 관리** — `/stores` (목록·검색·CRUD, StoreForm/StoreTable)
- [x] **태그 관리** — `/tags` (목록·검색·relationType 필터·CRUD, TagForm/TagTable)
- [x] **공지 관리** — `/announcements` (CRUD + 인라인 isActive Switch 토글 + 활성 필터)
- [x] **감사 로그** — `/audit-logs` (읽기 전용, targetType/action 필터, diff JSON 모달, super_admin)
- [x] **회원 관리** — `/users` (목록·검색·상태 필터·상태 변경 모달, BE에서 PII 자동 마스킹: super_admin 만 풀 노출)
- [x] **제품 관리** — `/products` (CRUD, 갤러리 이미지 URL 다중 입력, 태그 chip multi-select, 노출 플래그 + 성별 타겟, 상세 페치 분리)
- [x] 공통 컴포넌트 추출 — `useCrudModal`·`usePaginatedSearch`·`Pagination`·`ListStateView`

### 백엔드 (어드민 영역만)
- [x] 마이그레이션 `0004_admin.sql` — `admin_users`, `admin_audit_logs`, `inquiries.answered_by_admin_id`
- [x] 마이그레이션 `0005_admin_refresh_tokens.sql` — admin 전용 refresh 테이블 (FK 충돌 해결)
- [x] JWT payload 확장 — `kind: 'user'|'admin'`, `role`, `AdminAuthRequest`, `AdminUserRow`
- [x] `adminAuth.middleware.ts` — `kind === 'admin'` 강제 + `requireAdminRole(...)`
- [x] `defineRoute` 옵션 확장 — `adminAuth?: boolean`, `adminRoles?: AdminRole[]`
- [x] `adminTokens.service.ts` — `issueAdminTokens` / `rotateAdminRefresh` / `revokeAdminRefresh` (1회용 + family rotation + 재사용 감지)
- [x] `admin.service.ts` — `loginAdmin`, `getAdminProfile`, `writeAuditLog` (vision §3 mutation 100% 기록 충족)
- [x] `adminInquiry.service.ts` — `listAdminInquiries` (페이지네이션 + 상태 필터 + JOIN users), `answerAdminInquiry` (트랜잭션 + 자동 감사 로그)
- [x] 라우트: `POST /admin/login`, `POST /admin/logout`, `GET /admin/me`, `POST /admin/refresh`, `GET /admin/inquiries(+/stats)`, `PATCH /admin/inquiries/:id`
- [x] **매장 라우트** — `GET/POST /admin/stores`, `PATCH/DELETE /admin/stores/:storeId` (store.service 재사용)
- [x] **태그 라우트** — `GET/POST /admin/tags`, `PATCH/DELETE /admin/tags/:tagId` (`adminTag.service`, 감사 로그 기록)
- [x] **공지 라우트** — `GET/POST /admin/announcements`, `PATCH/DELETE /admin/announcements/:announceId` (`adminAnnouncement.service`, isActive 토글, 감사 로그 기록)
- [x] **감사 로그 라우트** — `GET /admin/audit-logs` (`adminAuditLog.service`, admin_users JOIN, super_admin 전용, 읽기 전용)
- [x] **회원 라우트** — `GET /admin/users`, `PATCH /admin/users/:userId/status` (`adminUser.service`, super_admin 외엔 이메일 마스킹, 상태 변경 감사 기록)
- [x] **제품 라우트** — `GET/POST /admin/products`, `GET/PATCH/DELETE /admin/products/:productId` (`adminProduct.service`, 트랜잭션 + 이미지/태그 동시 갱신, FK CASCADE)
- [x] **매장 감사 로그 보강** — `store.create/update/delete` 도 `writeAuditLog` 기록 (vision §3 mutation 100% 충족)
- [x] 시드 스크립트 — `npm run db:seed:admin -- --email=... --password=... --role=...`
- [x] 백엔드 테스트 — 전체 82 passed, `npm run build`(postman 55 routes + tsc) 통과
- [x] **E2E curl 검증** — login → me → inquiries list → PATCH answer → audit_log row 자동 생성 + CORS preflight 모두 통과

---

## 진행 중

- [ ] **브라우저-측 인터랙티브 검증** (현재까지 curl + SSR HTML 응답만 확인)
  - 실제 브라우저 로그인 폼 → /inquiries → 모달 → 답변 저장 흐름 클릭 검증
  - 실패 시 토스트, 로그아웃 동작, 새 탭에서 세션 유지 등

---

## 다음 단계 (v1 In Scope, vision §4)

> 화면 7종 모두 완료. 남은 항목은 검증·테스트·운영 보조뿐.

### v1 잔여
- [ ] **브라우저 인터랙티브 검증** — 실 브라우저에서 8개 화면(login + 7 nav) 클릭 동선 검증 (현재 typecheck/lint/build·E2E curl 까지만)
- [ ] **어드민 controller/service 통합 테스트** — 현재 schema(`admin.schema.test.ts`) + middleware(`adminAuth.middleware.test.ts`)만. controller/service 레벨 테스트 부재
- [ ] **제품-스토어 가격 매핑 편집 UX** — 현재 BE에 `store_products` 스키마는 있으나 어드민 편집 화면 없음. 제품 상세에서 매장별 가격 추가/수정 (별도 패널 또는 페이지)

### 인증 보강 — 완료
- [x] FE refresh token 흐름 (401 → /admin/refresh → 재시도, 1073abf)
- [x] BE `POST /admin/refresh` 라우트 (249f814)
- [x] 30분 무활동 자동 로그아웃 (SessionProvider idle 타이머 + 활동 이벤트 리스너 + 1분 검사)

### 운영 편의 — 완료
- [x] 목록 페이지 공통 컴포넌트 추출 (`useCrudModal`·`usePaginatedSearch`·`Pagination`·`ListStateView`)
- [x] 페이지네이션 UI (Pagination 컴포넌트, 이전/다음 + 범위 표시)
- [ ] DBeaver/터미널에서 자주 보는 쿼리 모음 — `docs/db-recipes.md` (운영 부담 감소용, 우선순위 낮음)

---

## v2 / 백로그 (vision §4 v2)

- [ ] 분석 대시보드 — DAU, 인기 제품/스토어, 검색어 트렌드
- [ ] 공지 예약 발행
- [ ] CSV 일괄 import/export
- [ ] 슬랙/이메일 알림 연동

---

## Open Questions (vision §9)

- [ ] 운영자 SSO 사용 여부 (Google Workspace) vs. 자체 ID/PW
- [ ] 감사 로그 보존 기간 (3개월 / 1년 / 무기한)
- [ ] 이미지 호스팅 — 백엔드 `/uploads` 로컬 vs. S3/CDN 마이그레이션 시점 (현재 제품 어드민은 URL 입력만 지원)
- [x] 운영자 권한별 PII 접근 정책 — **v1 디폴트 결정**: super_admin 만 이메일 풀 노출, 그 외(support_staff)는 자동 마스킹

---

## 로컬 실행 메모

```bash
# DB 기동 (영구 등록됨, 재부팅 시 자동 시작)
brew services start mariadb

# 마이그레이션 + 시드 (최초 1회 또는 새 마이그레이션 추가 시)
cd /Users/null_ong2/Documents/heath/programming/projects/gachamap-be
npm run db:migrate
npm run db:seed:admin -- --email=ops@gachamap.io --password=admin1234 --name=운영자 --role=super_admin

# BE / FE dev 서버
npm run dev          # gachamap-be → http://localhost:8060
yarn dev             # gachamap-admin → http://localhost:3000

# 어드민 로그인
# Email: ops@gachamap.io
# Password: admin1234
```

**DBeaver 접속**: localhost:3306, db=`gachamap`, user=`gachamap`, pw=`gachamap_local`
