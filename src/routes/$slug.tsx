import type { Route } from "./+types/$slug";

export async function serverLoader({ params }: Route.LoaderArgs) {
  throw new Error("Not implemented");
}
