import type { DocPage } from "@/@types/docs";

export const gettingStarted: DocPage = {
  slug: "dapp-getting-started",
  title: "Getting Started",
  section: "dApp",
  tocItems: [
    "Step 1: Connect Wallet",
    "Step 2: Create Vault",
    "Step 3: Authorize Issuers",
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

Your vault is your secure storage for credentials. Each wallet address has its own isolated vault.

1. Navigate to the **Dashboard** or **Vault** section
2. If you do not have a vault yet, you will see an option to create one
3. Click **Create Vault** or **Initialize Vault**
4. Sign the transaction with your wallet
5. Your vault is now ready to store credentials

The vault creation is a one-time operation per wallet address.

## Step 3: Authorize Issuers

Before you can receive credentials, you need to authorize wallets that can issue credentials to your vault.

1. Go to the **Authorize** section in the sidebar
2. Enter the wallet address of the issuer you want to authorize
3. Click **Authorize Issuer**
4. Sign the transaction with your wallet
5. The authorized issuer will appear in your authorized issuers list

**Note:** Only authorized issuers can create credentials in your vault. This gives you control over who can issue credentials to you.

## Step 4: Issue Credentials

Once you have a vault and authorized issuers, you can start issuing credentials.

1. Navigate to the **Issue** section
2. Fill in the credential form:
   - **Credential ID** - Unique identifier
   - **Credential Data** - The actual credential information in JSON format
   - **Owner** - The wallet address that will receive the credential
   - **Issuer DID** (optional) - Your issuer DID
3. Click **Issue Credential**
4. Sign the transaction with your wallet
5. The credential will be stored in the owner's vault and marked as valid

The credential is now on-chain and can be verified.

## Next Steps

After completing the initial setup:

- **View Credentials** - Go to the **Vault** or **Credentials** section to see all your credentials
- **Share Credentials** - Use the share feature to create links with selected credential fields
- **Manage API Keys** - Create API keys for programmatic access in the **API Keys** section
- **Explore Tutorials** - Check out the **Tutorials** section for guided walkthroughs

For more information about specific features, see the [dApp Features](#dapp-features) guide.
    `,
};
