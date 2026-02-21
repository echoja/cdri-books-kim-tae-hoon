export type SearchTarget = "title" | "person" | "publisher";

export interface Book {
  isbn: string;
  title: string;
  authors: string[];
  publisher: string;
  thumbnail: string;
  contents: string;
  price: number;
  salePrice?: number;
  url: string;
  datetime?: string;
}

export interface BookSearchParams {
  query: string;
  page: number;
  size: 10;
  target?: SearchTarget;
}

export interface SearchResult {
  books: Book[];
  totalCount: number;
  pageableCount: number;
  isEnd: boolean;
}

export type SyncStatus = "synced" | "pending";

export interface FavoriteRecord {
  isbn: string;
  book: Book;
  likedAt: string;
  updatedAt: string;
  syncStatus: SyncStatus;
}

export interface SearchHistoryRecord {
  key: string;
  keyword: string;
  target?: SearchTarget;
  searchedAt: string;
}

export interface SyncAdapter {
  pushFavorites(changes: FavoriteRecord[]): Promise<void>;
  pullFavorites(since?: string): Promise<FavoriteRecord[]>;
}
