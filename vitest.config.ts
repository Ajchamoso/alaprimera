import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

// Los tests son de lógica y datos puros (lib/ y el catálogo): no necesitan
// navegador. El alias "@" reproduce el de tsconfig para que los imports coincidan
// con el código de producción.
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
      "server-only": fileURLToPath(new URL("tests/stubs/server-only.ts", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.{ts,tsx}"],
  },
});
