import type {
  AdminProductDetail,
  AdminProductListItem,
} from '@/types/product.types';

// 제품 CRUD UX 확인용 mock. detail 은 동일 productId 에서 갤러리/태그를 더 들고 있다.

export const MOCK_PRODUCT_LIST: AdminProductListItem[] = [
  {
    productId: 'prod-001',
    productName: '치이카와 키링 컬렉션 1탄',
    productManufacturer: '반다이 코리아',
    productInfo: '치이카와 인기 캐릭터 6종 랜덤 키링',
    category: '키링',
    minPrice: 5000,
    maxPrice: 5000,
    imageUrl: 'https://placehold.co/200x200?text=Chiikawa',
    viewCount: 3421,
    isNew: false,
    isPopular: true,
    genderTarget: 'ALL',
    tagCount: 2,
    imageCount: 3,
    createdAt: '2026-02-10T03:00:00.000Z',
    updatedAt: '2026-05-01T01:00:00.000Z',
  },
  {
    productId: 'prod-002',
    productName: '산리오 캐릭터즈 미니피규어 시즌3',
    productManufacturer: '산리오 정품',
    productInfo: '쿠로미·시나모롤·마이멜로디 등 12종 랜덤',
    category: '피규어',
    minPrice: 6000,
    maxPrice: 7000,
    imageUrl: 'https://placehold.co/200x200?text=Sanrio',
    viewCount: 5210,
    isNew: true,
    isPopular: true,
    genderTarget: 'F',
    tagCount: 2,
    imageCount: 2,
    createdAt: '2026-05-15T07:00:00.000Z',
    updatedAt: '2026-05-15T07:00:00.000Z',
  },
  {
    productId: 'prod-003',
    productName: '포켓몬 메탈 코인 시즌2',
    productManufacturer: '포켓몬코리아',
    productInfo: '레어 5종 포함 총 30종 랜덤 메탈 코인',
    category: '굿즈',
    minPrice: 3000,
    maxPrice: 3000,
    imageUrl: null,
    viewCount: 980,
    isNew: false,
    isPopular: false,
    genderTarget: 'M',
    tagCount: 1,
    imageCount: 0,
    createdAt: '2026-03-22T05:30:00.000Z',
    updatedAt: '2026-04-10T01:00:00.000Z',
  },
];

// detail 은 list 의 동일 productId 항목에 images[] / tags[] 가 추가된 형태.
const DETAIL_EXTRAS: Record<
  string,
  Pick<AdminProductDetail, 'images' | 'tags'>
> = {
  'prod-001': {
    images: [
      'https://placehold.co/400x400?text=Chiikawa+1',
      'https://placehold.co/400x400?text=Chiikawa+2',
      'https://placehold.co/400x400?text=Chiikawa+3',
    ],
    tags: [
      { tagId: 'tag-002', name: '치이카와', relationType: 'character' },
      { tagId: 'tag-005', name: '키링', relationType: 'category' },
    ],
  },
  'prod-002': {
    images: [
      'https://placehold.co/400x400?text=Sanrio+1',
      'https://placehold.co/400x400?text=Sanrio+2',
    ],
    tags: [
      { tagId: 'tag-001', name: '산리오', relationType: 'character' },
      { tagId: 'tag-004', name: '피규어', relationType: 'category' },
    ],
  },
  'prod-003': {
    images: [],
    tags: [{ tagId: 'tag-003', name: '포켓몬', relationType: 'character' }],
  },
};

export function buildMockProductDetail(
  item: AdminProductListItem,
): AdminProductDetail {
  const extras = DETAIL_EXTRAS[item.productId] ?? { images: [], tags: [] };
  return { ...item, ...extras };
}
