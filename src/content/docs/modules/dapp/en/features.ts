import type { DocPage } from "@/@types/docs";

export const features: DocPage = {
  slug: "dapp-features",
  title: "Features",
  section: "dApp",
  tocItems: [
    "Issue Credentials",
    "Vault Management",
    "Share Credentials",
    "Issuer Access",
    "API Key Management",
  ],
  content: `
# dApp Features

Detailed overview of the documented features available in the ACTA dApp.

## Issue Credentials

Create and issue verifiable credentials to a Stellar wallet address. Issuing requires a registered, resolvable \`did:stellar\` whose on-chain controller is your issuing wallet.

### How to Issue

1. Navigate to **Issue** in the sidebar
2. Fill in the credential form:
   - **Credential ID**: Unique identifier for the credential
   - **Credential Data**: JSON data containing the credential information
   - **Owner**: Stellar wallet address (G...) whose vault will receive the credential
   - **Issuer DID**: Your registered \`did:stellar\`
3. Click **Issue Credential**
4. Sign the transaction (an on-chain fee, default 1 USDC, is charged to you as the issuer)

The credential is automatically:
- Stored in the owner's single-tenant vault
- Marked as valid on-chain
- Available for verification

## Vault Management

Your vault is your personal credential storage. Each owner has their own single-tenant vault, deployed by the \`vc-vault-factory\`.

### View Credentials

1. Go to **Vault** or **Credentials** section
2. See all credentials stored in your vault
3. Use search and filters to find specific credentials
4. Click on a credential to view details

### Credential Actions

- **View Details** - See full credential information
- **Share** - Create a shareable link with selective field disclosure
- **Revoke** - Revoke a credential if needed
- **Verify** - Check the on-chain status

## Share Credentials

Share credentials by choosing which fields to reveal.

### Sharing Flow

1. Go to your **Vault** and select a credential
2. Click **Share**
3. Choose which fields to reveal
4. Copy the share link

The share link contains the selected revealed fields needed by the recipient.

## Issuer Access

Issuance is **open by default** — anyone with a registered \`did:stellar\` can issue to your vault. You control access by **blocking** issuers you do not want (deny-by-exception).

### Block an Issuer

1. Go to the **Issuer access** section
2. Enter the wallet address of the issuer
3. Click **Block Issuer**
4. Sign the transaction

### Manage Blocked Issuers

- View all blocked issuers
- **Unblock** an issuer to restore its (default) access
- Blocked issuers cannot create credentials in your vault; everyone else can issue freely

## API Key Management

Create and manage API keys for programmatic access to the ACTA API.

### Create API Key

1. Navigate to **API Keys** section
2. Choose network (Testnet or Mainnet)
3. Enter a name for your API key (optional)
4. Click **Create API Key**
5. **Save the key immediately** - it will not be shown again

API keys have:
- **Standard role** - Access to public endpoints
- **6-month expiration** - Keys expire after 6 months
- **Network-specific** - Separate keys for testnet and mainnet

### Use API Keys

Use your API key in API requests:

\`\`\`
X-ACTA-Key: your_api_key_here
\`\`\`

See the [API Reference](#api-overview) for all available endpoints.
    `,
};
