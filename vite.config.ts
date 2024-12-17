import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    dts({
      tsconfigPath: "./tsconfig.json", // Ensure this points to your tsconfig.json
      outDir: "./dist", // Output directory for declaration files
      entryRoot: "./src", // Base directory for entry files
      insertTypesEntry: true, // Generate types entry in package.json
      rollupTypes: true, // Bundle type declarations into a single file
    }),
  ],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "promotion_builder",
      fileName: (format) => `promotion_builder.${format}.js`,
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: [], // Specify external dependencies if any
    },
  },
});
