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
  "timestamp": "2024-01-01T00:00:00.000Z"
}
\`\`\`

**Ejemplo:**

\`\`\`bash
curl https://api.testnet.acta.build/health
\`\`\`

:::health-try:::

## Configuración de red

### GET /config

Obtiene la configuración pública de red (URL RPC, passphrase, IDs de contrato del factory y del registro). Requiere API key.

**Headers:**

\`\`\`
X-ACTA-Key: tu_api_key_aqui
\`\`\`

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

- **\`factoryContractId\`**: el \`vc-vault-factory\` de esta red.
- **\`networkType\`**: \`"testnet"\` o \`"mainnet"\`.
- **\`vaultWasmHash\`**: el hash Wasm de la plantilla de bóveda que despliega el factory.
- **\`didStellarRegistryId\`**: el \`did-stellar-registry\` usado para resolver los DID de los emisores.
- **\`actaContractId\`**: alias retrocompatible de \`factoryContractId\`.

**Ejemplo:**

\`\`\`bash
curl -H "X-ACTA-Key: tu_key" https://api.testnet.acta.build/config
\`\`\`
    `,
};
