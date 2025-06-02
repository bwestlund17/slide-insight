export interface Company {
  id: string;
  name: string;
  symbol: string;
  website: string;
  ir_url: string;
  industry: string;
  sector: string;
  market_cap: number;
  sub_industry?: string;
  founded_year?: number;
  employee_count?: number;
  headquarters?: string;
  cik?: string;
  fiscal_year_end?: string;
  created_at?: string;
}

export interface Presentation {
  id: string;
  company_id: string;
  company_symbol: string;
  title: string;
  date: string;
  url: string;
  file_type?: string;
  file_size?: string;
  slide_count?: number;
  view_count?: number;
  created_at?: string;
  summary?: string;
  thumbnail_url?: string;
  companies?: Company;
}

export interface ScrapingJob {
  id: string;
  company_id: string;
  status: 'pending' | 'in_progress' | 'success' | 'failed';
  started_at?: string;
  completed_at?: string;
  error?: string;
  presentations_found?: number;
  next_scheduled?: string;
  created_at?: string;
}

export interface PresentationTag {
  presentation_id: string;
  tag: string;
}

export interface Industry {
  id: string;
  name: string;
  count: number;
}

export interface Tag {
  id: string;
  name: string;
  count: number;
}

export interface MaDeck {
  id: string;
  title: string;
  category: string;
  subcategory?: string;
  description: string;
  thumbnailUrl: string;
  slideCount: number;
  downloadCount: number;
  rating: number;
  ratingCount: number;
  format: string[];
  fileSize: string;
  createdAt: string;
  updatedAt: string;
  isNew: boolean;
  isPremium: boolean;
  isFeatured: boolean;
  isPopular: boolean;
  isFavorite: boolean;
  slides: MaSlide[];
  tags: string[];
  company?: {
    name: string;
    logo: string;
  };
  dealValue?: string;
  dealDate?: string;
  dealType?: string;
}

export interface MaSlide {
  id: string;
  deckId: string;
  slideNumber: number;
  imageUrl: string;
  title?: string;
  description?: string;
}

export type SortOption = 'popular' | 'recent' | 'rating' | 'title' | 'slides';
export type ViewMode = 'grid' | 'list';
export type CategoryFilter = string | null;
export type DealTypeFilter = string | null;