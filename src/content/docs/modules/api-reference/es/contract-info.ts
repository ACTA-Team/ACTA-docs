import type { DocPage } from "@/@types/docs";

export const contractInfo: DocPage = {
  slug: "api-contract-info",
  title: "Información del Contrato",
  section: "Referencia API",
  tocItems: [
    "Obtener Versión del Contrato",
    "Parámetros de consulta",
    "Respuesta",
  ],
  content: `
# Endpoints de Información del Contrato

Endpoints para recuperar información del contrato.

## Obtener Versión del Contrato

### GET /contracts/version

Devuelve la cadena de versión del contrato ACTA. No requiere autenticación.

**Parámetros de consulta:**

- \`contractId\` (opcional): Sobrescribir ID de contrato (C...)
- \`sourcePublicKey\` (requerido): Una cuenta Stellar existente (G...) usada para simulación Soroban

**Respuesta:**

\`\`\`json
{
  "version": "1.0.0"
}
\`\`\`

**Ejemplo:**

\`\`\`bash
curl "https://acta.build/api/testnet/contracts/version?sourcePublicKey=G..."
\`\`\`

## Parámetros de consulta

- **contractId** (opcional): Sobrescribir el ID de contrato ACTA por defecto
- **sourcePublicKey** (requerido): Clave pública Stellar (G...) usada para simulación del contrato

## Respuesta

- **version**: Cadena de versión del contrato
    `,
};
