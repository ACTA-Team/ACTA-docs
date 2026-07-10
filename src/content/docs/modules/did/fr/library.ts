import type { DocPage } from "@/@types/docs";

export const library: DocPage = {
  slug: "did-library",
  title: "Bibliothèque TypeScript",
  section: "DID",
  tocItems: [
    "Installation",
    "Contenu",
    "Enregistrer un DID",
    "Résoudre un DID",
    "Hook React (useDid)",
    "Client HTTP (ActaDidClient)",
    "Proof of Control",
    "Validation et erreurs",
    "Relation avec le Credentials SDK",
  ],
  content: `
# Bibliothèque TypeScript

**\`@acta-team/did-stellar\`** est la bibliothèque TypeScript officielle pour la méthode did:stellar : utilitaires d'identifiants, résolution W3C, validation d'enregistrements, construction de transactions prepare/submit, Proof of Control, un client HTTP pour \`did.acta.build\` et un hook React.

## Installation

\`\`\`bash
npm install @acta-team/did-stellar
\`\`\`

- Build double **ESM + CJS** avec déclarations TypeScript.
- Exports de sous-chemins : \`@acta-team/did-stellar/resolver\` (résolution uniquement, bundle plus petit) et \`@acta-team/did-stellar/hooks\` (React).
- React est une dépendance peer **optionnelle** (nécessaire seulement pour le hook).
- Fonctionne avec les valeurs par défaut publiques dès l'installation : les URLs RPC Stellar et les identifiants du contrat de registre pour les deux réseaux sont intégrés.

## Contenu

| Domaine | Exports clés |
|------|-------------|
| Identifiant | \`generateDidId\`, \`buildDidStellar\`, \`parseDidStellar\`, \`isValidDidStellar\`, \`DID_STELLAR_REGEX\` |
| Résolution | \`resolveDidStellar\`, \`getResolver\` (driver DIF \`did-resolver\`) |
| Enregistrement | \`validateDidRecordInput\`, \`readDidRecord\`, \`DID_RECORD_LIMITS\`, types \`DidRecord\`, \`DidKey\`, \`DidService\` |
| Clés | \`encodeMultikey\`, \`decodeMultikey\`, \`detectCurve\` (Ed25519 / X25519) |
| Transactions | \`prepareRegisterDidXdr\`, \`prepareUpdateDidXdr\`, \`prepareTransferControllerXdr\`, \`prepareDeactivateDidXdr\`, \`submitSignedXdr\` |
| Proof of Control | \`buildChallenge\`, \`generateNonce\`, \`jcsCanonicalize\`, \`verifyProofOfControl\` |
| Client HTTP | \`ActaDidClient\` (enveloppe did.acta.build) |
| React | Hook \`useDid()\` |
| Erreurs | \`DidError\` avec des chaînes \`code\` stables |

## Enregistrer un DID

Le flux self-service canonique : générer les clés, préparer le XDR, signer avec le wallet du contrôleur, soumettre.

\`\`\`ts
import {
  generateDidId,
  buildDidStellar,
  encodeMultikey,
  prepareRegisterDidXdr,
  submitSignedXdr,
} from "@acta-team/did-stellar";
import * as ed from "@noble/ed25519";

// 1. Générer une clé Ed25519 pour le DID
const privateKey = ed.utils.randomPrivateKey();
const publicKey = await ed.getPublicKeyAsync(privateKey);
const publicKeyMultibase = encodeMultikey("Ed25519", publicKey);

// 2. Créer le DID et préparer la transaction d'enregistrement
const did = buildDidStellar("testnet", generateDidId());
const prepared = await prepareRegisterDidXdr({
  did,
  sourcePublicKey: "G...", // le wallet du contrôleur
  record: {
    controller: "G...",
    authentication: [{ publicKeyMultibase }],
    assertionMethod: [{ publicKeyMultibase }], // les émetteurs en ont besoin
    keyAgreement: [],
    services: [],
  },
});

// 3. Signer avec votre wallet, puis soumettre
const signedXdr = await signTransaction(prepared.xdr, {
  networkPassphrase: prepared.networkPassphrase,
});
const { txId } = await submitSignedXdr({ signedXdr, network: "testnet" });
\`\`\`

Le wallet du contrôleur signe la **transaction** ; la clé Ed25519 va **dans l'enregistrement** et c'est elle qui signera plus tard les credentials. Les émetteurs doivent inclure au moins une clé \`assertionMethod\`.

\`update\`, \`transfer\` et \`deactivate\` suivent la même forme avec leurs équivalents \`prepare*Xdr\` plus \`expectedVersion\`.

## Résoudre un DID

\`\`\`ts
import { resolveDidStellar } from "@acta-team/did-stellar/resolver";

const result = await resolveDidStellar(
  "did:stellar:testnet:znfxngsh46vkyqu6inrx4omphi"
);
// result.didDocument, result.didDocumentMetadata, result.didResolutionMetadata
\`\`\`

Pour les écosystèmes construits sur le package DIF \`did-resolver\` :

\`\`\`ts
import { Resolver } from "did-resolver";
import { getResolver } from "@acta-team/did-stellar/resolver";

const resolver = new Resolver({ ...getResolver() });
const result = await resolver.resolve("did:stellar:mainnet:...");
\`\`\`

Les deux acceptent des remplacements de \`rpcUrl\` et \`registryContractId\` par réseau.

## Hook React (useDid)

\`\`\`ts
import { useDid } from "@acta-team/did-stellar/hooks";

const { register, update, transfer, deactivate, resolve, getRecord } =
  useDid();

const { txId } = await register({
  did,
  sourcePublicKey: "G...",
  record,
  sign: async (xdr, { networkPassphrase }) => {
    // n'importe quel wallet Stellar : Freighter, Albedo, WalletConnect...
    return signedXdr;
  },
});
\`\`\`

Chaque mutation prend les arguments du prepare plus un callback \`sign\` indépendant du wallet, et retourne \`{ txId }\`.

## Client HTTP (ActaDidClient)

Un client léger pour le resolver hébergé, utile quand vous préférez HTTP au RPC direct :

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

Vérifiez qu'une partie contrôle un DID (par exemple pour la connexion par DID) sans aucune transaction :

\`\`\`ts
import {
  buildChallenge,
  generateNonce,
  verifyProofOfControl,
} from "@acta-team/did-stellar";

// Côté vérificateur
const challenge = buildChallenge({
  did,
  domain: "myapp.com",
  nonce: generateNonce(),
});

// ...le signataire canonicalise (JCS) et signe avec une clé authentication...

const result = await verifyProofOfControl({
  challenge,
  signature,
  isNonceFresh: async nonce => myNonceStore.checkAndBurn(nonce),
});
// result: { valid, reason?, matchedKeyId? }
\`\`\`

Les vérifications s'exécutent dans l'ordre de la spécification : timestamp dans une fenêtre de 5 minutes, correspondance du domaine, fraîcheur du nonce (magasin enfichable), puis la signature Ed25519 contre chaque clé \`authentication\`.

## Validation et erreurs

- \`validateDidRecordInput(record)\` reflète la validation du contrat règle par règle, ce qui vous permet d'échouer rapidement **avant** tout appel réseau.
- Chaque échec est une \`DidError\` avec un \`code\` stable (\`did_invalid\`, \`did_already_exists\`, \`version_mismatch\`, \`did_deactivated\`, \`multikey_unsupported\`, \`tx_submission_failed\`, ...), les mêmes codes que l'API du resolver retourne. Branchez-vous sur \`code\`, jamais sur \`message\`.

## Relation avec le Credentials SDK

- **\`@acta-team/credentials\` s'appuie sur cette bibliothèque** pour l'auto-onboarding des émetteurs : le premier appel \`issue\` sans \`issuerDid\` génère une clé Ed25519, enregistre un did:stellar (la même clé dans \`authentication\` et \`assertionMethod\`) avec une seule signature de wallet, et persiste l'identité. Voir **[Credentials SDK](doc:sdk-overview)**.
- Utilisez \`@acta-team/did-stellar\` directement quand vous avez besoin d'un contrôle total sur les clés, les enregistrements, les services, la rotation de clés ou la connexion par DID.
- L'API de credentials d'ACTA n'importe délibérément **pas** cette bibliothèque : identité et credentials sont des domaines de confiance séparés.
    `,
};
