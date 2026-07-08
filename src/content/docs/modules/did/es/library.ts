import type { DocPage } from "@/@types/docs";

export const library: DocPage = {
  slug: "did-library",
  title: "Librería TypeScript",
  section: "DID",
  tocItems: [
    "Instalación",
    "Qué incluye",
    "Registrar un DID",
    "Resolver un DID",
    "Hook de React (useDid)",
    "Cliente HTTP (ActaDidClient)",
    "Proof of Control",
    "Validación y errores",
    "Relación con el SDK de credenciales",
  ],
  content: `
# Librería TypeScript

**\`@acta-team/did-stellar\`** es la librería TypeScript oficial del método did:stellar: helpers de identificadores, resolución W3C, validación de registros, construcción de transacciones prepare/submit, Proof of Control, un cliente HTTP para \`did.acta.build\` y un hook de React.

## Instalación

\`\`\`bash
npm install @acta-team/did-stellar
\`\`\`

- Build dual **ESM + CJS** con declaraciones de TypeScript.
- Subpath exports: \`@acta-team/did-stellar/resolver\` (solo resolución, bundle más pequeño) y \`@acta-team/did-stellar/hooks\` (React).
- React es una peer dependency **opcional** (solo la necesita el hook).
- Funciona con los valores públicos por defecto: las URLs RPC de Stellar y los ids del contrato de registro de ambas redes vienen incluidos.

## Qué incluye

| Área | Exports clave |
|------|---------------|
| Identificador | \`generateDidId\`, \`buildDidStellar\`, \`parseDidStellar\`, \`isValidDidStellar\`, \`DID_STELLAR_REGEX\` |
| Resolución | \`resolveDidStellar\`, \`getResolver\` (driver DIF \`did-resolver\`) |
| Registro | \`validateDidRecordInput\`, \`readDidRecord\`, \`DID_RECORD_LIMITS\`, tipos \`DidRecord\`, \`DidKey\`, \`DidService\` |
| Claves | \`encodeMultikey\`, \`decodeMultikey\`, \`detectCurve\` (Ed25519 / X25519) |
| Transacciones | \`prepareRegisterDidXdr\`, \`prepareUpdateDidXdr\`, \`prepareTransferControllerXdr\`, \`prepareDeactivateDidXdr\`, \`submitSignedXdr\` |
| Proof of Control | \`buildChallenge\`, \`generateNonce\`, \`jcsCanonicalize\`, \`verifyProofOfControl\` |
| Cliente HTTP | \`ActaDidClient\` (envuelve did.acta.build) |
| React | Hook \`useDid()\` |
| Errores | \`DidError\` con strings \`code\` estables |

## Registrar un DID

El flujo self-service canónico: generar claves, preparar el XDR, firmar con la wallet controller y enviar.

\`\`\`ts
import {
  generateDidId,
  buildDidStellar,
  encodeMultikey,
  prepareRegisterDidXdr,
  submitSignedXdr,
} from "@acta-team/did-stellar";
import * as ed from "@noble/ed25519";

// 1. Genera una clave Ed25519 para el DID
const privateKey = ed.utils.randomPrivateKey();
const publicKey = await ed.getPublicKeyAsync(privateKey);
const publicKeyMultibase = encodeMultikey("Ed25519", publicKey);

// 2. Acuña el DID y prepara la transacción de registro
const did = buildDidStellar("testnet", generateDidId());
const prepared = await prepareRegisterDidXdr({
  did,
  sourcePublicKey: "G...", // la wallet controller
  record: {
    controller: "G...",
    authentication: [{ publicKeyMultibase }],
    assertionMethod: [{ publicKeyMultibase }], // los emisores la necesitan
    keyAgreement: [],
    services: [],
  },
});

// 3. Firma con tu wallet y envía
const signedXdr = await signTransaction(prepared.xdr, {
  networkPassphrase: prepared.networkPassphrase,
});
const { txId } = await submitSignedXdr({ signedXdr, network: "testnet" });
\`\`\`

La wallet controller firma la **transacción**; la clave Ed25519 va **dentro del registro** y es la que luego firma credenciales. Los emisores deben incluir al menos una clave de \`assertionMethod\`.

\`update\`, \`transfer\` y \`deactivate\` siguen la misma forma con sus funciones \`prepare*Xdr\` más \`expectedVersion\`.

## Resolver un DID

\`\`\`ts
import { resolveDidStellar } from "@acta-team/did-stellar/resolver";

const result = await resolveDidStellar(
  "did:stellar:testnet:znfxngsh46vkyqu6inrx4omphi"
);
// result.didDocument, result.didDocumentMetadata, result.didResolutionMetadata
\`\`\`

Para ecosistemas construidos sobre el paquete DIF \`did-resolver\`:

\`\`\`ts
import { Resolver } from "did-resolver";
import { getResolver } from "@acta-team/did-stellar/resolver";

const resolver = new Resolver({ ...getResolver() });
const result = await resolver.resolve("did:stellar:mainnet:...");
\`\`\`

Ambos aceptan overrides de \`rpcUrl\` y \`registryContractId\` por red.

## Hook de React (useDid)

\`\`\`ts
import { useDid } from "@acta-team/did-stellar/hooks";

const { register, update, transfer, deactivate, resolve, getRecord } =
  useDid();

const { txId } = await register({
  did,
  sourcePublicKey: "G...",
  record,
  sign: async (xdr, { networkPassphrase }) => {
    // cualquier wallet Stellar: Freighter, Albedo, WalletConnect...
    return signedXdr;
  },
});
\`\`\`

Cada mutación toma los argumentos del prepare más un callback \`sign\` agnóstico de wallet, y devuelve \`{ txId }\`.

## Cliente HTTP (ActaDidClient)

Un cliente delgado para el resolver alojado, útil cuando prefieres HTTP en lugar de RPC directo:

\`\`\`ts
import { ActaDidClient } from "@acta-team/did-stellar";

const client = new ActaDidClient({ baseUrl: "https://did.acta.build" });

const resolution = await client.resolve(did);
const record = await client.getDidRecord(did);
const prepared = await client.prepareRegister({
  record,
  network: "testnet",
  sourcePublicKey: "G...",
});
const { txId } = await client.submit({ signedXdr });
\`\`\`

## Proof of Control

Verifica que alguien controla un DID (p. ej. login con DID) sin ninguna transacción:

\`\`\`ts
import {
  buildChallenge,
  generateNonce,
  verifyProofOfControl,
} from "@acta-team/did-stellar";

// Lado verificador
const challenge = buildChallenge({
  did,
  domain: "myapp.com",
  nonce: generateNonce(),
});

// ...el firmante canonicaliza (JCS) y firma con una clave de authentication...

const result = await verifyProofOfControl({
  challenge,
  signature,
  isNonceFresh: async nonce => myNonceStore.checkAndBurn(nonce),
});
// result: { valid, reason?, matchedKeyId? }
\`\`\`

Las comprobaciones corren en el orden de la spec: timestamp dentro de una ventana de 5 minutos, coincidencia de dominio, frescura del nonce (almacén conectable) y la firma Ed25519 contra cada clave de \`authentication\`.

## Validación y errores

- \`validateDidRecordInput(record)\` replica la validación del contrato regla por regla, para fallar rápido **antes** de cualquier llamada de red.
- Cada fallo es un \`DidError\` con un \`code\` estable (\`did_invalid\`, \`did_already_exists\`, \`version_mismatch\`, \`did_deactivated\`, \`multikey_unsupported\`, \`tx_submission_failed\`, ...), los mismos códigos que devuelve la API del resolver. Ramifica por \`code\`, nunca por \`message\`.

## Relación con el SDK de credenciales

- **\`@acta-team/credentials\` se apoya en esta librería** para el auto-onboarding del emisor: la primera llamada a \`issue\` sin \`issuerDid\` genera una clave Ed25519, registra un did:stellar (la misma clave en \`authentication\` y \`assertionMethod\`) con una sola firma de wallet, y persiste la identidad. Ver **[SDK de credenciales](doc:sdk-overview)**.
- Usa \`@acta-team/did-stellar\` directamente cuando necesites control total de claves, registros, servicios, rotación de claves o login con DID.
- La API de credenciales de ACTA deliberadamente **no** importa esta librería: identidad y credenciales son dominios de confianza separados.
    `,
};
