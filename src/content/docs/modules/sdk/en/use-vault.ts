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

Issuance is open by default, so you only act on exceptions: \`denyIssuer\` blocks an issuer for the vault and \`allowIssuer\` unblocks one that was previously denied. The legacy method names \`authorizeIssuer\` and \`revokeIssuer\` remain available as **back-compat aliases** (\`authorizeIssuer\` ≙ \`allowIssuer\`, \`revokeIssuer\` ≙ \`denyIssuer\` - they call the API's back-compat routes with the same semantics).

## Function

\`\`\`ts
useVault(): {
  createVault: (args: CreateVaultArgs) => Promise<{ txId: string }>;
  denyIssuer: (args: DenyIssuerArgs) => Promise<{ txId: string }>;
  allowIssuer: (args: AllowIssuerArgs) => Promise<{ txId: string }>;
  // back-compat aliases:
  authorizeIssuer: (args: AllowIssuerArgs) => Promise<{ txId: string }>; // same semantics as allowIssuer
  revokeIssuer: (args: DenyIssuerArgs) => Promise<{ txId: string }>;     // same semantics as denyIssuer
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
  userSalt?: string;                 // 32-byte salt; default 32 zero bytes = one canonical vault per owner
  contractId?: string;              // Contract ID (optional, uses the configured default)
}
\`\`\`

The vault address is derived from \`(factory, owner, userSalt)\`. Omit \`userSalt\` for the owner's canonical vault; pass a distinct 32-byte salt to deploy an additional vault for the same owner.

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

## denyIssuer

Blocks an issuer for a vault. Because issuance is open by default, this is how an owner stops a specific issuer from writing credentials. Also exposed as \`revokeIssuer\` for back-compat.

### Arguments

\`\`\`ts
{
  owner: string;                    // Vault owner (G or C)
  issuer: string;                   // Issuer account to block
  signTransaction: Signer;
  sourcePublicKey?: string;         // Defaults to owner for G owners; ignored for C owners (relayer signs)
  userSalt?: string;                // 32-byte salt selecting a non-default vault (optional)
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

Unblocks an issuer that was previously denied, restoring its default ability to write credentials to the vault. Also exposed as \`authorizeIssuer\` for back-compat.

### Arguments

\`\`\`ts
{
  owner: string;                    // Vault owner (G or C)
  issuer: string;                   // Issuer to unblock
  signTransaction: Signer;
  sourcePublicKey?: string;         // Defaults to owner for G owners; ignored for C owners (relayer signs)
  userSalt?: string;                // 32-byte salt selecting a non-default vault (optional)
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
