import type { DocPage } from "@/@types/docs";

export const healthStatus: DocPage = {
  slug: "api-health-status",
  title: "Salud y Estado",
  section: "Referencia API",
  tocItems: ["Verificación de salud", "Configuración de red"],
  content: `
# Endpoints de Salud y Estado

Endpoints para verificar la salud de la API y recuperar la configuración de red.

## Verificación de salud

### GET /health

Verifica el estado de la API. No requiere autenticación.

**Respuesta:**

\`\`\`json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "ACTA API"
}
\`\`\`

**Ejemplo:**

\`\`\`bash
curl https://sandbox-api.acta.build/health
\`\`\`

:::health-try:::

## Configuración de red

### GET /config

Obtiene la configuración pública de red. **No requiere autenticación** (endpoint público de bootstrap, sin límite de tasa).

**Respuesta:**

\`\`\`json
{
  "rpcUrl": "https://soroban-testnet.stellar.org:443",
  "networkPassphrase": "Test SDF Network ; September 2015",
  "networkType": "testnet",
  "factoryContractId": "C...",
  "vaultWasmHash": "2bd0323a...",
  "didStellarRegistryId": "C...",
  "actaContractId": "C..."
}
\`\`\`

- **factoryContractId**: id del contrato \`vc-vault-factory\` para esta red.
- **networkType**: \`testnet\` o \`mainnet\`.
- **vaultWasmHash**: hash del WASM plantilla \`vc-vault\` que despliega el factory.
- **didStellarRegistryId**: id del contrato del registro \`did:stellar\` usado para resolver los DID de emisores.
- **actaContractId**: alias de retrocompatibilidad de \`factoryContractId\`.

**Ejemplo:**

\`\`\`bash
curl https://sandbox-api.acta.build/config
\`\`\`
    `,
};
