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
curl https://acta.build/api/testnet/health
\`\`\`

## Configuración de red

### GET /config

Obtiene la configuración pública de red (URL RPC, passphrase, ID de contrato). Requiere API key.

**Headers:**

\`\`\`
X-ACTA-Key: tu_api_key_aqui
\`\`\`

**Respuesta:**

\`\`\`json
{
  "rpcUrl": "https://soroban-testnet.stellar.org:443",
  "networkPassphrase": "Test SDF Network ; September 2015",
  "actaContractId": "C..."
}
\`\`\`

**Ejemplo:**

\`\`\`bash
curl -H "X-ACTA-Key: tu_key" https://acta.build/api/testnet/config
\`\`\`
    `,
};
