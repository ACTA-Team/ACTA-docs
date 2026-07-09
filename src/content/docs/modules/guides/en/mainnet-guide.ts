import type { DocPage } from "@/@types/docs";

export const mainnetGuide: DocPage = {
  slug: "mainnet-guide",
  title: "Going to Mainnet",
  section: "Guides",
  tocItems: [
    "What changes on mainnet",
    "Checklist",
    "1. Point at the mainnet API",
    "2. Create a mainnet API key",
    "3. Fund the issuer with USDC",
    "4. Register your DID on mainnet",
    "5. Recreate the vault",
    "Mainnet contract addresses",
    "Gotchas",
  ],
  content: `
# Going to Mainnet

Everything you validated on testnet works the same on mainnet, but four things change: the base URL, the API key, the fee token, and the network your DID and vault live on. This page is the checklist.

## What changes on mainnet

| Aspect | Testnet | Mainnet |
|--------|---------|---------|
| Base URL | \`https://api.testnet.acta.build\` | \`https://api.mainnet.acta.build\` |
| SDK constant | \`testNet\` | \`mainNet\` |
| Issuance fee | 5 XLM (native, no trustline needed) | **1 USDC** per credential |
| Fee prerequisite | Funded testnet account | **USDC trustline + balance** on the issuer wallet |
| DID registry | Testnet registry | Mainnet registry (a testnet DID does **not** work) |
| Vault | Deployed on testnet | Must be deployed again on mainnet |
| Swagger UI | \`/docs\` available | Disabled (returns 404) |

## Checklist

1. Switch the base URL / SDK constant to mainnet
2. Create a **mainnet** API key
3. Give the issuer wallet a **USDC trustline and balance**
4. Register (or auto-onboard) the issuer **DID on mainnet**
5. Create the owner's **vault on mainnet**
6. Issue a test credential and verify it

## 1. Point at the mainnet API

\`\`\`tsx
import { ActaConfig, mainNet } from "@acta-team/credentials";

<ActaConfig baseURL={mainNet} apiKey={process.env.NEXT_PUBLIC_ACTA_API_KEY_MAINNET}>
\`\`\`

The SDK infers the network from the URL. If you use env-based keys, the network-specific variable is \`ACTA_API_KEY_MAINNET\`.

## 2. Create a mainnet API key

Keys are **per network**: your testnet key does not work on mainnet. In the [ACTA dApp](https://dapp.acta.build), switch the network to **Mainnet** in Settings, then create the key in **API Keys**. Same rules as testnet: one key per wallet, shown once, 6-month expiry.

## 3. Fund the issuer with USDC

On mainnet the issuance fee is **1 USDC per credential**, charged on-chain to the **issuer** at issue time via the factory's \`quote_fee\`. That requires the issuer wallet to:

- Have a **trustline to USDC** (the Stellar Asset Contract used by the factory is \`CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75\`)
- Hold enough USDC to cover the credentials you plan to issue

The two most common mainnet issuance failures are exactly these: *"trustline entry is missing for account"* and *"balance is not sufficient"*. Both come from the USDC token contract, not from the vault; see **[Contract errors](doc:contract-errors)**.

## 4. Register your DID on mainnet

DIDs are network-scoped: \`did:stellar:testnet:...\` does not resolve on mainnet, and using it returns \`issuerDid_network_mismatch\`.

- **With the SDK**: auto-onboarding stores identities per network, so the first \`issue\` against the mainnet API mints and registers a new \`did:stellar:mainnet:...\` with one wallet signature.
- **With the dApp or the DID library**: register on mainnet explicitly (see the **[DID section](doc:did-overview)**). The mainnet registry is \`CD6LSWW5ZSXOO5WAIHKQLQ262TW7BPI37PNEVMMA273BAPC65NN2AYXQ\`.

## 5. Recreate the vault

Vaults are per network too: the factory on mainnet deploys a fresh vault for your wallet the first time you call \`createVault\` (or \`POST /contracts/vault/create\`) against the mainnet API. Address derivation is the same deterministic \`(factory, owner, userSalt)\` scheme.

## Mainnet contract addresses

| Contract | ID |
|----------|----|
| vc-vault-factory | \`CCWNZ6UMUXCDOVP2TWOPVLI4KP4VY4YF7VKPN6XLYVHNFAT24NDB33CX\` |
| did:stellar registry | \`CD6LSWW5ZSXOO5WAIHKQLQ262TW7BPI37PNEVMMA273BAPC65NN2AYXQ\` |
| vc-vault template WASM hash | \`2bd0323a98acb8469606808368da6c79824f2dd8391494b94ddbeb3d22c1a957\` |
| USDC (fee token, SAC) | \`CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75\` |

Network passphrase: \`Public Global Stellar Network ; September 2015\`. You can confirm all of this at runtime with the public \`GET /config\` on the mainnet base URL.

## Gotchas

- **Swagger is testnet-only**: \`https://api.mainnet.acta.build/docs\` returns 404 by design. Explore on testnet; the paths are identical.
- **Wallet network**: make sure your wallet (e.g. Freighter) is switched to Mainnet before signing, or signatures will carry the wrong network passphrase.
- **Keep both environments**: nothing forces you to abandon testnet; use it for development forever and reserve mainnet keys for production.
    `,
};
