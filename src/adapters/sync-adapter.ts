import type { FavoriteRecord, SyncAdapter } from "@/lib/types";

class NoopSyncAdapter implements SyncAdapter {
  async pushFavorites(_changes: FavoriteRecord[]): Promise<void> {
    return Promise.resolve();
  }

  async pullFavorites(_since?: string): Promise<FavoriteRecord[]> {
    return Promise.resolve([]);
  }
}

export const syncAdapter: SyncAdapter = new NoopSyncAdapter();
