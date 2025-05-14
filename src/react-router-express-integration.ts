import { createRequestHandler } from "@react-router/express";
import { ServerBuild } from "react-router";
import express, { type Express } from "express";
import { type ViteDevServer } from "vite";

export async function integrateReactRouter(app: Express) {
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction) {
    registerCompiledAssetMiddlewares(app);
    await registerProdSsrMiddleware(app);
  } else {
    const viteDevServer = await createViteDevServer();
    app.use(viteDevServer.middlewares);
    await registerDevSsrMiddleware(app, viteDevServer);
  }
}

function registerCompiledAssetMiddlewares(app: Express) {
  app.use(
    "/assets",
    express.static("build/client/assets", { immutable: true, maxAge: "1y" }),
  );
  app.use(express.static("build/client"));
}

async function registerProdSsrMiddleware(app: Express) {
  const COMPILED_SSR_HANDLER_PATH = "../build/server/index.js";
  app.use(
    createRequestHandler({ build: await import(COMPILED_SSR_HANDLER_PATH) }),
  );
}

async function registerDevSsrMiddleware(
  app: Express,
  viteDevServer: ViteDevServer,
) {
  app.use(
    createRequestHandler({
      build: () =>
        viteDevServer.ssrLoadModule(
          "virtual:react-router/server-build",
        ) as Promise<ServerBuild>,
    }),
  );
}

/**
 * Create a Vite dev server to serve the bundled client assets.
 */
async function createViteDevServer() {
  const vite = await import("vite");
  const server = await vite.createServer({
    server: { middlewareMode: true },
  });
  return server;
}
