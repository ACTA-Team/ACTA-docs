import type { DocPage } from "@/@types/docs";

export const useCredential: DocPage = {
  slug: "useCredential",
  title: "useCredential",
  section: "Credentials SDK",
  tocItems: [
    "Function",
    "Issuer identity (did:stellar)",
    "issue",
    "Arguments",
    "Signer Type",
    "Return Value",
    "Example",
    "revoke",
    "Transaction Flow",
    "Notes",
  ],
  content: `
# useCredential

Hook for credential operations: issue and revoke.

## Function

\`\`\`ts
useCredential(): {
  issue: (args: IssueArgs) => Promise<{ txId: string }>;
  revoke: (args: RevokeArgs) => Promise<{ txId: string }>;
}
\`\`\`

## Issuer identity (did:stellar)

Issuing requires the issuer to control a **registered, resolvable \`did:stellar\`** whose on-chain controller equals the issuer account. The SDK auto-onboards this for you: **\`getOrCreateIssuerIdentity\`** resolves the issuer's existing \`did:stellar\` or registers a new one before issuance, so \`issue\` works without you wiring up DID registration. Bare wallet addresses / \`did:pkh\` are no longer accepted as the issuer DID.

## issue

Issues a credential (stores it in the owner's derived vault and marks it as valid). The on-chain fee (default 1 USDC, paid by the issuer) is charged at this step.

### Arguments

\`\`\`ts
{
  owner: string;                    // Vault owner: G-account or C smart-wallet contract id (vault derived from it)
  vcId: string;                     // Unique credential identifier
  vcData: string | object;          // Credential data (JSON string or object). @context is added automatically when missing
  issuer: string;                   // Stellar public key of the issuer
  issuerDid?: string;               // Resolvable did:stellar of the issuer; auto-onboarded via getOrCreateIssuerIdentity when omitted
  signTransaction: Signer;          // Function that signs the unsigned XDR returned by ACTA prepare
  userSalt?: string;                // 32-byte salt (hex) selecting the owner's vault; defaults to all-zero
  sourcePublicKey?: string;         // G-account signer (omit for defaults)
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
import { useCredential } from "@acta-team/credentials";

const { issue } = useCredential();

const { txId } = await issue({
  owner: "G...",
  vcId: "credential-123",
  vcData: JSON.stringify({
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://www.w3.org/ns/credentials/examples/v2"
    ],
    type: ["VerifiableCredential"],
    credentialSubject: {
      id: "did:stellar:testnet:znfxngsh46vkyqu6inrx4omphi",
      name: "John Doe"
    }
  }),
  issuer: "G...",
  issuerDid: "did:stellar:testnet:znfxngsh46vkyqu6inrx4omphi", // auto-onboarded when omitted
  signTransaction: async (xdr, { networkPassphrase }) => {
    // Sign the XDR with your wallet
    return signedXdr;
  }
  // userSalt omitted → canonical vault for this owner
});
\`\`\`

## revoke

Revokes a credential in the owner's derived vault.

### Arguments

\`\`\`ts
{
  owner: string;                   // Vault owner (G-account or C smart-wallet); sent so the SDK can derive the vault
  vcId: string;                    // Unique identifier of the credential to revoke
  signTransaction: Signer;         // Function that signs the unsigned XDR returned by ACTA prepare
  date?: string;                   // Revocation date in ISO format (optional)
  userSalt?: string;               // Selects the owner's vault; defaults to all-zero
  sourcePublicKey?: string;        // Explicit G signer (omit for defaults)
}
\`\`\`

### Return Value

- \`Promise<{ txId: string }>\`: Transaction ID after sending to the network

### Example

\`\`\`ts
import { useCredential } from "@acta-team/credentials";

const { revoke } = useCredential();

const { txId } = await revoke({
  owner: "G...",
  vcId: "credential-123",
  signTransaction: async (xdr, { networkPassphrase }) => {
    // Sign the XDR with your wallet
    return signedXdr;
  },
  date: new Date().toISOString() // Optional
});
\`\`\`

## Transaction Flow

All methods follow the same flow:

1. **Prepare**: Calls the API to get an unsigned XDR and the network passphrase
2. **Sign**: Uses \`signTransaction\` to sign the XDR with the provided passphrase
3. **Submit**: Sends the signed XDR to the API to be processed on the network

The hook automatically handles the distinction between prepare and submit responses using internal type guards.

## Notes

- The \`issue\` method stores the credential in the owner's derived vault and marks it as valid in a single transaction; the on-chain fee is charged then.
- The \`revoke\` method sends \`owner\` so the SDK derives the correct vault, and requires the owner to sign the transaction.
- The revocation date is automatically set to the current date if not provided.
    `,
};
