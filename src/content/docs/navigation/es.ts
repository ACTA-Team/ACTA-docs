import type { NavigationItems } from "@/@types/docs";

export const navigation: NavigationItems = {
  welcome: [
    { slug: "introduction", title: "Introducción" },
    { slug: "architecture", title: "Arquitectura" },
    { slug: "getting-started", title: "Primeros Pasos" },
    { slug: "links", title: "Enlaces" },
  ],
  sdk: [
    { slug: "sdk-overview", title: "Resumen" },
    { slug: "useCredential", title: "useCredential" },
    { slug: "useVault", title: "useVault" },
    { slug: "useVaultRead", title: "useVaultRead" },
  ],
  "api-reference": [
    { slug: "api-overview", title: "Resumen" },
    { slug: "api-keys", title: "API Keys" },
    { slug: "api-contract-info", title: "Información del Contrato" },
    { slug: "api-vault-read", title: "Operaciones de Bóveda (Lectura)" },
    { slug: "api-vault-write", title: "Operaciones de Bóveda (Escritura)" },
    { slug: "api-credentials", title: "Operaciones de Credenciales" },
  ],
  dapp: [
    { slug: "dapp-overview", title: "Resumen" },
    { slug: "dapp-getting-started", title: "Primeros Pasos" },
    { slug: "dapp-features", title: "Funcionalidades" },
  ],
  "zk-proofs": [
    { slug: "zk-overview", title: "Resumen" },
    { slug: "zk-circuits", title: "Circuitos" },
    { slug: "zk-generation", title: "Generación de Pruebas" },
    { slug: "zk-verification", title: "Verificación de Pruebas" },
  ],
  scf: [{ slug: "scf-42", title: "SCF 42" }],
  help: [
    { slug: "faq", title: "Preguntas Frecuentes" },
    { slug: "support", title: "Soporte" },
  ],
};
