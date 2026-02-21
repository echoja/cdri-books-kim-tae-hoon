import Dexie, { type Table } from "dexie";
import type {
  FavoriteRecord,
  SearchHistoryRecord,
  SearchParams,
  SearchResultPayload,
} from "@/domain/types";

export interface FavoriteEntity extends FavoriteRecord {}

export interface SearchHistoryEntity extends SearchHistoryRecord {}

export interface SearchCacheEntity {
  key: string;
  query: string;
  page: number;
  target?: SearchParams["target"];
  payload: SearchResultPayload;
  updatedAt: string;
}

export interface KeyValueEntity {
  key: string;
  value: string;
  updatedAt: string;
}

class AppDb extends Dexie {
  favorites!: Table<FavoriteEntity, string>;
  searchHistory!: Table<SearchHistoryEntity, string>;
  searchCache!: Table<SearchCacheEntity, string>;
  kv!: Table<KeyValueEntity, string>;

  constructor() {
    super("cdri-books-db");

    this.version(1).stores({
      favorites: "&isbn, likedAt, updatedAt",
      searchHistory: "&key, searchedAt",
      searchCache: "&key, updatedAt",
      kv: "&key, updatedAt",
    });
  }
}

export const appDb = new AppDb();
