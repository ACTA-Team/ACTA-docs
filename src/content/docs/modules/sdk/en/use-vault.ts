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
    "authorizeIssuer",
    "revokeIssuer",
    "Transaction Flow",
  ],
  content: `
# useVault

Hook for vault operations: create vault, authorize issuer, revoke issuer.

## Function

\`\`\`ts
useVault(): {
  createVault: (args: CreateVaultArgs) => Promise<{ txId: string }>;
  authorizeIssuer: (args: AuthorizeIssuerArgs) => Promise<{ txId: string }>;
  revokeIssuer: (args: RevokeIssuerArgs) => Promise<{ txId: string }>;
}
\`\`\`

## createVault

Creates (initializes) a vault for an owner.

### Arguments

\`\`\`ts
{
  owner: string;                    // Vault owner: classic account (G...) or smart-wallet contract (C...)
  ownerDid: string;                  // DID URI associated with the owner
  signTransaction: Signer;          // Function that signs prepare XDR payloads
  sourcePublicKey?: string;          // Explicit G signer; defaults to owner for G vaults when omitted (C vaults rely on relay per API rules)
  contractId?: string;              // Contract ID (optional, uses the configured default)
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
  ownerDid: "did:stellar:G...",
  signTransaction: async (xdr, { networkPassphrase }) => {
    // Sign the XDR with your wallet
    return signedXdr;
  }
});
\`\`\`

## authorizeIssuer

Authorizes an issuer in a vault.

### Arguments

\`\`\`ts
{
  owner: string;                    // Vault owner (G or C)
  issuer: string;                   // Issuer account to authorize
  signTransaction: Signer;
  sourcePublicKey?: string;
  contractId?: string;
}
\`\`\`

### Return Value

- \`Promise<{ txId: string }>\`: Transaction ID after sending to the network

### Example

\`\`\`ts
import { useVault } from "@acta-team/credentials";

const { authorizeIssuer } = useVault();

const { txId } = await authorizeIssuer({
  owner: "G...",
  issuer: "G...",
  signTransaction: async (xdr, { networkPassphrase }) => {
    // Sign the XDR with your wallet
    return signedXdr;
  }
});
\`\`\`

## revokeIssuer

Revokes (removes) an authorized issuer from a vault.

### Arguments

\`\`\`ts
{
  owner: string;                    // Vault owner (G or C)
  issuer: string;                   // Issuer to revoke
  signTransaction: Signer;
  sourcePublicKey?: string;
  contractId?: string;
}
\`\`\`

### Return Value

- \`Promise<{ txId: string }>\`: Transaction ID after sending to the network

### Example

\`\`\`ts
import { useVault } from "@acta-team/credentials";

const { revokeIssuer } = useVault();

const { txId } = await revokeIssuer({
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
