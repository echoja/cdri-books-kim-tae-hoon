import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import type { AsyncStorage } from "@tanstack/query-persist-client-core";
import { appDb } from "@/db/app-db";

const QUERY_CACHE_KEY = "cdri:react-query-cache";

const asyncStorage: AsyncStorage<string> = {
  getItem: async (key) => {
    const item = await appDb.kv.get(key);
    return item?.value ?? null;
  },
  setItem: async (key, value) => {
    await appDb.kv.put({
      key,
      value,
      updatedAt: new Date().toISOString(),
    });
  },
  removeItem: async (key) => {
    await appDb.kv.delete(key);
  },
};

export function createQueryPersister() {
  if (typeof window === "undefined") {
    return createAsyncStoragePersister({ storage: undefined });
  }

  return createAsyncStoragePersister({
    storage: asyncStorage,
    key: QUERY_CACHE_KEY,
    throttleTime: 1_000,
  });
}
