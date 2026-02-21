import Dexie, { type Table } from "dexie";
import type { FavoriteRecord, SearchHistoryRecord } from "@/lib/types";

interface FavoriteEntity extends FavoriteRecord {}

interface SearchHistoryEntity extends SearchHistoryRecord {}

interface KeyValueEntity {
  key: string;
  value: string;
  updatedAt: string;
}

class AppDb extends Dexie {
  favorites!: Table<FavoriteEntity, string>;
  searchHistory!: Table<SearchHistoryEntity, string>;
  kv!: Table<KeyValueEntity, string>;

  constructor() {
    super("cdri-books-db");

    this.version(1).stores({
      favorites: "&isbn, likedAt, updatedAt",
      searchHistory: "&key, searchedAt",
      kv: "&key, updatedAt",
    });
  }
}

export const appDb = new AppDb();
