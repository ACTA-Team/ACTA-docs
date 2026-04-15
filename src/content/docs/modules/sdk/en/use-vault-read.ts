import type { DocPage } from "@/@types/docs";

export const useVaultRead: DocPage = {
  slug: "useVaultRead",
  title: "useVaultRead",
  section: "React SDK",
  tocItems: [
    "Function",
    "listVcIds",
    "Arguments",
    "Return Value",
    "Example",
    "getVc",
    "getVcParent",
    "verifyVc",
    "Notes",
  ],
  content: `
# useVaultRead

Hook for reading vault data: list credential IDs, get credentials, get parent VC info, verify credentials.

## Function

\`\`\`ts
useVaultRead(): {
  listVcIds: (args: ListVcIdsArgs) => Promise<string[]>;
  getVc: (args: GetVcArgs) => Promise<unknown | null>;
  getVcParent: (args: GetVcParentArgs) => Promise<{ owner: string; vc_id: string } | null>;
  verifyVc: (args: VerifyVcArgs) => Promise<VaultVerifyVcResponse>;
}
\`\`\`

## listVcIds

Lists credential IDs owned by an owner.

### Arguments

\`\`\`ts
{
  owner: string;                   // Stellar public key of the owner
  contractId?: string;             // Contract ID (optional, uses the configured default)
}
\`\`\`

### Return Value

- \`Promise<string[]>\`: Array of credential IDs

### Example

\`\`\`ts
import { useVaultRead } from "@acta-team/acta-sdk";

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
  owner: string;                   // Stellar public key of the owner
  vcId: string;                    // Unique credential identifier
  contractId?: string;             // Contract ID (optional, uses the configured default)
}
\`\`\`

### Return Value

- \`Promise<unknown | null>\`: Credential data or \`null\` if not found

### Example

\`\`\`ts
import { useVaultRead } from "@acta-team/acta-sdk";

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

## getVcParent

Gets the parent VC info for a linked credential. Returns \`null\` if the credential has no parent link.

### Arguments

\`\`\`ts
{
  owner: string;                   // Stellar public key of the owner
  vcId: string;                    // Unique credential identifier
  contractId?: string;             // Contract ID (optional, uses the configured default)
}
\`\`\`

### Return Value

\`\`\`ts
Promise<{ owner: string; vc_id: string } | null>
\`\`\`

- Returns an object with the parent VC's \`owner\` address and \`vc_id\`, or \`null\` if the credential is not linked to a parent.

### Example

\`\`\`ts
import { useVaultRead } from "@acta-team/acta-sdk";

const { getVcParent } = useVaultRead();

const parent = await getVcParent({
  owner: "G...",
  vcId: "linked-credential-456"
});

if (parent) {
  console.log("Parent owner:", parent.owner);
  console.log("Parent VC ID:", parent.vc_id);
} else {
  console.log("This credential has no parent link");
}
\`\`\`

## verifyVc

Verifies the status of a credential in the vault.

### Arguments

\`\`\`ts
{
  owner: string;                   // Stellar public key of the owner
  vcId: string;                    // Unique credential identifier
  contractId?: string;             // Contract ID (optional, uses the configured default)
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
import { useVaultRead } from "@acta-team/acta-sdk";

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
- \`getVcParent\` returns \`null\` if the credential has no parent link
- \`verifyVc\` always returns a result with the current status of the credential
    `,
};
