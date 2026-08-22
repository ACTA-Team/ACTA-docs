import type { DocPage } from "@/@types/docs";

export const quickstart: DocPage = {
  slug: "quickstart",
  title: "Quickstart",
  section: "Guides",
  tocItems: [
    "Ce que vous allez construire",
    "Prérequis",
    "Étape 1 : Obtenir une API key",
    "Étape 2 : Installer et configurer le SDK",
    "Étape 3 : Obtenir votre DID d'émetteur",
    "Étape 4 : Créer le coffre",
    "Étape 5 : Émettre un credential",
    "Étape 6 : Le vérifier",
    "Composant complet",
    "Aller plus loin",
  ],
  content: `
# Quickstart

De zéro à un **verifiable credential sur le testnet Stellar**, de bout en bout, avec un seul exemple continu. Tout ce qui suit fonctionne aussi via l'API REST brute (voir l'**[Aperçu de l'API](doc:api-overview)**) ; ce guide utilise le SDK React parce que c'est le chemin le plus court.

## Ce que vous allez construire

Un petit flux React qui :

1. Obtient une identité d'émetteur (**did:stellar**) automatiquement
2. Crée un **coffre** single-tenant pour votre wallet
3. **Émet** un credential dedans
4. Le **vérifie** on-chain

## Prérequis

- Un wallet Stellar (par ex. **Freighter**) avec un compte **testnet** approvisionné en XLM : utilisez **[Stellar Lab (fund account)](https://lab.stellar.org/account/fund)**. Sur testnet, l'émission facture des frais on-chain de **5 XLM** par credential, payés par l'émetteur.
- Une application React / Next.js (les hooks du SDK nécessitent React 18+ ; \`ActaConfig\` est un composant client).
- Node 18+ pour l'outillage.

## Étape 1 : Obtenir une API key

Créez votre clé dans le **[dApp ACTA](https://dapp.acta.build)** → **API Keys** → **Create API Key**, sur le réseau **Testnet**, et sauvegardez-la immédiatement (elle n'est affichée qu'une seule fois).

> Points clés : une clé par wallet et par réseau, rôle standard, expiration de 6 mois. L'endpoint public de création est restreint par origine, donc le dApp est le moyen d'en obtenir une. Détails dans **[API Keys](doc:api-keys)**.

## Étape 2 : Installer et configurer le SDK

\`\`\`bash
npm install @acta-team/credentials
\`\`\`

Enveloppez votre application avec le provider, pointant vers testnet :

\`\`\`tsx
"use client";
import { ActaConfig, testNet } from "@acta-team/credentials";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ActaConfig baseURL={testNet} apiKey={process.env.NEXT_PUBLIC_ACTA_API_KEY}>
      {children}
    </ActaConfig>
  );
}
\`\`\`

Vous avez aussi besoin d'un callback \`signTransaction\` qui demande à votre wallet de signer. Avec Freighter :

\`\`\`ts
import { signTransaction } from "@stellar/freighter-api";

const sign = async (xdr: string, opts: { networkPassphrase: string }) => {
  const res = await signTransaction(xdr, {
    networkPassphrase: opts.networkPassphrase,
  });
  return res.signedTxXdr;
};
\`\`\`

## Étape 3 : Obtenir votre DID d'émetteur

L'émission exige un **did:stellar** enregistré et résolvable. Le SDK peut le créer et l'enregistrer pour vous avec **une seule signature de wallet** (auto-onboarding) :

\`\`\`ts
import { useActaClient } from "@acta-team/credentials";

const client = useActaClient();

const identity = await client.getOrCreateIssuerIdentity({
  controller: walletAddress, // your G... account
  signTransaction: sign,
});
// identity.did => "did:stellar:testnet:..."
\`\`\`

Le premier appel génère une clé Ed25519, enregistre le DID on-chain et persiste l'identité (IndexedDB dans le navigateur). Les appels suivants la relisent simplement, sans invite. Détails complets dans la **[section DID](doc:did-overview)**.

## Étape 4 : Créer le coffre

Chaque propriétaire a un coffre déterministe single-tenant. Sa création est une opération unique par wallet :

\`\`\`ts
import { useVault } from "@acta-team/credentials";

const { createVault } = useVault();

const { txId } = await createVault({
  owner: walletAddress,
  ownerDid: identity.did,
  signTransaction: sign,
});
\`\`\`

Si le coffre existe déjà à cette adresse, le déploiement on-chain échoue avec "already deployed" : vous pouvez sans risque le traiter comme un succès.

## Étape 5 : Émettre un credential

\`\`\`ts
import { useCredential } from "@acta-team/credentials";

const { issue } = useCredential();

const { txId } = await issue({
  owner: walletAddress,          // whose vault receives it
  vcId: "employee-badge-001",    // unique id, max 64 chars
  vcData: {
    "@context": ["https://www.w3.org/ns/credentials/v2"],
    type: ["VerifiableCredential"],
    credentialSubject: {
      id: identity.did,          // the holder's DID
      name: "Ada Lovelace",
      role: "Engineer",
    },
  },
  issuer: walletAddress,
  signTransaction: sign,
  // issuerDid can be omitted: the SDK reuses the identity from Step 3
});
\`\`\`

Une signature de wallet plus tard, le credential est chiffré, stocké dans le coffre et marqué **valide** on-chain. L'émetteur paie les frais testnet de 5 XLM dans la même transaction.

## Étape 6 : Le vérifier

La vérification est une lecture gratuite, ouverte à quiconque possède une API key :

\`\`\`ts
import { useVaultRead } from "@acta-team/credentials";

const { verifyVc, listVcIds, getVc } = useVaultRead();

const status = await verifyVc({
  owner: walletAddress,
  vcId: "employee-badge-001",
});
// { status: "valid", since: "..." }

const ids = await listVcIds({ owner: walletAddress });
const vc = await getVc({ owner: walletAddress, vcId: "employee-badge-001" });
\`\`\`

Ou depuis n'importe quel terminal, contre l'API :

\`\`\`bash
curl -X POST https://sandbox-api.acta.build/contracts/vault/verify-vc \\
  -H "X-ACTA-Key: your_key" \\
  -H "Content-Type: application/json" \\
  -d '{ "owner": "G...", "vcId": "employee-badge-001" }'
\`\`\`

## Composant complet

Le flux entier dans un seul handler :

\`\`\`tsx
"use client";
import {
  useActaClient,
  useVault,
  useCredential,
  useVaultRead,
} from "@acta-team/credentials";
import { signTransaction } from "@stellar/freighter-api";

export function IssueDemo({ wallet }: { wallet: string }) {
  const client = useActaClient();
  const { createVault } = useVault();
  const { issue } = useCredential();
  const { verifyVc } = useVaultRead();

  const sign = async (xdr: string, o: { networkPassphrase: string }) =>
    (await signTransaction(xdr, { networkPassphrase: o.networkPassphrase }))
      .signedTxXdr;

  const run = async () => {
    const identity = await client.getOrCreateIssuerIdentity({
      controller: wallet,
      signTransaction: sign,
    });

    try {
      await createVault({ owner: wallet, ownerDid: identity.did, signTransaction: sign });
    } catch {
      // vault already exists: fine
    }

    await issue({
      owner: wallet,
      vcId: "employee-badge-001",
      vcData: {
        "@context": ["https://www.w3.org/ns/credentials/v2"],
        type: ["VerifiableCredential"],
        credentialSubject: { id: identity.did, name: "Ada Lovelace" },
      },
      issuer: wallet,
      signTransaction: sign,
    });

    const status = await verifyVc({ owner: wallet, vcId: "employee-badge-001" });
    console.log(status); // { status: "valid", ... }
  };

  return <button onClick={run}>Issue credential</button>;
}
\`\`\`

## Aller plus loin

- **[Sécurité et Modèle de Données](doc:security)** - ce qui est on-chain, ce qui est chiffré, qui signe quoi
- **[Erreurs](doc:api-errors)** - chaque code d'erreur HTTP et comment le gérer
- **[Opérations de Credentials](doc:api-credentials)** - émission en lot, révocation
- **Mainnet** : basculez \`baseURL\` vers \`mainNet\`, créez une API key mainnet et assurez-vous que le wallet émetteur détient de l'**USDC avec une trustline** (les frais sont de 1 USDC par credential)
    `,
};
