import type { DocPage } from "@/@types/docs";

export const contractInfo: DocPage = {
  slug: "api-contract-info",
  title: "Información del Contrato",
  section: "Referencia API",
  tocItems: [
    "Obtener Versión del Contrato",
    "Comisiones",
    "Parámetros de consulta",
    "Respuesta",
  ],
  content: `
# Endpoints de Información del Contrato

Endpoints para recuperar información del contrato.

## Obtener Versión del Contrato

### GET /contracts/version

Devuelve la cadena de versión del contrato de **bóveda** de un owner. Las bóvedas son mono-inquilino, así que la versión es por bóveda: pasa el \`owner\` (y opcionalmente \`userSalt\`) para que el factory pueda resolver la bóveda a consultar. **Requiere una API key** (\`X-ACTA-Key\`).

**Parámetros de consulta:**

- \`owner\` (opcional): Dirección del owner (G...) cuya versión de bóveda quieres. Sin él, el endpoint devuelve el id del factory y una nota en lugar de una versión (no existe una versión a nivel de factory).
- \`userSalt\` (opcional): salt de 32 bytes que selecciona la bóveda del owner; por defecto 32 bytes en cero
- \`sourcePublicKey\` (opcional): Una cuenta Stellar existente (G...) usada para simulación Soroban

**Respuesta (con \`owner\`):**

\`\`\`json
{
  "version": "0.4.0"
}
\`\`\`

**Respuesta (sin \`owner\`):**

\`\`\`json
{
  "factory_id": "C...",
  "note": "No factory-level version; pass ?owner= for a vault version."
}
\`\`\`

**Ejemplo:**

\`\`\`bash
curl -H "X-ACTA-Key: your_key" \\
  "https://api.testnet.acta.build/contracts/version?owner=G...&sourcePublicKey=G..."
\`\`\`

## Comisiones

La comisión de emisión se lee **on-chain desde \`quote_fee\` del factory** únicamente. No hay niveles de comisión por rol: aplica una única comisión estándar, con una comisión personalizada opcional por emisor, ambas resueltas on-chain. La comisión la paga el emisor al momento de emitir (mainnet: 1 USDC por credencial; testnet: 5 XLM). La API no expone un endpoint de niveles de comisión ni acepta un override de comisión.

## Parámetros de consulta

- **owner** (opcional): Dirección del owner de la bóveda (G...); omítelo para obtener el id del factory en lugar de una versión de bóveda
- **userSalt** (opcional): salt de 32 bytes que selecciona la bóveda del owner; por defecto 32 bytes en cero
- **sourcePublicKey** (opcional): Clave pública Stellar (G...) usada para simulación del contrato

## Respuesta

- **version**: Cadena de versión del contrato de bóveda
    `,
};
