import type { DocPage } from "@/@types/docs";

export const useVault: DocPage = {
  slug: "useVault",
  title: "useVault",
  section: "Credentials SDK",
  tocItems: [
    "Function",
    "createVault",
    "Arguments",
    "Signer Type",
    "Return Value",
    "Example",
    "denyIssuer",
    "allowIssuer",
    "Transaction Flow",
  ],
  content: `
# useVault

Hook for vault operations: create vault, block (deny) an issuer, unblock (allow) an issuer.

> **Deny-by-exception (v0.4.0):** issuance is open by default. Owners no longer authorize issuers — they **block** them with \`denyIssuer\` and **unblock** them with \`allowIssuer\`. \`authorizeIssuer\` / \`revokeIssuer\` still exist as **aliases** (authorize→allow, revoke→deny) for backward compatibility.

## Function

\`\`\`ts
useVault(): {
  createVault: (args: CreateVaultArgs) => Promise<{ txId: string }>;
  denyIssuer: (args: DenyIssuerArgs) => Promise<{ txId: string }>;
  allowIssuer: (args: AllowIssuerArgs) => Promise<{ txId: string }>;
  // aliases (back-compat):
  authorizeIssuer: (args: AllowIssuerArgs) => Promise<{ txId: string }>;  // → allowIssuer
  revokeIssuer: (args: DenyIssuerArgs) => Promise<{ txId: string }>;      // → denyIssuer
}
\`\`\`

## createVault

Deploys a single-tenant vault for an owner via the factory.

### Arguments

\`\`\`ts
{
  owner: string;                    // Vault owner: classic account (G...) or smart-wallet contract (C...)
  ownerDid: string;                 // DID URI associated with the owner
  signTransaction: Signer;          // Function that signs prepare XDR payloads
  userSalt?: string;                // 32-byte salt (hex) selecting the vault; defaults to all-zero (canonical vault)
  sourcePublicKey?: string;         // Explicit G signer; defaults to owner for G vaults when omitted
}
\`\`\`

### Signer Type

\`\`\`ts
type Signer = (
  unsignedXdr: string,
  opts: { networkPassphrase: string }
) => Promise<string>;
\`\`\`

### Return Value

- \`Promise<{ txId: string }>\`: Transaction ID after sending to the network

### Example

\`\`\`ts
import { useVault } from "@acta-team/credentials";

const { createVault } = useVault();

const { txId } = await createVault({
  owner: "G...",
  ownerDid: "did:stellar:testnet:znfxngsh46vkyqu6inrx4omphi",
  signTransaction: async (xdr, { networkPassphrase }) => {
    // Sign the XDR with your wallet
    return signedXdr;
  }
  // userSalt omitted → canonical vault for this owner
});
\`\`\`

## denyIssuer

Blocks an issuer so it can no longer write to the owner's vault.

### Arguments

\`\`\`ts
{
  owner: string;                    // Vault owner (G or C)
  issuer: string;                   // Issuer account to block
  signTransaction: Signer;
  userSalt?: string;                // Selects the vault; defaults to all-zero
  sourcePublicKey?: string;
}
\`\`\`

### Return Value

- \`Promise<{ txId: string }>\`: Transaction ID after sending to the network

### Example

\`\`\`ts
import { useVault } from "@acta-team/credentials";

const { denyIssuer } = useVault();

const { txId } = await denyIssuer({
  owner: "G...",
  issuer: "G...",
  signTransaction: async (xdr, { networkPassphrase }) => {
    // Sign the XDR with your wallet
    return signedXdr;
  }
});
\`\`\`

## allowIssuer

Removes an issuer from the deny list, restoring its (default) ability to issue.

### Arguments

\`\`\`ts
{
  owner: string;                    // Vault owner (G or C)
  issuer: string;                   // Issuer to unblock
  signTransaction: Signer;
  userSalt?: string;                // Selects the vault; defaults to all-zero
  sourcePublicKey?: string;
}
\`\`\`

### Return Value

- \`Promise<{ txId: string }>\`: Transaction ID after sending to the network

### Example

\`\`\`ts
import { useVault } from "@acta-team/credentials";

const { allowIssuer } = useVault();

const { txId } = await allowIssuer({
  owner: "G...",
  issuer: "G...",
  signTransaction: async (xdr, { networkPassphrase }) => {
    // Sign the XDR with your wallet
    return signedXdr;
  }
});
\`\`\`

## Transaction Flow

All methods follow the same flow:

1. **Prepare**: Calls the API to get an unsigned XDR and the network passphrase
2. **Sign**: Uses \`signTransaction\` to sign the XDR with the provided passphrase
3. **Submit**: Sends the signed XDR to the API to be processed on the network

The hook automatically handles the distinction between prepare and submit responses using internal type guards.
    `,
};
