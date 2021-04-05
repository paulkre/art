import vue from "@vitejs/plugin-vue";
import fonts from "vite-plugin-fonts";
import path from "path";

/**
 * @type {import('vite').UserConfig}
 */
export default {
  resolve: {
    alias: {
      vue: "vue/dist/vue.esm-browser.js",
    },
  },
  plugins: [
    vue(),
    fonts({
      google: {
        families: [
          { name: "Nunito Sans", weights: "wght@0,400;0,700;1,400;1,700" },
        ],
      },
    }),
  ],
  build: {
    sourcemap: false,
    minify: "esbuild",
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, "src/lib.js"),
      formats: ["es"],
      name: "art",
    },
  },
};
