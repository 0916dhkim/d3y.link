import { redirect } from "react-router";
import type { Route } from "./+types/$slug";

export async function loader({ params }: Route.LoaderArgs) {
  return redirect(`/api/links/${params.slug}`);
}
