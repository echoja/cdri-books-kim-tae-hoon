import { createFileRoute } from "@tanstack/react-router";
import { fallback, zodSearchValidator } from "@tanstack/router-zod-adapter";
import { z } from "zod";
import { SearchPage } from "@/pages/search-page";

const searchSchema = z.object({
  query: fallback(z.string(), ""),
  page: fallback(z.coerce.number().int().positive(), 1),
  target: fallback(z.enum(["title", "person", "publisher"]), "title"),
});

export const Route = createFileRoute("/search")({
  validateSearch: zodSearchValidator(searchSchema),
  component: SearchPage,
});
