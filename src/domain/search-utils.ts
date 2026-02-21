import type { SearchHistoryRecord, SearchTarget } from "./types";

const SEARCH_HISTORY_LIMIT = 8;

export const SEARCH_TARGET_OPTIONS: Array<{ label: string; value: SearchTarget }> = [
  { label: "제목", value: "title" },
  { label: "저자명", value: "person" },
  { label: "출판사", value: "publisher" },
];

export function createSearchHistoryKey(keyword: string, target?: SearchTarget): string {
  return `${target ?? "title"}:${keyword.trim().toLowerCase()}`;
}

export function upsertSearchHistory(
  records: SearchHistoryRecord[],
  keyword: string,
  target?: SearchTarget,
): SearchHistoryRecord[] {
  const normalized = keyword.trim();

  if (!normalized) {
    return records;
  }

  const key = createSearchHistoryKey(normalized, target);
  const next: SearchHistoryRecord = {
    key,
    keyword: normalized,
    target,
    searchedAt: new Date().toISOString(),
  };

  return [next, ...records.filter((record) => record.key !== key)].slice(0, SEARCH_HISTORY_LIMIT);
}

export function toSearchTarget(value: string | undefined): SearchTarget {
  if (value === "person" || value === "publisher") {
    return value;
  }

  return "title";
}

export function getSearchHistoryLimit(): number {
  return SEARCH_HISTORY_LIMIT;
}
