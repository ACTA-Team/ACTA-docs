import type { DocPage } from "@/@types/docs";

export const keys: DocPage = {
  slug: "api-keys",
  title: "API Keys",
  section: "Referencia API",
  tocItems: [
    "Crear API Key de Testnet",
    "Crear API Key de Mainnet",
    "Cuerpo de solicitud",
    "Respuesta",
    "Límites de tasa",
  ],
  content: `
# Endpoints de API Keys

Endpoint público para crear API keys. No requiere autenticación, pero tiene límite de tasa.

> **Nota:** También puedes solicitar API keys directamente desde la [dApp de ACTA](https://dapp.acta.build/). La dApp proporciona una interfaz amigable para crear y gestionar tus API keys.

## Crear API Key

### POST /public/api-keys

Crea una API key (rol estándar, expira en 6 meses). Usa la URL base de **testnet** o **mainnet** según la red que necesites.

- Testnet: \`https://api.testnet.acta.build/public/api-keys\`
- Mainnet: \`https://api.mainnet.acta.build/public/api-keys\`

**Límite de tasa:** 5 solicitudes por minuto por IP

**Cuerpo de solicitud:**

\`\`\`json
{
  "name": "Mi API Key",
  "wallet_address": "G...",
  "metadata": {
    "network": "testnet"
  }
}
\`\`\`

Incluye \`metadata.network\`: \`"testnet"\` o \`"mainnet"\` según la URL base que uses.

**Respuesta:**

\`\`\`json
{
  "message": "API key creada exitosamente. Guarda esta key - no se mostrará de nuevo.",
  "api_key": "acta_...",
  "api_key_record": {
    "id": "uuid",
    "name": "Mi API Key",
    "role": "standard",
    "is_active": true,
    "expires_at": "2024-07-01T00:00:00.000Z",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
\`\`\`

**Ejemplo (testnet):**

\`\`\`bash
curl -X POST https://api.testnet.acta.build/public/api-keys \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Mi Key de Testnet",
    "wallet_address": "G...",
    "metadata": {
      "network": "testnet"
    }
  }'
\`\`\`

**Ejemplo (mainnet):**

\`\`\`bash
curl -X POST https://api.mainnet.acta.build/public/api-keys \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Mi Key de Mainnet",
    "wallet_address": "G...",
    "metadata": {
      "network": "mainnet"
    }
  }'
\`\`\`

## Cuerpo de solicitud

- \`name\` (opcional): Nombre para la API key (máx 120 caracteres)
- \`wallet_address\` (opcional): Dirección de wallet Stellar (G...)
- \`metadata\` (opcional): Objeto de metadatos adicionales
  - \`network\` (requerido): "testnet" o "mainnet"

## Respuesta

- \`api_key\`: La cadena de la API key (guarda esto - no se mostrará de nuevo)
- \`api_key_record\`: Metadatos sobre la key creada

## Límites de tasa

- Máximo 5 solicitudes por minuto por dirección IP
- Headers de límite de tasa incluidos en la respuesta:
  - \`X-RateLimit-Limit\`: 5
  - \`X-RateLimit-Remaining\`: Solicitudes restantes
  - \`X-RateLimit-Reset\`: Timestamp Unix cuando se reinicia el límite

**Nota:** La creación de API keys mediante estos endpoints solo está permitida desde el origen \`dapp.acta.build\`. Para la mejor experiencia, recomendamos usar la [dApp de ACTA](https://dapp.acta.build/) para crear y gestionar tus API keys.
    `,
};
