import { MaDeck } from '../types';

// Mock categories for demonstration
const MOCK_CATEGORIES = [
  { id: 'acquisition', name: 'Acquisition', count: 45 },
  { id: 'merger', name: 'Merger', count: 32 },
  { id: 'joint-venture', name: 'Joint Venture', count: 18 },
  { id: 'private-equity', name: 'Private Equity', count: 27 },
  { id: 'divestiture', name: 'Divestiture', count: 15 },
  { id: 'hostile-takeover', name: 'Hostile Takeover', count: 8 },
  { id: 'leveraged-buyout', name: 'Leveraged Buyout', count: 12 },
];

const MOCK_DEAL_TYPES = [
  { id: 'horizontal', name: 'Horizontal', count: 35 },
  { id: 'vertical', name: 'Vertical', count: 28 },
  { id: 'conglomerate', name: 'Conglomerate', count: 19 },
  { id: 'strategic', name: 'Strategic', count: 42 },
  { id: 'financial', name: 'Financial', count: 31 },
];

// Generate mock decks for demonstration
export const generateMockDecks = (count: number): MaDeck[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `deck-${i + 1}`,
    title: `${['Strategic', 'Cross-Border', 'Innovative', 'Transformative'][i % 4]} ${MOCK_CATEGORIES[i % MOCK_CATEGORIES.length].name} Presentation`,
    category: MOCK_CATEGORIES[i % MOCK_CATEGORIES.length].name,
    subcategory: i % 3 === 0 ? 'Industry Focus' : undefined,
    description: `Comprehensive M&A deck focusing on ${MOCK_CATEGORIES[i % MOCK_CATEGORIES.length].name.toLowerCase()} strategies and integration planning.`,
    thumbnailUrl: `https://picsum.photos/seed/${i + 100}/800/600`,
    slideCount: 20 + (i % 20),
    downloadCount: 100 + (i * 43) % 2000,
    rating: 3.5 + (i % 5) * 0.3,
    ratingCount: 10 + (i * 7) % 100,
    format: i % 3 === 0 ? ['PDF', 'PowerPoint'] : ['PowerPoint'],
    fileSize: `${2 + (i % 8)}MB`,
    createdAt: new Date(Date.now() - (i * 86400000 * (i % 10))).toISOString(),
    updatedAt: new Date(Date.now() - (i * 43200000 * (i % 5))).toISOString(),
    isNew: i < 5,
    isPremium: i % 7 === 0,
    isFeatured: i % 11 === 0,
    isPopular: i % 5 === 0,
    isFavorite: i % 13 === 0,
    slides: Array.from({ length: 20 + (i % 20) }, (_, j) => ({
      id: `slide-${i}-${j}`,
      deckId: `deck-${i + 1}`,
      slideNumber: j + 1,
      imageUrl: `https://picsum.photos/seed/${i * 100 + j}/800/600`,
      title: j === 0 ? `${['Strategic', 'Cross-Border', 'Innovative', 'Transformative'][i % 4]} ${MOCK_CATEGORIES[i % MOCK_CATEGORIES.length].name}` : undefined,
      description: j === 0 ? `Slide ${j + 1} overview` : undefined,
    })),
    tags: [
      MOCK_CATEGORIES[i % MOCK_CATEGORIES.length].name,
      MOCK_DEAL_TYPES[i % MOCK_DEAL_TYPES.length].name,
      i % 2 === 0 ? 'Due Diligence' : 'Integration',
      i % 3 === 0 ? 'Synergies' : 'Valuation',
    ],
    company: i % 4 === 0 ? {
      name: `Company ${i % 10}`,
      logo: `https://picsum.photos/seed/${i * 200}/200/200`
    } : undefined,
    dealValue: i % 3 === 0 ? `$${(i * 100 + 500)}M` : undefined,
    dealDate: i % 5 === 0 ? new Date(Date.now() - (i * 86400000 * 30)).toISOString() : undefined,
    dealType: MOCK_DEAL_TYPES[i % MOCK_DEAL_TYPES.length].name,
  }));
};