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

Create and issue verifiable credentials to a Stellar wallet address. Issuing requires a registered, resolvable **did:stellar** issuer identity (not a bare wallet address) and charges an on-chain fee paid by the issuer (on mainnet, 1 USDC per credential).

### How to Issue

1. Navigate to **Issue** in the sidebar
2. Fill in the credential form:
   - **Credential ID**: Unique identifier for the credential
   - **Credential Data**: JSON data containing the credential information
   - **Owner**: Stellar wallet address (G...) whose vault will receive the credential
   - **Issuer DID** (optional): Your registered did:stellar issuer identity
3. Click **Issue Credential**
4. Sign the transaction

The credential is automatically:
- Stored in the owner's vault
- Marked as valid on-chain
- Available for verification

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
3. Choose which fields to reveal
4. Copy the share link

The share link contains the selected revealed fields needed by the recipient.

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

### Use API Keys

Use your API key in API requests:

\`\`\`
X-ACTA-Key: your_api_key_here
\`\`\`

See the [API Reference](#api-overview) for all available endpoints.
    `,
};
