import type { DocPage } from "@/@types/docs";

export const useCredential: DocPage = {
  slug: "useCredential",
  title: "useCredential",
  section: "Credentials SDK",
  tocItems: [
    "Function",
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

## issue

Issues a credential (stores it in the vault and marks it as valid).

### Arguments

\`\`\`ts
{
  owner: string;                    // Vault owner: G-account or C smart-wallet contract id
  vcId: string;                    // Unique credential identifier
  vcData: string | object;         // Credential data (JSON string or object). @context is added automatically when missing
  issuer: string;                  // Stellar public key of the issuer
  issuerDid?: string;              // Issuer DID: a registered, resolvable did:stellar
  signTransaction: Signer;         // Function that signs the unsigned XDR returned by ACTA prepare
  sourcePublicKey?: string;        // G-account signer (omit for defaults; omit for relayer-signed C-owner flows per API)
  userSalt?: string;               // 32-byte salt selecting a non-default vault for the owner (optional)
  contractId?: string;             // Contract ID (optional, uses the configured default)
}
\`\`\`

The holder is expressed inside \`vcData\` as \`credentialSubject.id\` (a DID); there is no separate \`holder\` / wallet field. The \`issuerDid\` must be a registered, resolvable \`did:stellar\`; bare wallet addresses and \`did:pkh\` are no longer accepted. The SDK auto-onboards the issuer's \`did:stellar\` via \`getOrCreateIssuerIdentity\`, so integrators get issuer DID setup for free.

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
      id: "did:stellar:...",   // holder DID
      name: "John Doe"
    }
  }),
  issuer: "G...",
  issuerDid: "did:stellar:...",   // registered, resolvable did:stellar
  signTransaction: async (xdr, { networkPassphrase }) => {
    // Sign the XDR with your wallet
    return signedXdr;
  }
});
\`\`\`

## revoke

Revokes a credential. The call sends the \`owner\` to the API so the right vault is targeted.

### Arguments

\`\`\`ts
{
  owner: string;                   // Vault owner (G-account or C smart-wallet); sent to the API
  vcId: string;                    // Unique identifier of the credential to revoke
  signTransaction: Signer;         // Function that signs the unsigned XDR returned by ACTA prepare
  date?: string;                   // Revocation date in ISO format (optional)
  sourcePublicKey?: string;        // Explicit G signer (omit for defaults / relayer flows)
  userSalt?: string;               // 32-byte salt selecting a non-default vault for the owner (optional)
  contractId?: string;             // Contract ID (optional, uses the configured default)
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

- The \`issue\` method automatically stores the credential in the vault and marks it as valid in a single transaction
- The holder is \`credentialSubject.id\` inside \`vcData\` (a DID); there is no separate holder field
- The \`issuerDid\` must be a registered, resolvable \`did:stellar\`; the SDK auto-onboards it via \`getOrCreateIssuerIdentity\`
- The \`revoke\` method sends the \`owner\` to the API and requires the \`owner\` to sign the transaction
- The revocation date is automatically set to the current date if not provided
    `,
};
