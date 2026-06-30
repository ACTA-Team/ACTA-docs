import type { DocPage } from "@/@types/docs";

export const contractInfo: DocPage = {
  slug: "api-contract-info",
  title: "Información del Contrato",
  section: "Referencia API",
  tocItems: [
    "Obtener Versión del Contrato",
    "Configuración de Tarifas",
    "Parámetros de consulta",
    "Respuesta",
  ],
  content: `
# Endpoints de Información del Contrato

Endpoints para recuperar información del contrato.

## Obtener Versión del Contrato

### GET /contracts/version

Devuelve una cadena de versión de contrato. No requiere autenticación.

Con **\`?owner=\`** devuelve la versión **por bóveda** de la bóveda derivada de ese propietario. Sin \`owner\`, reporta la versión alcanzable para la configuración del factory. No hay un endpoint de versión a nivel de factory.

**Parámetros de consulta:**

- \`owner\` (opcional): Dirección del propietario (\`G...\`) - devuelve la versión de esa bóveda.
- \`userSalt\` (opcional): Selecciona cuál de las bóvedas del propietario leer (por defecto todo en cero).
- \`sourcePublicKey\` (requerido): Una cuenta Stellar existente (\`G...\`) usada para simulación Soroban.

**Respuesta:**

\`\`\`json
{
  "version": "0.4.0"
}
\`\`\`

**Ejemplo:**

\`\`\`bash
curl "https://api.testnet.acta.build/contracts/version?owner=G...&sourcePublicKey=G..."
\`\`\`

## Configuración de Tarifas

Las tarifas de emisión viven **en el factory** y se leen mediante su **\`quote_fee\`** (el mismo valor cobrado on-chain al emitir - por defecto 1 USDC por credencial, pagada por el emisor). **No hay lecturas de tarifa por rol** (los antiguos niveles fee-admin / fee-early / fee-standard desaparecieron); el factory expone una sola tarifa estándar más una tarifa personalizada opcional por emisor.

\`quote_fee\` resuelve la tarifa efectiva para un emisor dado (la personalizada si está configurada y vigente, de lo contrario la estándar).

## Parámetros de consulta

- **owner** (opcional): Dirección del propietario (\`G...\`) para leer la versión por bóveda.
- **userSalt** (opcional): salt de 32 bytes (hex) que selecciona la bóveda del propietario (por defecto todo en cero).
- **sourcePublicKey** (requerido): Clave pública Stellar (\`G...\`) usada para simulación del contrato.

## Respuesta

- **version**: Cadena de versión del contrato (por bóveda cuando se indica \`owner\`).
    `,
};
