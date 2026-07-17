/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unused-vars */
// vitest-axe augmenta el namespace legacy `Vi`; Vitest 4 tipa los matchers en el
// módulo "vitest". Reexponemos el matcher ahí para que `tsc` lo reconozca.
import type { AxeMatchers } from "vitest-axe/matchers";

declare module "vitest" {
  interface Assertion<T = any> extends AxeMatchers {}
  interface AsymmetricMatchersContaining extends AxeMatchers {}
}
