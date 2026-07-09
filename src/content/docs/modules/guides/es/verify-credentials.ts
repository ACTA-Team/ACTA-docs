import type { DocPage } from "@/@types/docs";

export const verifyCredentials: DocPage = {
  slug: "verify-credentials",
  title: "Verificar Credenciales",
  section: "Guías",
  tocItems: [
    "Tres formas de verificar",
    "1. El enlace de compartir (sin herramientas)",
    "2. La API",
    "3. El SDK",
    "Qué significa cada estado",
    "Qué demuestra la verificación",
    "Verificar la identidad del emisor",
  ],
  content: `
# Verificar Credenciales

Recibiste una credencial ACTA (un enlace, un código QR o solo una dirección de propietario y un id de credencial) y quieres saber si es genuina y sigue vigente. Hay tres formas, desde cero herramientas hasta totalmente programática.

## Tres formas de verificar

| Método | Para | Requiere |
|--------|-----|----------|
| Enlace de compartir / QR | Cualquiera | Nada, solo un navegador |
| \`POST /contracts/vault/verify-vc\` | Desarrolladores | Una API key (cualquier rol) |
| SDK \`verifyVc\` | Apps React | \`@acta-team/credentials\` |

## 1. El enlace de compartir (sin herramientas)

Cuando un holder comparte una credencial desde la dApp, el enlace (o su código QR) abre una **página pública de verificación** en \`dapp.acta.build\`. Sin wallet, sin cuenta:

- La página muestra **solo los campos que el holder eligió revelar**.
- El **estado de la credencial siempre se vuelve a comprobar on-chain** al cargar la página, nunca se toma del payload compartido: una credencial revocada después de crear el enlace aparece como revocada.
- Los campos revelados en sí vienen de lo que compartió el holder, así que la página los etiqueta como una vista compartida; la parte on-chain es el estado.
- Los enlaces de compartir **expiran** (7 días por defecto), así que un enlace viejo deja de funcionar.

## 2. La API

\`verify-vc\` está abierto intencionalmente a **cualquier API key válida**, sin comprobación de propiedad, precisamente para que terceros puedan verificar credenciales que no les pertenecen. Devuelve solo el estado, nunca el contenido.

\`\`\`bash
curl -X POST https://api.testnet.acta.build/contracts/vault/verify-vc \\
  -H "X-ACTA-Key: your_key" \\
  -H "Content-Type: application/json" \\
  -d '{ "owner": "G...", "vcId": "credential-123" }'
\`\`\`

\`\`\`json
{ "status": "valid", "since": "2026-01-01T00:00:00.000Z" }
\`\`\`

Necesitas la dirección del **owner** (cuya bóveda guarda la credencial) y el **vcId**. Usa la URL base de mainnet para credenciales de mainnet.

## 3. El SDK

\`\`\`ts
import { useVaultRead } from "@acta-team/credentials";

const { verifyVc } = useVaultRead();
const result = await verifyVc({ owner: "G...", vcId: "credential-123" });
// { status: "valid" | "revoked", since?: string }
\`\`\`

## Qué significa cada estado

| Estado | Significado |
|--------|---------|
| \`valid\` | La credencial existe en la bóveda del propietario y no ha sido revocada |
| \`revoked\` | Fue revocada por el propietario de la bóveda; \`since\` lleva la fecha de revocación |
| \`invalid\` | El contrato la reporta como no válida |
| \`unknown\` | El contrato devolvió una forma inesperada (fallback poco frecuente) |

## Qué demuestra la verificación

Sé preciso sobre lo que una comprobación de estado on-chain demuestra y lo que no:

- **Demuestra**: que una credencial con ese id existe en la bóveda de ese propietario en la red Stellar, y su estado actual de ciclo de vida (válida o revocada con fecha).
- **No demuestra por sí sola**: *quién* la emitió. La emisión hacia una bóveda es abierta por defecto (deny-by-exception), así que confiar en una credencial también implica comprobar que su **emisor** es quien esperas.

## Verificar la identidad del emisor

Cada credencial guarda el \`did:stellar\` de su emisor. Para comprobar el emisor:

1. Resuelve el DID del emisor en el resolver público, sin autenticación:

\`\`\`bash
curl https://did.acta.build/1.0/identifiers/did:stellar:mainnet:...
\`\`\`

2. El resultado de la resolución expone la wallet controladora (\`didDocumentMetadata.method.stellarAccount\`) y las claves públicas del emisor. Un DID desactivado resuelve con HTTP \`410\`.
3. La API de ACTA ya exige, al momento de la emisión, que el controller on-chain del DID sea igual a la wallet que firmó la transacción de emisión.

Consulta la **[sección DID](doc:did-overview)** para ver cómo funciona la identidad del emisor de extremo a extremo, y **[Seguridad y Modelo de Datos](doc:security)** para el modelo de confianza más amplio.
    `,
};
