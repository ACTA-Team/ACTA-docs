import type { DocPage } from "@/@types/docs";

export const gettingStarted: DocPage = {
  slug: "dapp-getting-started",
  title: "Getting Started",
  section: "dApp",
  tocItems: [
    "Step 1: Connect Wallet",
    "Step 2: Create Vault",
    "Step 3: Manage Issuer Access",
    "Step 4: Issue Credentials",
    "Next Steps",
  ],
  content: `
# Getting Started with ACTA dApp

Follow these steps to start using the ACTA dApp for credential management.

## Step 1: Connect Wallet and Choose Network

The first step is to connect your Stellar wallet to the dApp.

1. Visit [https://dapp.acta.build](https://dapp.acta.build)
2. Click the wallet connection button
3. Select your Stellar wallet
4. Approve the connection request
5. Choose your network:
   - **Testnet** - For testing and development
   - **Mainnet** - For production use

Once connected, your wallet address will be displayed in the header.

## Step 2: Create Your Personal Vault

Your vault is your secure storage for credentials. Each owner has their own dedicated single-tenant vault contract, deployed deterministically by a factory behind the scenes.

1. Navigate to the **Dashboard** or **Vault** section
2. If you do not have a vault yet, you will see an option to create one
3. Click **Create Vault** or **Initialize Vault**
4. Sign the transaction with your wallet
5. Your vault is now ready to store credentials

The vault creation is a one-time operation per wallet address.

## Step 3: Manage Issuer Access

Issuance is **open by default**: any issuer can issue credentials to your vault without prior approval, so you do not need to pre-authorize anyone. You only manage access when you want to stop a specific issuer.

1. Go to the **Issuer Access** section in the sidebar
2. Enter the issuer you want to **block**
3. Click **Block Issuer** and sign the transaction with your wallet
4. The blocked issuer can no longer issue credentials to your vault
5. To restore access, **unblock** the issuer at any time

**Note:** Because issuance is open by default, blocking is a deny-by-exception control. Anyone can issue to you unless you explicitly block them.

## Step 4: Issue Credentials

Once you have a vault, you can start issuing credentials. Issuing requires the issuer to have a registered, resolvable **did:stellar** identity (not a bare wallet address); the dApp guides you through setting this up. Issuing also charges an on-chain fee paid by the issuer (on mainnet, 1 USDC per credential).

1. Navigate to the **Issue** section
2. Fill in the credential form:
   - **Credential ID** - Unique identifier
   - **Credential Data** - The actual credential information in JSON format
   - **Owner** - The wallet address whose vault will receive the credential
   - **Issuer DID** (optional) - Your registered did:stellar issuer identity
3. Click **Issue Credential**
4. Sign the transaction with your wallet
5. The credential will be stored in the owner's vault and marked as valid

The owner's vault receives the credential, while the holder is identified by a DID (the \`credentialSubject.id\`); there is no separate wallet or holder field. The credential is now on-chain and can be verified.

## Next Steps

After completing the initial setup:

- **View Credentials** - Go to the **Vault** or **Credentials** section to see all your credentials
- **Share Credentials** - Use the share feature to create links with selected credential fields
- **Manage API Keys** - Create API keys for programmatic access in the **API Keys** section
- **Explore Tutorials** - Check out the **Tutorials** section for guided walkthroughs

For more information about specific features, see the [dApp Features](#dapp-features) guide.
    `,
};
