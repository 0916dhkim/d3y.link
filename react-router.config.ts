import type { Config } from "@react-router/dev/config";

export default {
  appDirectory: "src",
  ssr: true, // Server-side render by default, to enable SPA mode set this to `false`
} satisfies Config;
