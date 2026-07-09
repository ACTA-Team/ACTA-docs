import type { DocPage } from "@/@types/docs";

export const quickstart: DocPage = {
  slug: "quickstart",
  title: "Quickstart",
  section: "Guides",
  tocItems: [
    "What you will build",
    "Prerequisites",
    "Step 1: Get an API key",
    "Step 2: Install and configure the SDK",
    "Step 3: Get your issuer DID",
    "Step 4: Create the vault",
    "Step 5: Issue a credential",
    "Step 6: Verify it",
    "Full component",
    "Going further",
  ],
  content: `
# Quickstart

From zero to a **verifiable credential on Stellar testnet**, end to end, with one continuous example. Everything below also works over the raw REST API (see **[API Overview](doc:api-overview)**); this guide uses the React SDK because it is the shortest path.

## What you will build

A small React flow that:

1. Gets an issuer identity (**did:stellar**) automatically
2. Creates a single-tenant **vault** for your wallet
3. **Issues** a credential into it
4. **Verifies** it on-chain

## Prerequisites

- A Stellar wallet (e.g. **Freighter**) with a **testnet** account funded with XLM: use **[Stellar Lab (fund account)](https://lab.stellar.org/account/fund)**. On testnet, issuing charges an on-chain fee of **5 XLM** per credential, paid by the issuer.
- A React / Next.js app (the SDK hooks need React 18+; \`ActaConfig\` is a client component).
- Node 18+ for tooling.

## Step 1: Get an API key

Create your key in the **[ACTA dApp](https://dapp.acta.build)** → **API Keys** → **Create API Key**, on the **Testnet** network, and save it immediately (it is shown only once).

> Key facts: one key per wallet per network, standard role, 6-month expiry. The public creation endpoint is origin-restricted, so the dApp is the way to get one. Details in **[API Keys](doc:api-keys)**.

## Step 2: Install and configure the SDK

\`\`\`bash
npm install @acta-team/credentials
\`\`\`

Wrap your app with the provider, pointing at testnet:

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

You also need a \`signTransaction\` callback that asks your wallet to sign. With Freighter:

\`\`\`ts
import { signTransaction } from "@stellar/freighter-api";

const sign = async (xdr: string, opts: { networkPassphrase: string }) => {
  const res = await signTransaction(xdr, {
    networkPassphrase: opts.networkPassphrase,
  });
  return res.signedTxXdr;
};
\`\`\`

## Step 3: Get your issuer DID

Issuing requires a registered, resolvable **did:stellar**. The SDK can create and register it for you with **one wallet signature** (auto-onboarding):

\`\`\`ts
import { useActaClient } from "@acta-team/credentials";

const client = useActaClient();

const identity = await client.getOrCreateIssuerIdentity({
  controller: walletAddress, // your G... account
  signTransaction: sign,
});
// identity.did => "did:stellar:testnet:..."
\`\`\`

The first call generates an Ed25519 key, registers the DID on-chain, and persists the identity (IndexedDB in the browser). Subsequent calls just read it back, no prompt. Full details in the **[DID section](doc:did-overview)**.

## Step 4: Create the vault

Each owner has one deterministic, single-tenant vault. Creating it is a one-time operation per wallet:

\`\`\`ts
import { useVault } from "@acta-team/credentials";

const { createVault } = useVault();

const { txId } = await createVault({
  owner: walletAddress,
  ownerDid: identity.did,
  signTransaction: sign,
});
\`\`\`

If the vault already exists at that address, the on-chain deploy fails with "already deployed": that is safe to treat as success.

## Step 5: Issue a credential

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

One wallet signature later, the credential is encrypted, stored in the vault, and marked **valid** on-chain. The issuer pays the 5 XLM testnet fee in the same transaction.

## Step 6: Verify it

Verification is a free read, open to anyone with an API key:

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

Or from any terminal against the API:

\`\`\`bash
curl -X POST https://api.testnet.acta.build/contracts/vault/verify-vc \\
  -H "X-ACTA-Key: your_key" \\
  -H "Content-Type: application/json" \\
  -d '{ "owner": "G...", "vcId": "employee-badge-001" }'
\`\`\`

## Full component

The whole flow in one handler:

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

## Going further

- **[Security & Data Model](doc:security)** - what is on-chain, what is encrypted, who signs what
- **[Errors](doc:api-errors)** - every HTTP error code and how to handle it
- **[Credential Operations](doc:api-credentials)** - batch issuance, revocation
- **Mainnet**: switch \`baseURL\` to \`mainNet\`, create a mainnet API key, and make sure the issuer wallet holds **USDC with a trustline** (the fee is 1 USDC per credential)
    `,
};
