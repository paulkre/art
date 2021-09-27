import path from "path";

import appCfg from "./vite.config.app";

/**
 * @type {import('vite').UserConfig}
 */
export default {
  ...appCfg,
  build: {
    sourcemap: true,
    minify: "esbuild",
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, "src/lib.js"),
      formats: ["es"],
      name: "art",
    },
  },
};
