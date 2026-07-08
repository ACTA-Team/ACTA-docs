import type { NavigationItems } from "@/@types/docs";

export const navigation: NavigationItems = {
  welcome: [
    { slug: "introduction", title: "Introducción" },
    { slug: "architecture", title: "Arquitectura" },
    { slug: "getting-started", title: "Primeros Pasos" },
    {
      slug: "links",
      title: "Enlaces",
      externalUrl: "https://links.acta.build",
    },
  ],
  sdk: [
    { slug: "sdk-overview", title: "Resumen" },
    { slug: "useCredential", title: "useCredential" },
    { slug: "useVault", title: "useVault" },
    { slug: "useVaultRead", title: "useVaultRead" },
    { slug: "sponsoredVault", title: "sponsoredVault" },
  ],
  "api-reference": [
    { slug: "api-overview", title: "Resumen" },
    { slug: "api-health-status", title: "Salud y estado" },
    { slug: "api-keys", title: "API Keys" },
    { slug: "api-contract-info", title: "Información del Contrato" },
    { slug: "api-vault-read", title: "Operaciones de Bóveda (Lectura)" },
    { slug: "api-vault-write", title: "Operaciones de Bóveda (Escritura)" },
    { slug: "api-sponsored-vault", title: "Bóveda patrocinada" },
    { slug: "api-credentials", title: "Operaciones de Credenciales" },
  ],
  contracts: [{ slug: "contract-errors", title: "Errores de contrato" }],
  did: [
    { slug: "did-overview", title: "Resumen" },
    { slug: "did-registry", title: "Registro y Resolver" },
    { slug: "did-library", title: "Librería TypeScript" },
  ],
  ia: [{ slug: "mcp", title: "MCP" }],
  dapp: [
    { slug: "dapp-overview", title: "Resumen" },
    { slug: "dapp-getting-started", title: "Primeros Pasos" },
    { slug: "dapp-features", title: "Funcionalidades" },
  ],
  help: [
    { slug: "faq", title: "Preguntas Frecuentes" },
    { slug: "support", title: "Soporte" },
  ],
};
