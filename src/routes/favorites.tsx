import { createFileRoute } from "@tanstack/react-router";
import { FavoritesPage } from "@/pages/favorites-page";

export const Route = createFileRoute("/favorites")({
  component: FavoritesPage,
});
