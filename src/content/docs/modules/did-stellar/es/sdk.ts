import type { DocPage } from "@/@types/docs";

export const didStellarSdk: DocPage = {
  slug: "did-stellar-sdk",
  title: "SDK (@acta-team/did-stellar)",
  section: "DID:Stellar",
  tocItems: [
    "Instalación",
    "Generación de identificadores",
    "Parsing y validación",
    "Resolver un DID",
    "Registrar un DID",
    "Actualizar un DID",
    "Transferir controlador",
    "Desactivar un DID",
    "Leer registro raw",
    "Driver DIF did-resolver",
    "Hook de React (useDid)",
    "Cliente HTTP (ActaDidClient)",
    "Manejo de errores",
    "Codec Multikey",
    "Constantes y configuración",
  ],
  content: `
# SDK (\`@acta-team/did-stellar\`)

El paquete \`@acta-team/did-stellar\` es el SDK oficial de TypeScript para el método \`did:stellar\`. Provee generación de identificadores, resolución, gestión de registros, prueba de control y preparación de transacciones - todo sin dependencias de infraestructura de ACTA en el path principal.

## Instalación

\`\`\`bash
npm install @acta-team/did-stellar
\`\`\`

**Peer dependencies** (opcionales):

\`\`\`bash
# Solo si usas el hook de React
npm install react
\`\`\`

## Generación de identificadores

\`\`\`typescript
import {
  generateDidId,
  generateDidIdBytes,
  buildDidStellar,
  buildDidStellarFromBytes,
  encodeDidId,
  decodeDidId,
} from "@acta-team/did-stellar";

// Generar un DID ID aleatorio de 26 caracteres base32
const didId = generateDidId();
// => "aaaqeayeaudaocajbifqydiob4"

// Generar 16 bytes raw
const didIdBytes = generateDidIdBytes();

// Construir un DID string completo
const did = buildDidStellar("testnet", didId);
// => "did:stellar:testnet:aaaqeayeaudaocajbifqydiob4"

// Construir desde bytes raw
const didFromBytes = buildDidStellarFromBytes("testnet", didIdBytes);

// Codificar/decodificar entre bytes y base32
const encoded = encodeDidId(didIdBytes);
const decoded = decodeDidId(encoded);
\`\`\`

## Parsing y validación

\`\`\`typescript
import {
  parseDidStellar,
  isValidDidStellar,
  isNetworkType,
} from "@acta-team/did-stellar";

// Parsear un DID string en componentes
const parsed = parseDidStellar("did:stellar:testnet:aaaqeayeaudaocajbifqydiob4");
// => { network: "testnet", didId: "aaaqeayeaudaocajbifqydiob4", didIdBytes: Uint8Array }

// Validar formato de DID
const valid = isValidDidStellar("did:stellar:testnet:aaaqeayeaudaocajbifqydiob4");
// => true

// Validar tipo de red
const isNet = isNetworkType("testnet");
// => true
\`\`\`

## Resolver un DID

La resolución lee el registro on-chain y construye un W3C DID Document.

\`\`\`typescript
import { resolveDidStellar } from "@acta-team/did-stellar";

const result = await resolveDidStellar(
  "did:stellar:testnet:aaaqeayeaudaocajbifqydiob4",
  {
    rpcUrl: "https://soroban-testnet.stellar.org", // opcional, usa default
    registryContractId: "CB7ATU7...", // opcional, usa default
  }
);

// result.didDocument       - W3C DID Document (null si no se encuentra)
// result.didDocumentMetadata  - versión, flag de desactivación, red, controlador
// result.didResolutionMetadata - contentType
\`\`\`

### Forma del resultado de resolución

\`\`\`typescript
interface DidResolutionResult {
  didDocument: DidDocument | null;
  didDocumentMetadata: DidDocumentMetadata;
  didResolutionMetadata: DidResolutionMetadata;
}
\`\`\`

## Registrar un DID

El registro es un proceso de dos pasos: **preparar** el XDR sin firmar, luego **firmar y enviar**.

\`\`\`typescript
import {
  generateDidId,
  buildDidStellar,
  prepareRegisterDidXdr,
  submitSignedXdr,
} from "@acta-team/did-stellar";
import type { DidRecordInput } from "@acta-team/did-stellar";

// 1. Generar identificador
const didId = generateDidId();
const did = buildDidStellar("testnet", didId);

// 2. Definir el registro
const record: DidRecordInput = {
  controller: "GXXXXXX...",
  authentication: [{ publicKeyMultibase: "z6Mk..." }],
  assertionMethod: [{ publicKeyMultibase: "z6Mk..." }],
  keyAgreement: [],
  services: [],
};

// 3. Preparar XDR sin firmar
const prepared = await prepareRegisterDidXdr({
  did,
  record,
  sourcePublicKey: "GXXXXXX...",
});

// 4. Firmar con wallet (Freighter, Albedo, Hana, etc.)
const signedXdr = await wallet.sign(prepared.xdr, {
  networkPassphrase: prepared.networkPassphrase,
});

// 5. Enviar a la blockchain
const { txId } = await submitSignedXdr({
  signedXdr,
  network: "testnet",
});
\`\`\`

### DidRecordInput

\`\`\`typescript
interface DidRecordInput {
  controller: string;            // Cuenta Stellar (G...)
  authentication: DidKey[];      // 1-3 claves Ed25519 (requerido)
  assertionMethod: DidKey[];     // 0-3 claves Ed25519
  keyAgreement: DidKey[];        // 0-1 claves X25519
  services: DidService[];        // 0-3 endpoints de servicio
  metadataUri?: string;          // URI HTTPS
  metadataHash?: string;         // SHA-256 hex (64 caracteres)
}

interface DidKey {
  publicKeyMultibase: string;    // z6Mk... (Ed25519) o z6LS... (X25519)
}

interface DidService {
  idSuffix: string;              // Alfanumérico + guión
  serviceType: string;
  serviceEndpoint: string;       // URL HTTPS
}
\`\`\`

## Actualizar un DID

Las actualizaciones usan **concurrencia optimista** - debes proveer la versión actual para prevenir actualizaciones perdidas.

\`\`\`typescript
import {
  resolveDidStellar,
  prepareUpdateDidXdr,
  submitSignedXdr,
} from "@acta-team/did-stellar";

// 1. Obtener versión actual
const { didDocumentMetadata } = await resolveDidStellar(did);
const currentVersion = parseInt(didDocumentMetadata.versionId);

// 2. Preparar actualización
const prepared = await prepareUpdateDidXdr({
  did,
  expectedVersion: currentVersion,
  nextRecord: {
    controller: "GXXXXXX...",
    authentication: [{ publicKeyMultibase: "z6Mk...newKey" }],
    assertionMethod: [],
    keyAgreement: [],
    services: [
      {
        idSuffix: "api",
        serviceType: "LinkedDomains",
        serviceEndpoint: "https://example.com",
      },
    ],
  },
  sourcePublicKey: "GXXXXXX...",
});

// 3. Firmar y enviar
const signedXdr = await wallet.sign(prepared.xdr, {
  networkPassphrase: prepared.networkPassphrase,
});
const { txId } = await submitSignedXdr({ signedXdr, network: "testnet" });
\`\`\`

## Transferir controlador

Transferir la propiedad a otra cuenta Stellar.

\`\`\`typescript
import {
  resolveDidStellar,
  prepareTransferControllerXdr,
  submitSignedXdr,
} from "@acta-team/did-stellar";

const { didDocumentMetadata } = await resolveDidStellar(did);
const currentVersion = parseInt(didDocumentMetadata.versionId);

const prepared = await prepareTransferControllerXdr({
  did,
  expectedVersion: currentVersion,
  newController: "GYYYYYY...", // Nueva cuenta Stellar
  sourcePublicKey: "GXXXXXX...", // Controlador actual
});

const signedXdr = await wallet.sign(prepared.xdr, {
  networkPassphrase: prepared.networkPassphrase,
});
const { txId } = await submitSignedXdr({ signedXdr, network: "testnet" });
\`\`\`

## Desactivar un DID

La desactivación es **irreversible**. El DID se convierte en un tombstone con arrays de crypto vacíos.

\`\`\`typescript
import {
  resolveDidStellar,
  prepareDeactivateDidXdr,
  submitSignedXdr,
} from "@acta-team/did-stellar";

const { didDocumentMetadata } = await resolveDidStellar(did);
const currentVersion = parseInt(didDocumentMetadata.versionId);

const prepared = await prepareDeactivateDidXdr({
  did,
  expectedVersion: currentVersion,
  sourcePublicKey: "GXXXXXX...",
});

const signedXdr = await wallet.sign(prepared.xdr, {
  networkPassphrase: prepared.networkPassphrase,
});
const { txId } = await submitSignedXdr({ signedXdr, network: "testnet" });
\`\`\`

## Leer registro raw

Leer el \`DidRecord\` on-chain directamente (sin envolver en documento W3C).

\`\`\`typescript
import { readDidRecord, parseDidStellar } from "@acta-team/did-stellar";
import { rpc } from "@stellar/stellar-sdk";

const { didIdBytes } = parseDidStellar(did);
const rpcServer = new rpc.Server("https://soroban-testnet.stellar.org");

const record = await readDidRecord({
  rpcServer,
  registryContractId: "CB7ATU7SF5QUKJMSULJDJVWJZVDXC23HTZX6NFUDTSFPVT6MA575NNZJ",
  didIdBytes,
});

if (record) {
  console.log(record.version);        // number
  console.log(record.controller);     // Cuenta Stellar
  console.log(record.deactivated);    // boolean
  console.log(record.createdLedger);  // Ledger al registrar
  console.log(record.updatedLedger);  // Ledger de la última mutación
}
\`\`\`

## Driver DIF did-resolver

Integrarse con el ecosistema DIF Universal Resolver.

\`\`\`typescript
import { Resolver } from "did-resolver";
import { getResolver } from "@acta-team/did-stellar";

const resolver = new Resolver(getResolver());

const result = await resolver.resolve(
  "did:stellar:testnet:aaaqeayeaudaocajbifqydiob4"
);
\`\`\`

## Hook de React (\`useDid\`)

Importar desde \`@acta-team/did-stellar/hooks\`. Requiere \`react\` como peer dependency.

\`\`\`typescript
import { useDid } from "@acta-team/did-stellar/hooks";

function MyComponent() {
  const { register, update, transfer, deactivate, resolve, getRecord } = useDid();

  const handleRegister = async () => {
    const { txId } = await register({
      did: "did:stellar:testnet:...",
      record: { /* DidRecordInput */ },
      sourcePublicKey: "GXXXXXX...",
      sign: async (xdr, { networkPassphrase }) => {
        // Firmar con tu wallet
        return signedXdr;
      },
    });
  };
}
\`\`\`

### Métodos del hook

| Método | Descripción |
|--------|-------------|
| \`register\` | Crear un nuevo DID (preparar, firmar, enviar) |
| \`update\` | Actualizar un DID existente |
| \`transfer\` | Transferir controlador a una nueva cuenta |
| \`deactivate\` | Desactivar permanentemente un DID |
| \`resolve\` | Resolver un DID a un documento W3C |
| \`getRecord\` | Leer el registro raw on-chain |

Todos los métodos de mutación aceptan un callback \`sign\`:

\`\`\`typescript
type Signer = (
  unsignedXdr: string,
  opts: { networkPassphrase: string }
) => Promise<string>;
\`\`\`

## Cliente HTTP (\`ActaDidClient\`)

Cliente HTTP opcional para consumidores que no usan RPC directamente.

\`\`\`typescript
import { ActaDidClient } from "@acta-team/did-stellar";

const client = new ActaDidClient({
  baseUrl: "https://did.acta.build",
  timeoutMs: 10_000, // opcional, default 10s
});

// Resolver
const result = await client.resolve("did:stellar:testnet:...");

// Resolver solo documento (lanza error si no se encuentra)
const doc = await client.resolveDocument("did:stellar:testnet:...");

// Obtener registro raw
const { did, didId, record } = await client.getDidRecord("did:stellar:testnet:...");

// Preparar registro
const { xdr, network } = await client.prepareRegister({
  record: { /* DidRecordInput */ },
  network: "testnet",
  sourcePublicKey: "GXXXXXX...",
});

// Enviar XDR firmado
const { txId } = await client.submit({ signedXdr: "AAAA..." });
\`\`\`

## Manejo de errores

Todos los errores del SDK son instancias de \`DidError\` con un \`code\` string estable.

\`\`\`typescript
import { DidError } from "@acta-team/did-stellar";
import type { DidErrorCode } from "@acta-team/did-stellar";

try {
  await resolveDidStellar("invalid-did");
} catch (err) {
  if (DidError.is(err)) {
    console.log(err.code);    // String de DidErrorCode
    console.log(err.message); // Mensaje legible
    console.log(err.details); // Contexto adicional opcional
  }
}
\`\`\`

### Códigos de error

| Categoría | Códigos |
|-----------|---------|
| **Sintaxis DID** | \`did_invalid\`, \`did_id_invalid\`, \`network_invalid\` |
| **Registro del contrato** | \`did_already_exists\`, \`did_not_found\`, \`version_mismatch\`, \`did_deactivated\`, \`invalid_auth_key_count\`, \`invalid_assertion_key_count\`, \`invalid_key_agreement_count\`, \`invalid_service_count\`, \`duplicate_key\`, \`key_too_long\`, \`key_empty\`, \`service_type_too_long\`, \`service_id_too_long\`, \`service_id_invalid_format\`, \`service_endpoint_invalid\`, \`metadata_uri_invalid\`, \`no_proposed_admin\`, \`service_type_empty\`, \`version_overflow\`, \`metadata_inconsistent\` |
| **Del lado del cliente** | \`controller_invalid\`, \`multibase_invalid\`, \`multikey_unsupported\`, \`contract_id_invalid\`, \`rpc_url_invalid\`, \`expected_version_required\` |
| **Prueba de control** | \`challenge_invalid\`, \`challenge_expired\`, \`challenge_nonce_invalid\`, \`challenge_domain_mismatch\`, \`signature_invalid\` |
| **Transporte** | \`rpc_error\`, \`tx_simulation_failed\`, \`tx_submission_failed\`, \`http_error\`, \`unknown\` |

## Codec Multikey

Codificar y decodificar claves públicas codificadas en multibase.

\`\`\`typescript
import {
  encodeMultikey,
  decodeMultikey,
  detectCurve,
} from "@acta-team/did-stellar";

// Detectar curva desde string multibase
const curve = detectCurve("z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK");
// => "Ed25519"

// Decodificar multibase a clave pública raw
const { curve, publicKey } = decodeMultikey("z6Mk...");
// curve: "Ed25519", publicKey: Uint8Array (32 bytes)

// Codificar clave pública raw a multibase
const multibase = encodeMultikey(publicKey, "Ed25519");
// => "z6Mk..."
\`\`\`

### Prefijos multicodec

| Curva | Bytes de prefijo | Multibase | Uso |
|-------|-----------------|-----------|-----|
| Ed25519 | \`0xed 0x01\` | \`z6Mk...\` | authentication, assertionMethod |
| X25519 | \`0xec 0x01\` | \`z6LS...\` | keyAgreement |

## Constantes y configuración

\`\`\`typescript
import {
  DEFAULT_RPC_URLS,
  DEFAULT_REGISTRY_CONTRACT_IDS,
  NETWORK_PASSPHRASES,
  DID_RECORD_LIMITS,
} from "@acta-team/did-stellar";

// Endpoints RPC por defecto
DEFAULT_RPC_URLS.mainnet; // "https://mainnet.sorobanrpc.com"
DEFAULT_RPC_URLS.testnet; // "https://soroban-testnet.stellar.org"

// IDs del contrato registry
DEFAULT_REGISTRY_CONTRACT_IDS.testnet;
// "CB7ATU7SF5QUKJMSULJDJVWJZVDXC23HTZX6NFUDTSFPVT6MA575NNZJ"

// Passphrases de red
NETWORK_PASSPHRASES.mainnet; // "Public Global Stellar Network ; September 2015"
NETWORK_PASSPHRASES.testnet; // "Test SDF Network ; September 2015"

// Límites de campos del registro
DID_RECORD_LIMITS.MIN_KEY_COUNT_AUTH;   // 1
DID_RECORD_LIMITS.MAX_KEY_COUNT_AUTH;   // 3
DID_RECORD_LIMITS.MAX_KEY_COUNT_ASSERT; // 3
DID_RECORD_LIMITS.MAX_KEY_COUNT_AGREEMENT; // 1
DID_RECORD_LIMITS.MAX_SERVICE_COUNT;    // 3
DID_RECORD_LIMITS.MAX_KEY_MULTIBASE_LEN; // 128
DID_RECORD_LIMITS.MAX_SERVICE_ID_LEN;  // 32
DID_RECORD_LIMITS.MAX_SERVICE_TYPE_LEN; // 64
DID_RECORD_LIMITS.MAX_URL_LEN;         // 255
DID_RECORD_LIMITS.METADATA_HASH_LEN;   // 32
\`\`\`
    `,
};
