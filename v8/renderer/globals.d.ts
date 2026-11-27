export {};

declare global {
  interface Window {
    __oeRouter?: unknown;
    __oeCatalogueReplay?: () => void;
    __oeSel?: Range;
  }
}

declare module '/v8/templates/registry.js' {
  export const DEFAULT_TEMPLATE_ID: string;
}
