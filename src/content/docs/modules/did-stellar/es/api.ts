import type { DocPage } from "@/@types/docs";

export const didStellarApi: DocPage = {
  slug: "did-stellar-api",
  title: "API HTTP",
  section: "DID:Stellar",
  tocItems: [
    "URL base",
    "Health y OpenAPI",
    "Resolver un DID",
    "Obtener registro raw",
    "Registrar (crear)",
    "Actualizar",
    "Transferir controlador",
    "Desactivar",
    "Enviar XDR firmado",
    "Respuestas de error",
    "Configuración",
  ],
  content: `
# API HTTP

El servicio \`did-stellar-api\` es un servicio HTTP stateless que envuelve el SDK \`@acta-team/did-stellar\` para consumidores que no usan JavaScript. Es compatible con DIF Universal Resolver y no requiere autenticación.

## URL base

\`\`\`
https://did.acta.build
\`\`\`

## Health y OpenAPI

| Método | Ruta | Descripción |
|--------|------|-------------|
| \`GET\` | \`/health\` | Retorna \`{ "status": "ok" }\` |
| \`GET\` | \`/openapi.json\` | Especificación OpenAPI 3.1 completa |

## Resolver un DID

Endpoint compatible con DIF Universal Resolver.

\`\`\`
GET /1.0/identifiers/{did}
\`\`\`

**Negociación de contenido:**

| Header Accept | Formato de respuesta |
|--------------|----------------------|
| \`application/did+ld+json\` (default) | JSON-LD con \`@context\` |
| \`application/did+json\` | JSON plano, sin \`@context\` |

**Respuesta exitosa (200):**

\`\`\`json
{
  "didDocument": {
    "@context": [
      "https://www.w3.org/ns/did/v1",
      "https://w3id.org/security/multikey/v1"
    ],
    "id": "did:stellar:testnet:aaaqeayeaudaocajbifqydiob4",
    "verificationMethod": [
      {
        "id": "did:stellar:testnet:aaaqeayeaudaocajbifqydiob4#auth-1",
        "type": "Multikey",
        "controller": "did:stellar:testnet:aaaqeayeaudaocajbifqydiob4",
        "publicKeyMultibase": "z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK"
      }
    ],
    "authentication": ["#auth-1"],
    "assertionMethod": [],
    "keyAgreement": [],
    "service": []
  },
  "didDocumentMetadata": {
    "versionId": "1",
    "method": {
      "network": "testnet",
      "stellarAccount": "GXXXXXX..."
    }
  },
  "didResolutionMetadata": {
    "contentType": "application/did+ld+json"
  }
}
\`\`\`

**Códigos de estado:**

| Código | Significado |
|--------|-------------|
| \`200\` | DID activo |
| \`400\` | Sintaxis de DID inválida |
| \`404\` | DID no encontrado |
| \`406\` | Header \`Accept\` no soportado |
| \`410\` | DID desactivado (tombstone) |

## Obtener registro raw

Retorna el \`DidRecord\` on-chain sin envolver en documento W3C.

\`\`\`
GET /v1/dids/stellar/{did}
\`\`\`

**Respuesta (200):**

\`\`\`json
{
  "did": "did:stellar:testnet:aaaqeayeaudaocajbifqydiob4",
  "didId": "aaaqeayeaudaocajbifqydiob4",
  "record": {
    "version": 1,
    "createdLedger": 2661630,
    "updatedLedger": 2661630,
    "deactivated": false,
    "controller": "GXXXXXX...",
    "authentication": [{ "publicKeyMultibase": "z6Mk..." }],
    "assertionMethod": [{ "publicKeyMultibase": "z6Mk..." }],
    "keyAgreement": [],
    "services": []
  }
}
\`\`\`

## Registrar (crear)

Todos los endpoints de mutación siguen un patrón de **preparar/enviar**. Primero se prepara para obtener XDR sin firmar, luego se envía después de firmar.

\`\`\`
POST /v1/dids/stellar
\`\`\`

### Preparar

**Cuerpo de la petición:**

\`\`\`json
{
  "did": "did:stellar:testnet:aaaqeayeaudaocajbifqydiob4",
  "record": {
    "controller": "GXXXXXX...",
    "authentication": [{ "publicKeyMultibase": "z6Mk..." }],
    "assertionMethod": [{ "publicKeyMultibase": "z6Mk..." }],
    "keyAgreement": [],
    "services": []
  },
  "sourcePublicKey": "GXXXXXX..."
}
\`\`\`

**Respuesta (200):**

\`\`\`json
{
  "xdr": "AAAAAgAAAAA...",
  "network": "testnet",
  "networkPassphrase": "Test SDF Network ; September 2015"
}
\`\`\`

### Enviar

\`\`\`json
{
  "signedXdr": "AAAAAgAAAAA..."
}
\`\`\`

**Respuesta (200):**

\`\`\`json
{
  "txId": "9c3234a8a9c9b3cc9a24fa7751cd4a4cfda167763343fa5a9888388d4a57119c"
}
\`\`\`

## Actualizar

\`\`\`
PATCH /v1/dids/stellar/{did}
\`\`\`

**Cuerpo de la petición (preparar):**

\`\`\`json
{
  "expectedVersion": 1,
  "record": {
    "controller": "GXXXXXX...",
    "authentication": [{ "publicKeyMultibase": "z6Mk...newKey" }],
    "assertionMethod": [],
    "keyAgreement": [],
    "services": []
  },
  "sourcePublicKey": "GXXXXXX..."
}
\`\`\`

## Transferir controlador

\`\`\`
POST /v1/dids/stellar/{did}/transfer
\`\`\`

**Cuerpo de la petición (preparar):**

\`\`\`json
{
  "expectedVersion": 1,
  "newController": "GYYYYYY...",
  "sourcePublicKey": "GXXXXXX..."
}
\`\`\`

## Desactivar

\`\`\`
POST /v1/dids/stellar/{did}/deactivate
\`\`\`

**Cuerpo de la petición (preparar):**

\`\`\`json
{
  "expectedVersion": 1,
  "sourcePublicKey": "GXXXXXX..."
}
\`\`\`

## Enviar XDR firmado

Endpoint genérico para enviar cualquier XDR de mutación firmado.

\`\`\`
POST /v1/dids/stellar/submit
\`\`\`

**Cuerpo de la petición:**

\`\`\`json
{
  "signedXdr": "AAAAAgAAAAA..."
}
\`\`\`

**Respuesta (200):**

\`\`\`json
{
  "txId": "9c3234a8..."
}
\`\`\`

## Respuestas de error

Todos los errores siguen una forma consistente:

\`\`\`json
{
  "code": "version_mismatch",
  "message": "the on-chain version drifted...",
  "details": { "contractErrorNumber": 3 }
}
\`\`\`

Los códigos de error coinciden con el tipo \`DidErrorCode\` del SDK. Consulta los [códigos de error del SDK](#did-stellar-sdk) para la lista completa.

## Configuración

El servicio API se configura mediante variables de entorno:

| Variable | Default | Descripción |
|----------|---------|-------------|
| \`PORT\` | \`8080\` | Puerto HTTP |
| \`NETWORK_TYPE\` | \`testnet\` | \`mainnet\` o \`testnet\` |
| \`STELLAR_RPC_URL\` | Endpoint público SDF | Override del URL RPC de Stellar |
| \`DID_REGISTRY_CONTRACT_ID\` | Default de testnet | ID del contrato registry |
| \`REDIS_URL\` | (ninguno) | Redis opcional para caché y rate limiting |
| \`RESOLVER_CACHE_TTL_SECONDS\` | \`30\` | TTL de caché de resolución |
| \`RATE_LIMIT_MAX\` | \`120\` | Máximo de peticiones por ventana |
| \`RATE_LIMIT_WINDOW_SECONDS\` | \`60\` | Ventana de rate limit en segundos |
| \`CORS_ORIGINS\` | \`*\` | Lista de CORS permitidos (separados por coma) |
| \`LOG_LEVEL\` | \`info\` | Nivel de log de Pino |

### Redis

Cuando \`REDIS_URL\` está configurado:

- Las resoluciones de DID se cachean según \`RESOLVER_CACHE_TTL_SECONDS\`
- El rate limiting usa una ventana deslizante de Redis (compartida entre réplicas)

Cuando no está configurado:

- Caché en memoria por proceso
- Rate limiting por proceso (no compartido)
    `,
};
