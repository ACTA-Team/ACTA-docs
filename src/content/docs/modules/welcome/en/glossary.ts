import type { DocPage } from "@/@types/docs";

export const glossary: DocPage = {
  slug: "glossary",
  title: "Glossary",
  section: "Help",
  tocItems: [
    "Credentials",
    "Identity",
    "Vaults & contracts",
    "Transactions & API",
  ],
  content: `
# Glossary

The terms used across this documentation, in plain language.

## Credentials

- **Verifiable Credential (VC)**: a digital attestation (a certificate, badge, receipt, membership...) whose existence and status can be checked on the blockchain. ACTA follows the W3C Verifiable Credentials data model.
- **Issuer**: the wallet that creates and signs a credential, and pays the on-chain issuance fee. Must have a registered did:stellar identity.
- **Holder / subject**: who the credential is about. Identified by a DID in the credential's \`credentialSubject.id\` field.
- **Owner**: the wallet whose vault stores the credential. Often the holder's wallet, but formally it is whoever owns the receiving vault.
- **\`vcId\`**: the unique identifier of a credential inside a vault (max 64 characters).
- **\`vcData\`**: the credential's content (JSON). It is encrypted before being stored on-chain.
- **Revocation**: marking a credential as no longer valid. Done by the vault owner; the status change is recorded on-chain with a date.
- **Selective disclosure**: sharing only some fields of a credential (what the dApp's share feature does).

## Identity

- **DID (Decentralized Identifier)**: a portable identity identifier that no central authority controls. Looks like \`did:stellar:testnet:znfx...\`.
- **did:stellar**: ACTA's DID method on Stellar; the mandatory identity for issuers. See the [DID section](doc:did-overview).
- **Controller**: the Stellar wallet that controls a DID and signs its changes.
- **DID Document**: the public document you get when resolving a DID: its keys, their purposes, and services.
- **Resolver**: a service that turns a DID string into its DID Document. ACTA hosts one at \`did.acta.build\`.
- **Deactivation / tombstone**: permanently disabling a DID. Irreversible; the DID then resolves as an empty "tombstone" document.

## Vaults & contracts

- **Vault (\`vc-vault\`)**: the smart contract that stores one owner's credentials. Single-tenant: one vault per owner.
- **Factory (\`vc-vault-factory\`)**: the contract that deploys vaults (one factory per network) and quotes the issuance fee.
- **\`userSalt\`**: an optional 32-byte value that lets one owner have more than one vault. Omitted, you get the canonical vault.
- **Deny-by-exception**: ACTA's issuer model: anyone can issue into a vault unless the owner explicitly blocks them.
- **Sponsored vault**: a vault deployed and paid for by a third party (the sponsor) on behalf of an owner. The HTTP route requires an admin API key; admin keys are provisioned by the ACTA team, not self-service (reach out via [Support](doc:support)).
- **Soroban**: Stellar's smart-contract platform, where ACTA's contracts run.
- **Contract ID**: a Soroban contract address, starting with \`C...\`.

## Transactions & API

- **XDR**: the binary format of a Stellar transaction. The API returns transactions as unsigned XDR strings.
- **Prepare/submit**: ACTA's two-step write flow: the API prepares an unsigned XDR, your wallet signs it, and you submit the signed XDR back.
- **\`signTransaction\` / Signer**: the callback your app provides so the user's wallet signs an XDR.
- **Network passphrase**: a string identifying the Stellar network (testnet or mainnet) that must be used when signing.
- **API key**: the credential for calling the ACTA API, sent in the \`X-ACTA-Key\` header. One per wallet per network, expires in 6 months.
- **Rate limit**: the per-key cap on requests per minute; exceeding it returns HTTP 429.
- **Idempotency key**: an optional header that makes retrying a write safe: the same key replays the original response instead of executing twice.
- **Trustline**: a Stellar account's opt-in to hold a token such as USDC. Mainnet issuers need a USDC trustline to pay the fee.
- **Testnet / Mainnet**: Stellar's free test network vs the production network. ACTA runs both, with separate keys, DIDs, and vaults.
    `,
};
