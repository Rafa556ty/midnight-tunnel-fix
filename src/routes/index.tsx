import { createFileRoute } from "@tanstack/react-router";

import { component as Game } from "@/game/legacy/routes.js";

const title = "Supercar Highway Dash — Jogo de Corrida";
const description =
  "Pilote supercarros pela cidade, rodovia, túnel e ponte. Acelere, desvie do trânsito e personalize seu carro.";

export const Route = createFileRoute("/")({
  // The game touches window/WebGL as soon as it mounts, so it renders only in the browser.
  ssr: false,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Game,
});
