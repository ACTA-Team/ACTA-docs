import type { DocPage } from "@/@types/docs";

export const keys: DocPage = {
  slug: "api-keys",
  title: "API Keys",
  section: "API Reference",
  tocItems: [
    "Getting a Key",
    "Using the Key",
    "Scopes",
    "Limits",
    "Losing a Key",
  ],
  content: `
# API Keys

Every protected endpoint is authenticated with an API key. Keys are issued from
the [ACTA dApp](https://dapp.acta.build/), not from this API.

## Getting a Key

1. Open the [ACTA dApp](https://dapp.acta.build/) and connect your Stellar wallet.
2. Sign in. You will be asked to sign a challenge transaction, which is built so
   it can never be submitted (sequence number 0, a two minute time bound, and a
   single operation that changes nothing). Signing it moves no funds.
3. Create a key from the API keys section.

The key is bound to the wallet that signed in, and that binding is what makes
ownership checks meaningful: a key can only act for its own wallet, and nobody
can mint a key naming a wallet they do not control.

Keys are issued with the **standard** role and **do not expire**. The secret is
shown once and cannot be recovered, so store it before closing the dialog.

> Create a separate key per network. A key belongs to the network it was created
> on, and using a testnet key against mainnet answers \`401\`.

## Using the Key

Send it on every protected request:

\`\`\`bash
curl https://sandbox-api.acta.build/contracts/version \\
  -H "X-ACTA-Key: your_api_key_here"
\`\`\`

\`X-ACTA-Key\` is the canonical header. \`x-api-key\` and
\`Authorization: Bearer <key>\` are also accepted. Keys are 64-character hex
strings with no prefix.

Keep the key server-side. Anything shipped to a browser is readable by anyone
who opens the developer tools, and a bearer key proves possession rather than
identity: whoever holds the string can use it.

## Scopes

A key can optionally be narrowed to a subset of what its role allows:

| Scope | Allows |
| --- | --- |
| \`credentials:issue\` | Issue and batch-issue credentials |
| \`credentials:read\` | Read a vault's credential list and payloads |
| \`credentials:revoke\` | Revoke a credential |
| \`vault:write\` | Create a vault and push credentials into it |
| \`vault:admin\` | Change vault ownership, DID and issuer permissions |
| \`sponsor\` | Pay for someone else's vault deployment |

Choose them when creating the key. An integration that issues but must never
read a holder's credentials is the common case.

A key with **no** scopes is unrestricted within its role, so keys created before
scopes existed keep working unchanged. A request missing a required scope
answers \`403 insufficient_scope\`.

## Limits

- Up to **5 active keys per wallet, per network**. Revoke one you no longer use
  before creating another.
- Creating a key never revokes an existing one, so rotating on one device does
  not break the others.

## Losing a Key

The secret is stored hashed and cannot be shown again. If you lose it, revoke
that key from the dApp and create a new one. Revocation takes effect on the next
request; there is no grace period.
    `,
};
