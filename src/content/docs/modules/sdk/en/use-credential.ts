import type { DocPage } from "@/@types/docs";

export const useCredential: DocPage = {
  slug: "useCredential",
  title: "useCredential",
  section: "React SDK",
  tocItems: [
    "Function",
    "issue",
    "Arguments",
    "Signer Type",
    "Return Value",
    "Example",
    "issueLinked",
    "revoke",
    "Transaction Flow",
    "Notes",
  ],
  content: `
# useCredential

Hook for credential operations: issue, issueLinked, and revoke.

## Function

\`\`\`ts
useCredential(): {
  issue: (args: IssueArgs) => Promise<{ txId: string }>;
  issueLinked: (args: IssueLinkedArgs) => Promise<{ txId: string }>;
  revoke: (args: RevokeArgs) => Promise<{ txId: string }>;
}
\`\`\`

## issue

Issues a credential (stores it in the vault and marks it as valid).

### Arguments

\`\`\`ts
{
  owner: string;                    // Stellar public key of the credential owner (vault owner)
  vcId: string;                    // Unique credential identifier
  vcData: string | object;         // Credential data (JSON string or object). @context is added automatically
  issuer: string;                  // Stellar public key of the issuer
  holder: string;                  // Wallet address or DID of the holder (DID is built automatically from address)
  issuerDid?: string;              // Wallet address or DID of the issuer (DID is built automatically from address)
  signTransaction: Signer;         // Function that signs the unsigned XDR
  contractId?: string;             // Contract ID (optional, uses the configured default)
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
      id: "did:pkh:stellar:testnet:G...",
      name: "John Doe"
    }
  }),
  issuer: "G...",
  holder: "G...",        // wallet address — DID is built automatically
  issuerDid: "G...",     // wallet address — DID is built automatically
  signTransaction: async (xdr, { networkPassphrase }) => {
    // Sign the XDR with your wallet
    return signedXdr;
  }
});
\`\`\`

## issueLinked

Issues a credential linked to a parent VC. The parent VC must exist and be valid in its vault. This enables hierarchical credential relationships.

### Arguments

\`\`\`ts
{
  owner: string;                    // Stellar public key of the credential owner (vault owner)
  vcId: string;                    // Unique credential identifier
  vcData: string | object;         // Credential data (JSON string or object). @context is added automatically
  issuer: string;                  // Stellar public key of the issuer
  holder: string;                  // Wallet address or DID of the holder (DID is built automatically from address)
  issuerDid?: string;              // Wallet address or DID of the issuer (DID is built automatically from address)
  signTransaction: Signer;         // Function that signs the unsigned XDR
  contractId?: string;             // Contract ID (optional, uses the configured default)
  parentOwner: string;             // Stellar public key of the parent VC owner
  parentVcId: string;              // Identifier of the parent VC
}
\`\`\`

### Return Value

- \`Promise<{ txId: string }>\`: Transaction ID after sending to the network

### Example

\`\`\`ts
import { useCredential } from "@acta-team/credentials";

const { issueLinked } = useCredential();

const { txId } = await issueLinked({
  owner: "G...",
  vcId: "linked-credential-456",
  vcData: JSON.stringify({
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://www.w3.org/ns/credentials/examples/v2"
    ],
    type: ["VerifiableCredential"],
    credentialSubject: {
      id: "did:pkh:stellar:testnet:G...",
      name: "John Doe",
      certification: "Advanced Level"
    }
  }),
  issuer: "G...",
  holder: "G...",
  signTransaction: async (xdr, { networkPassphrase }) => {
    // Sign the XDR with your wallet
    return signedXdr;
  },
  parentOwner: "G...",             // Owner of the parent VC
  parentVcId: "credential-123"    // ID of the parent VC
});
\`\`\`

## revoke

Revokes a credential.

### Arguments

\`\`\`ts
{
  owner: string;                   // Stellar public key of the credential owner
  vcId: string;                    // Unique identifier of the credential to revoke
  signTransaction: Signer;         // Function that signs the unsigned XDR
  date?: string;                   // Revocation date in ISO format (optional, uses current date by default)
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
- The \`revoke\` method requires the \`owner\` to sign the transaction
- The revocation date is automatically set to the current date if not provided
    `,
};
