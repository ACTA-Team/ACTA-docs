import type { DocPage } from "@/@types/docs";

export const didStellarProofOfControl: DocPage = {
  slug: "did-stellar-proof-of-control",
  title: "Prueba de control",
  section: "DID:Stellar",
  tocItems: [
    "Cómo funciona",
    "Construir un desafío",
    "Verificar una prueba",
    "Gestión de nonces",
    "Ventana de timestamp",
    "Canonicalización JCS",
  ],
  content: `
# Prueba de control

La Prueba de Control (PoC) es un protocolo de desafío-respuesta que demuestra que una parte controla una clave de autenticación listada en un DID Document de \`did:stellar\`. Utiliza firmas Ed25519 sobre desafíos canonicalizados con JCS (RFC 8785).

## Cómo funciona

1. **El verificador** construye un desafío con el DID objetivo, dominio, nonce y timestamp
2. **El probador** canonicaliza el desafío usando JCS y firma con una clave Ed25519 de autenticación
3. **El verificador** resuelve el DID Document y verifica la firma contra las claves de autenticación listadas

## Construir un desafío

\`\`\`typescript
import { buildChallenge, generateNonce } from "@acta-team/did-stellar";

const challenge = buildChallenge({
  did: "did:stellar:testnet:aaaqeayeaudaocajbifqydiob4",
  domain: "example.com",
  nonce: generateNonce(), // 16 bytes CSPRNG como 32 caracteres hex
  timestamp: new Date().toISOString(), // opcional, por defecto usa now
});
\`\`\`

### Forma del desafío

\`\`\`typescript
interface PoCChallenge {
  did: string;       // El DID objetivo
  domain: string;    // Dominio que solicita la prueba
  nonce: string;     // 32 caracteres hex en minúsculas (16 bytes)
  timestamp: string; // ISO 8601 UTC
}
\`\`\`

## Verificar una prueba

\`\`\`typescript
import { verifyProofOfControl, resolveDidStellar } from "@acta-team/did-stellar";

const { didDocument } = await resolveDidStellar(challenge.did);

const result = await verifyProofOfControl({
  challenge,
  signature: "firma-codificada-en-base64url", // base64url sin padding
  didDocument: didDocument!,
  expectedDomain: "example.com",
  // Opcional: verificación de frescura del nonce
  isNonceFresh: (nonce, did) => {
    // Retornar true si este nonce no se ha usado antes
    return !usedNonces.has(nonce);
  },
  // Opcional: tolerancia de timestamp (default: 5 minutos)
  timestampWindowMs: 5 * 60 * 1000,
});

if (result.valid) {
  console.log("Verificado! Clave:", result.matchedKeyId);
  // ej., "did:stellar:testnet:aaaq...#auth-1"
} else {
  console.log("Falló:", result.reason);
  // result.reason es un DidError con un código específico
}
\`\`\`

### Resultado de verificación

\`\`\`typescript
interface VerifyProofOfControlResult {
  valid: boolean;
  reason?: DidError;      // Presente cuando valid es false
  matchedKeyId?: string;  // Fragment de la clave que firmó (ej., "#auth-1")
}
\`\`\`

## Gestión de nonces

Los nonces previenen ataques de replay. El SDK genera nonces criptográficamente seguros pero **no** aplica deduplicación - eso es responsabilidad del llamador.

\`\`\`typescript
import { generateNonce } from "@acta-team/did-stellar";

const nonce = generateNonce();
// => "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6" (32 caracteres hex, 16 bytes)
\`\`\`

Usa el callback \`isNonceFresh\` en \`verifyProofOfControl\` para verificar contra tu almacén de nonces.

## Ventana de timestamp

La ventana de timestamp por defecto es de **5 minutos** (\`DEFAULT_TIMESTAMP_WINDOW_MS = 300_000\`). Los desafíos fuera de esta ventana son rechazados.

Puedes personalizarla:

\`\`\`typescript
const result = await verifyProofOfControl({
  // ...
  timestampWindowMs: 10 * 60 * 1000, // 10 minutos
});
\`\`\`

## Canonicalización JCS

El desafío se canonicaliza usando JCS (RFC 8785) antes de firmar. El SDK expone las utilidades de canonicalización:

\`\`\`typescript
import { jcsCanonicalize, jcsStringify } from "@acta-team/did-stellar";

// Obtener bytes canónicos para firmar
const bytes = jcsCanonicalize(challenge); // Uint8Array

// Obtener string JSON canónico
const json = jcsStringify(challenge); // string
\`\`\`
    `,
};
