import type { DocPage } from "@/@types/docs";

export const didStellarOverview: DocPage = {
  slug: "did-stellar-overview",
  title: "DID:Stellar - Resumen",
  section: "DID:Stellar",
  tocItems: [
    "Qué es did:stellar",
    "Sintaxis del DID",
    "DID Document",
    "Operaciones del ciclo de vida",
    "Prueba de control",
    "Diseño trust-minimized",
    "Redes",
    "Restricciones del registro",
  ],
  content: `
# DID:Stellar - Resumen

\`did:stellar\` es el método de Identificador Descentralizado de ACTA para la blockchain de Stellar. Provee una capa de identidad compatible con W3C DID Core 1.1 anclada en contratos inteligentes Soroban.

> **Requerido para emitir:** la emisión de credenciales de ACTA ahora requiere que el **emisor controle un \`did:stellar\` registrado**. La API exige un vínculo controlador↔emisor - el controlador on-chain del DID debe ser igual a la cuenta emisora que firma. \`did:pkh\` y las direcciones de wallet planas ya no se aceptan como DID del emisor.

## Qué es did:stellar

Un identificador \`did:stellar\` es una identidad globalmente única y auto-soberana vinculada a la blockchain de Stellar. A diferencia de \`did:pkh\` (que derivaba el DID de una dirección de wallet), \`did:stellar\` usa un **identificador aleatorio de 128 bits** registrado on-chain a través de un contrato registry en Soroban. Esto permite:

- **Rotación de claves** sin cambiar la identidad
- **Múltiples claves de verificación** (autenticación, aserción, acuerdo de claves)
- **Endpoints de servicio** para descubrimiento
- **Transferencia de controlador** a otra cuenta Stellar
- **Desactivación irreversible** (tombstone)

## Sintaxis del DID

\`\`\`
did:stellar:{network}:{didId}
\`\`\`

| Parte | Descripción |
|-------|-------------|
| \`did:stellar\` | Prefijo del método |
| \`{network}\` | \`mainnet\` o \`testnet\` |
| \`{didId}\` | Identificador base32 en minúsculas de 26 caracteres (128 bits, sin padding) |

**Ejemplo:**

\`\`\`
did:stellar:testnet:aaaqeayeaudaocajbifqydiob4
\`\`\`

El \`didId\` se genera a partir de 16 bytes de aleatoriedad criptográficamente segura, codificado como base32 en minúsculas sin padding.

**Regex:** \`/^did:stellar:(mainnet|testnet):([a-z2-7]{26})$/\`

## DID Document

Un \`did:stellar\` resuelto produce un documento W3C DID Core 1.1:

\`\`\`json
{
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
  "assertionMethod": ["#assert-1"],
  "keyAgreement": [],
  "service": []
}
\`\`\`

### Métodos de verificación

Todas las claves usan el tipo **Multikey** con claves públicas codificadas en multibase:

| Relación | Curva | Prefijo multibase | Uso |
|---|---|---|---|
| \`authentication\` | Ed25519 | \`z6Mk...\` | Firma, login |
| \`assertionMethod\` | Ed25519 | \`z6Mk...\` | Emisión de credenciales |
| \`keyAgreement\` | X25519 | \`z6LS...\` | Cifrado |

### Endpoints de servicio

Los servicios se referencian por fragment ID \`#service-{idSuffix}\`:

\`\`\`json
{
  "id": "did:stellar:testnet:aaaq...#service-api",
  "type": "LinkedDomains",
  "serviceEndpoint": "https://example.com"
}
\`\`\`

### Metadatos del documento

\`\`\`json
{
  "versionId": "1",
  "deactivated": false,
  "method": {
    "network": "testnet",
    "stellarAccount": "GXXXXXX..."
  }
}
\`\`\`

## Operaciones del ciclo de vida

| Operación | Descripción |
|-----------|-------------|
| **Register** | Crear un nuevo DID con claves, servicios y un controlador |
| **Resolve** | Leer el DID Document del estado on-chain |
| **Update** | Modificar claves, servicios o metadatos (con concurrencia optimista) |
| **Transfer** | Cambiar el controlador a otra cuenta Stellar |
| **Deactivate** | Desactivar permanentemente el DID (irreversible) |

Todas las mutaciones requieren \`require_auth()\` del controlador on-chain. Las actualizaciones usan **concurrencia optimista** vía \`expectedVersion\` para prevenir actualizaciones perdidas.

## Prueba de control

\`did:stellar\` soporta un protocolo de desafío-respuesta para probar que una parte controla una clave de autenticación listada en el DID Document:

1. **Construir desafío** con DID, dominio, nonce y timestamp
2. **Canonicalizar** usando JCS (RFC 8785)
3. **Firmar** con una clave Ed25519 de autenticación
4. **Verificar** contra el DID Document resuelto

La ventana de timestamp por defecto es de **5 minutos**. La protección contra replay de nonces es responsabilidad del llamador.

## Diseño trust-minimized

- El SDK lee directamente del RPC de Stellar - **no se requiere infraestructura de ACTA** para la resolución
- La API HTTP es opcional y stateless
- Todas las mutaciones se aplican en el contrato registry on-chain vía \`require_auth()\`
- Sin autenticación en la API HTTP por diseño

## Redes

| Red | URL RPC | Contrato registry |
|-----|---------|-------------------|
| Testnet | \`https://soroban-testnet.stellar.org\` | \`CB7ATU7SF5QUKJMSULJDJVWJZVDXC23HTZX6NFUDTSFPVT6MA575NNZJ\` |
| Mainnet | \`https://mainnet.sorobanrpc.com\` | Aún no desplegado |

## Restricciones del registro

Todas se aplican tanto del lado del cliente como on-chain:

| Restricción | Límite |
|-------------|--------|
| Claves de autenticación | 1 a 3 |
| Claves de aserción | 0 a 3 |
| Claves de acuerdo | 0 a 1 |
| Servicios | 0 a 3 |
| Longitud multibase de clave | 128 caracteres máx. |
| Longitud de ID de servicio | 32 caracteres máx. |
| Longitud de tipo de servicio | 64 caracteres máx. |
| Longitud de URL (endpoints, metadata URI) | 255 caracteres máx. |
| Hash de metadatos | 32 bytes (64 caracteres hex) |
    `,
};
