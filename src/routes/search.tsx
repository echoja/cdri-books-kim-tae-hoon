import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { SearchPage } from "@/features/search/search-page";

const searchSchema = z.object({
  query: z.string().catch(""),
  page: z.coerce.number().int().positive().catch(1),
  target: z.enum(["title", "person", "publisher"]).catch("title"),
});

export const Route = createFileRoute("/search")({
  validateSearch: (search) => searchSchema.parse(search),
  component: SearchPage,
});
