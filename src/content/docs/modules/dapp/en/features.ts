import type { DocPage } from "@/@types/docs";

export const features: DocPage = {
  slug: "dapp-features",
  title: "Features",
  section: "dApp",
  tocItems: [
    "Issue Credentials",
    "Vault Management",
    "Share Credentials",
    "Authorize Issuers",
    "API Key Management",
    "Zero-Knowledge Proofs",
  ],
  content: `
# dApp Features

Detailed overview of all features available in the ACTA dApp.

## Issue Credentials

Create and issue verifiable credentials to any Stellar wallet address.

### How to Issue

1. Navigate to **Issue** in the sidebar
2. Fill in the credential form:
   - **Credential ID**: Unique identifier for the credential
   - **Credential Data**: JSON data containing the credential information
   - **Owner**: Stellar wallet address (G...) that will receive the credential
   - **Issuer DID** (optional): Your DID identifier
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

Share credentials with privacy-preserving zero-knowledge proofs.

### Sharing Flow

1. Go to your **Vault** and select a credential
2. Click **Share** button
3. Choose which fields to reveal
4. Select a ZK predicate (optional):
   - Age ≥ 18
   - Not expired
   - Status is valid
5. Click **Generate ZK Proof**
6. Copy the share link

The share link contains:
- Only the selected revealed fields
- ZK proof for the selected predicate
- Public signals for verification

Recipients can verify the proof without seeing your private data.

## Authorize Issuers

Control who can issue credentials to your vault.

### Authorize an Issuer

1. Go to **Authorize** section
2. Enter the wallet address of the issuer
3. Click **Authorize Issuer**
4. Sign the transaction

### Manage Authorized Issuers

- View all authorized issuers
- Revoke authorization if needed
- Only authorized issuers can create credentials in your vault

## API Key Management

Create and manage API keys for programmatic access to the ACTA API.

### Create API Key

1. Navigate to **API Keys** section
2. Choose network (Testnet or Mainnet)
3. Enter a name for your API key (optional)
4. Click **Create API Key**
5. **Save the key immediately** - it won't be shown again

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

## Zero-Knowledge Proofs

The dApp supports sharing credentials with zero-knowledge proofs for privacy-preserving verification. See the [Zero-Knowledge Proofs](#zk-overview) section for detailed information about ZK circuits, predicates, and verification.
    `,
};
