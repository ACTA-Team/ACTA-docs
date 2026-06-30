import type { DocPage } from "@/@types/docs";

export const useVaultRead: DocPage = {
  slug: "useVaultRead",
  title: "useVaultRead",
  section: "Credentials SDK",
  tocItems: [
    "Function",
    "listVcIds",
    "Arguments",
    "Return Value",
    "Example",
    "getVc",
    "verifyVc",
    "Notes",
  ],
  content: `
# useVaultRead

Hook for reading vault data: list credential IDs, get credentials, verify credentials.

> **Single-tenant vaults (v0.4.0):** read methods take \`owner\` and derive the vault. Pass the optional \`userSalt\` (32-byte hex, default all-zero) to target a non-canonical vault.

## Function

\`\`\`ts
useVaultRead(): {
  listVcIds: (args: ListVcIdsArgs) => Promise<string[]>;
  getVc: (args: GetVcArgs) => Promise<unknown | null>;
  verifyVc: (args: VerifyVcArgs) => Promise<VaultVerifyVcResponse>;
}
\`\`\`

## listVcIds

Lists credential IDs owned by an owner.

### Arguments

\`\`\`ts
{
  owner: string;                   // Stellar public key of the owner (vault derived from it)
  userSalt?: string;               // 32-byte salt (hex) selecting the owner's vault; defaults to all-zero
}
\`\`\`

### Return Value

- \`Promise<string[]>\`: Array of credential IDs

### Example

\`\`\`ts
import { useVaultRead } from "@acta-team/credentials";

const { listVcIds } = useVaultRead();

const vcIds = await listVcIds({
  owner: "G..."
});
// vcIds: ["credential-1", "credential-2", ...]
\`\`\`

## getVc

Gets a credential from the vault.

### Arguments

\`\`\`ts
{
  owner: string;                   // Stellar public key of the owner (vault derived from it)
  vcId: string;                    // Unique credential identifier
  userSalt?: string;               // 32-byte salt (hex) selecting the owner's vault; defaults to all-zero
}
\`\`\`

### Return Value

- \`Promise<unknown | null>\`: Credential data or \`null\` if not found

### Example

\`\`\`ts
import { useVaultRead } from "@acta-team/credentials";

const { getVc } = useVaultRead();

const vc = await getVc({
  owner: "G...",
  vcId: "credential-123"
});

if (vc) {
  console.log("Credential found:", vc);
} else {
  console.log("Credential not found");
}
\`\`\`

## verifyVc

Verifies the status of a credential in the vault.

### Arguments

\`\`\`ts
{
  owner: string;                   // Stellar public key of the owner (vault derived from it)
  vcId: string;                    // Unique credential identifier
  userSalt?: string;               // 32-byte salt (hex) selecting the owner's vault; defaults to all-zero
}
\`\`\`

### Return Value

\`\`\`ts
Promise<{
  status: "valid" | "revoked";
  since?: string;                  // ISO date since when it's been in that state (optional)
}>
\`\`\`

### Example

\`\`\`ts
import { useVaultRead } from "@acta-team/credentials";

const { verifyVc } = useVaultRead();

const verification = await verifyVc({
  owner: "G...",
  vcId: "credential-123"
});

console.log(\`Status: \${verification.status}\`); // "valid" or "revoked"
if (verification.since) {
  console.log(\`Since: \${verification.since}\`);
}
\`\`\`

## Notes

- All these operations are **read-only** and do not require signing transactions
- Methods automatically handle different API response formats
- \`getVc\` returns \`null\` if the credential does not exist in the vault
- \`verifyVc\` always returns a result with the current status of the credential
    `,
};
