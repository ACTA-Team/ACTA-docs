import type { DocPage } from "@/@types/docs";

export const features: DocPage = {
  slug: "dapp-features",
  title: "Features",
  section: "dApp",
  tocItems: [
    "Issue Credentials",
    "Credential Templates",
    "Vault Management",
    "Share Credentials",
    "Issuer Access",
    "API Key Management",
    "Notifications",
    "Settings",
  ],
  content: `
# dApp Features

Detailed overview of the documented features available in the ACTA dApp.

## Issue Credentials

Create and issue verifiable credentials to a Stellar wallet address. Issuing requires a registered, resolvable **did:stellar** issuer identity (not a bare wallet address) and charges an on-chain fee paid by the issuer (mainnet: 1 USDC per credential; testnet: 5 XLM).

### How to Issue

1. Navigate to **Issue** in the sidebar
2. Choose a **template** and fill in its fields:
   - **Recipient**: Stellar wallet address (G...) whose vault will receive the credential
   - **Template fields**: The credential's information, defined by the template
3. Click **Issue Credential**
4. Sign the transaction

The credential is automatically:
- Stored in the recipient's vault
- Marked as valid on-chain
- Available for verification

## Credential Templates

The issue form is template-driven, so you never have to write raw JSON:

- **Built-in templates**: ready-made schemas such as course certificates, event attendance, memberships, employee badges, payment receipts, KYC verification, access passes, skill badges, warranties, escrow and contribution records
- **Custom templates**: build your own template with the fields you need; custom templates are saved locally in your browser and always include the base fields (subject DID, issue date, expiration)

## Vault Management

Your vault is your personal credential storage. Each wallet has an isolated vault.

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
3. Choose which fields to reveal (select all or pick individually)
4. Copy the share link or scan the generated **QR code**

The share link opens a **public verification page** - no wallet or account needed. The page shows only the revealed fields and always checks the credential's status **on-chain**, so a revoked credential shows as revoked even through an old link. Share links expire after a limited time (7 days by default).

## Issuer Access

Issuance is open by default: anyone can issue credentials to your vault unless you block them. Use this section to block issuers you want to stop and unblock them later to restore access.

### Block an Issuer

1. Go to the **Issuer Access** section
2. Enter the issuer you want to block
3. Click **Block Issuer**
4. Sign the transaction

### Manage Blocked Issuers

- View all blocked issuers
- Unblock an issuer to restore their access
- Anyone can issue to you unless you block them (deny-by-exception)

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
- **One per wallet** - creating a new key replaces (revokes) your previous one; the dApp keeps the secret only for the current browser session

### Use API Keys

Use your API key in API requests:

\`\`\`
X-ACTA-Key: your_api_key_here
\`\`\`

See the [API Reference](doc:api-overview) for all available endpoints.

## Notifications

The dApp includes in-app notifications (bell icon in the header and a dedicated **Notifications** page): you are notified about events on your wallet, such as receiving a new credential. You can mark notifications as read individually or all at once.

## Settings

The **Settings** section (also available as an overlay) includes:

- **Account**: your wallet address, a stellar.expert link, and the **network switch** (testnet / mainnet)
- **Language**: English, Spanish, or French
- **About**: version and links to the documentation, Discord, and GitHub
    `,
};
