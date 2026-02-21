import { appDb } from "@/db/app-db";
import type { Book, FavoriteRecord, SyncAdapter } from "@/lib/types";

export class FavoritesRepository {
  private readonly sync: SyncAdapter;

  constructor(sync: SyncAdapter) {
    this.sync = sync;
  }

  async list(): Promise<FavoriteRecord[]> {
    return appDb.favorites.orderBy("updatedAt").reverse().toArray();
  }

  async listIsbns(): Promise<string[]> {
    const favorites = await this.list();
    return favorites.map((record) => record.isbn);
  }

  async has(isbn: string): Promise<boolean> {
    const found = await appDb.favorites.get(isbn);
    return !!found;
  }

  async upsert(book: Book): Promise<void> {
    const now = new Date().toISOString();
    const existing = await appDb.favorites.get(book.isbn);

    await appDb.favorites.put({
      isbn: book.isbn,
      book,
      likedAt: existing?.likedAt ?? now,
      updatedAt: now,
      syncStatus: "pending",
    });

    await this.sync.pushFavorites(await this.list());
  }

  async remove(isbn: string): Promise<void> {
    await appDb.favorites.delete(isbn);
    await this.sync.pushFavorites(await this.list());
  }
}
