import type { DocPage } from "@/@types/docs";

export const registry: DocPage = {
  slug: "did-registry",
  title: "Registro y Resolver",
  section: "DID",
  tocItems: [
    "Registro on-chain",
    "El registro DID",
    "Límites del registro",
    "Operaciones del contrato",
    "Contratos desplegados",
    "Resolver alojado (did.acta.build)",
    "Endpoints",
    "Endpoint de resolución",
    "Endpoints de mutación",
    "Prepare/Submit",
    "Rate limits y errores",
  ],
  content: `
# Registro y Resolver

El estado de cada \`did:stellar\` vive en el contrato Soroban **did-stellar-registry**. El resolver alojado en **\`https://did.acta.build\`** es una conveniencia HTTP sin estado sobre él: resuelve DIDs, prepara XDRs sin firmar y envía los firmados. **No requiere autenticación** y nunca guarda claves.

## Registro on-chain

- Una entrada por DID en **almacenamiento persistente de Soroban**, indexada por el id de 16 bytes del DID.
- **Las lecturas son gratis**: la resolución usa \`getLedgerEntries\` sobre Stellar RPC, sin transacción ni fee.
- El contrato es un *almacén tonto*: persiste exactamente lo que envían \`register\`/\`update\`. Nunca rellena valores por defecto ni inventa claves. Los campos de contabilidad (\`version\`, \`createdLedger\`, \`updatedLedger\`, \`deactivated\`) son del contrato y sobrescriben lo que envíe el llamador.

## El registro DID

| Campo | Tipo | Restricción |
|-------|------|-------------|
| \`controller\` | Dirección Stellar | Solo cuentas clásicas \`G...\` (v0.1) |
| \`authentication\` | \`DidKey[]\` | 1 a 3 claves (mínimo 1 obligatoria) |
| \`assertionMethod\` | \`DidKey[]\` | 0 a 3 claves |
| \`keyAgreement\` | \`DidKey[]\` | 0 o 1 clave |
| \`services\` | \`DidService[]\` | 0 a 3 entradas |
| \`metadataUri\` | string opcional | Solo HTTPS, máx. 255 caracteres |
| \`metadataHash\` | 32 bytes opcional | SHA-256; requiere \`metadataUri\` |
| \`version\` | u32 | Empieza en 1, +1 por mutación |
| \`createdLedger\` / \`updatedLedger\` | u32 | Números de secuencia de ledger |
| \`deactivated\` | bool | Bandera de una sola vía |

\`DidKey\` es \`{ publicKeyMultibase }\`. \`DidService\` es \`{ idSuffix, serviceType, serviceEndpoint }\`, expuesto en el documento como \`{did}#service-{idSuffix}\`.

## Límites del registro

| Límite | Valor |
|--------|-------|
| Longitud del multibase de una clave | máx. 128 caracteres |
| \`idSuffix\` de un servicio | máx. 32 caracteres, \`^[a-z0-9]([a-z0-9-]*[a-z0-9])?$\` |
| \`serviceType\` de un servicio | máx. 64 caracteres, no vacío |
| URLs de servicios / metadata | Solo HTTPS, máx. 255 caracteres |

## Operaciones del contrato

| Operación | Auth | Concurrencia optimista |
|-----------|------|------------------------|
| \`register(did_id, initial_record)\` | Firma \`initial_record.controller\` | No (entrada nueva) |
| \`update(did_id, expected_version, next_record)\` | Controller actual | Sí |
| \`transfer_controller(did_id, expected_version, new_controller)\` | Controller actual | Sí |
| \`deactivate(did_id, expected_version)\` | Controller actual | Sí |
| \`get(did_id)\` | Ninguna (lectura) | No |

Los códigos de error del contrato están documentados en **[Errores de contrato](doc:contract-errors)** (tabla del registro did:stellar).

## Contratos desplegados

| Red | ID del contrato de registro |
|-----|------------------------------|
| Testnet | \`CB7ATU7SF5QUKJMSULJDJVWJZVDXC23HTZX6NFUDTSFPVT6MA575NNZJ\` |
| Mainnet | \`CD6LSWW5ZSXOO5WAIHKQLQ262TW7BPI37PNEVMMA273BAPC65NN2AYXQ\` |

Son los registros que usan \`did.acta.build\`, la API de ACTA y los valores por defecto de las librerías.

## Resolver alojado (did.acta.build)

- **Sin autenticación** y **sin custodia de claves**: solo maneja XDRs sin firmar y firmados.
- **Multi-red**: un solo despliegue sirve testnet y mainnet, enrutando cada request por la red incluida en el DID.
- Sin estado y escalable horizontalmente; los resultados de resolución se cachean ~30 segundos.

## Endpoints

| Método | Ruta | Propósito |
|--------|------|-----------|
| GET | \`/health\` | Liveness + redes configuradas |
| GET | \`/docs\` | Swagger UI |
| GET | \`/openapi.json\` | Especificación OpenAPI 3.1 |
| GET | \`/1.0/identifiers/{did}\` | Endpoint **DIF Universal Resolver** (resolución W3C) |
| GET | \`/v1/dids/stellar/{did}\` | Registro DID on-chain crudo |
| POST | \`/v1/dids/stellar\` | Registrar (prepare/submit) |
| POST | \`/v1/dids/stellar/{did}/update\` | Actualizar (prepare/submit) |
| POST | \`/v1/dids/stellar/{did}/transfer\` | Transferir controller (prepare/submit) |
| POST | \`/v1/dids/stellar/{did}/deactivate\` | Desactivar, irreversible (prepare/submit) |
| POST | \`/v1/dids/stellar/submit\` | Enviar cualquier XDR firmado |

## Endpoint de resolución

### GET /1.0/identifiers/{did}

Devuelve el resultado de resolución W3C (\`didDocument\` + \`didDocumentMetadata\` + \`didResolutionMetadata\`). Negociación de contenido: \`application/did+ld+json\` (por defecto, con \`@context\`) o \`application/did+json\`.

\`\`\`bash
curl https://did.acta.build/1.0/identifiers/did:stellar:testnet:znfxngsh46vkyqu6inrx4omphi
\`\`\`

| Estado | Significado |
|--------|-------------|
| 200 | DID activo resuelto |
| 400 | DID inválido (\`didResolutionMetadata.error: "invalidDid"\`) |
| 404 | No registrado |
| 410 | Desactivado (documento tombstone) |
| 502 | RPC de Stellar inaccesible |

### GET /v1/dids/stellar/{did}

Devuelve el registro on-chain crudo sin envoltura W3C: \`{ did, didId, record: { controller, authentication, assertionMethod, keyAgreement, services, version, createdLedger, updatedLedger, deactivated } }\`. Úsalo para leer la \`version\` actual antes de un update, o el \`controller\` directamente.

## Endpoints de mutación

Todas las mutaciones son POST y siguen el mismo patrón **prepare/submit** usado en todo ACTA.

**Registrar (prepare):**

\`\`\`bash
curl -X POST https://did.acta.build/v1/dids/stellar \\
  -H "Content-Type: application/json" \\
  -d '{
    "did": "did:stellar:testnet:...",
    "sourcePublicKey": "G...",
    "record": {
      "controller": "G...",
      "authentication": [{ "publicKeyMultibase": "z6Mk..." }],
      "assertionMethod": [{ "publicKeyMultibase": "z6Mk..." }],
      "keyAgreement": [],
      "services": []
    }
  }'
\`\`\`

Respuesta: \`{ "xdr": "...", "network": "testnet", "networkPassphrase": "..." }\`

**Submit** (después de firmar con la wallet controller):

\`\`\`bash
curl -X POST https://did.acta.build/v1/dids/stellar/submit \\
  -H "Content-Type: application/json" \\
  -d '{ "signedXdr": "AAAA..." }'
\`\`\`

Respuesta: \`{ "txId": "..." }\`

- **Update**: \`POST /v1/dids/stellar/{did}/update\` con \`{ expectedVersion, sourcePublicKey, record }\`. Reemplazo completo del registro; una versión desactualizada devuelve \`409 version_mismatch\`.
- **Transfer**: \`POST /v1/dids/stellar/{did}/transfer\` con \`{ expectedVersion, newController, sourcePublicKey }\`.
- **Deactivate**: \`POST /v1/dids/stellar/{did}/deactivate\` con \`{ expectedVersion, sourcePublicKey }\`. Después el DID se resuelve con \`410\`.

## Prepare/Submit

El modo lo decide el cuerpo: con \`signedXdr\` presente, la ruta envía; sin él, la ruta valida y devuelve el \`xdr\` sin firmar más la passphrase de la red. La wallet Stellar del controller firma el sobre de la transacción; las claves DID dentro del registro son material aparte (firman credenciales y challenges de Proof of Control, nunca la transacción de registro).

## Rate limits y errores

- Rate limit por IP: **120 requests por 60 segundos** por defecto, con headers \`X-RateLimit-Limit\`, \`X-RateLimit-Remaining\` y \`Retry-After\`; el \`429\` devuelve \`{ "code": "rate_limited" }\`.
- Cada error usa un sobre estable \`{ code, message, details? }\` donde \`code\` es un string legible por máquina compartido con la librería TypeScript (p. ej. \`did_invalid\`, \`did_already_exists\`, \`version_mismatch\`, \`did_deactivated\`, \`tx_submission_failed\`). Ramifica por \`code\`, nunca por \`message\`.
- Las requests llevan un header de correlación \`X-Request-ID\`, devuelto en las respuestas.
    `,
};
