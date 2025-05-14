import { createRequestHandler } from "@react-router/express";
import { ServerBuild } from "react-router";
import express, { type Express } from "express";

const COMPILED_SERVER_PATH = "../build/server/index.js";

async function createViteDevServer() {
  const vite = await import("vite");
  const server = await vite.createServer({
    server: { middlewareMode: true },
  });
  return server;
}

export async function integrateReactRouter(app: Express) {
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction) {
    // PROD
    app.use(
      "/assets",
      express.static("build/client/assets", { immutable: true, maxAge: "1y" })
    );
    app.use(express.static("build/client"));
    app.use(
      createRequestHandler({ build: await import(COMPILED_SERVER_PATH) })
    );
  } else {
    // DEV
    const viteDevServer = await createViteDevServer();
    app.use(viteDevServer.middlewares);
    app.use(
      createRequestHandler({
        build: () =>
          viteDevServer.ssrLoadModule(
            "virtual:react-router/server-build"
          ) as Promise<ServerBuild>,
      })
    );
  }
}
