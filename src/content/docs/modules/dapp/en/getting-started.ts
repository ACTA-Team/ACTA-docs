import type { DocPage } from "@/@types/docs";

export const gettingStarted: DocPage = {
  slug: "dapp-getting-started",
  title: "Getting Started",
  section: "dApp",
  tocItems: [
    "Step 1: Connect Wallet",
    "Step 2: Create Vault",
    "Step 3: Register Your DID",
    "Step 4: Issue Credentials",
    "Managing Issuer Access",
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

Your vault is your secure storage for credentials. Each owner has their **own** single-tenant vault, deployed deterministically by the \`vc-vault-factory\`.

1. Navigate to the **Dashboard** or **Vault** section
2. If you do not have a vault yet, you will see an option to create one
3. Click **Create Vault** or **Initialize Vault**
4. Sign the transaction with your wallet
5. Your vault is now ready to store credentials

The vault creation is a one-time operation per owner.

## Step 3: Register Your DID

To **issue** credentials you must control a registered, resolvable \`did:stellar\`. (You do **not** need to authorize issuers — issuance is open by default.)

1. Go to the **My DID** section in the sidebar
2. If you do not have a \`did:stellar\` yet, follow the prompt to register one
3. Sign the registration transaction with your wallet
4. Your DID's on-chain controller must match your issuing wallet — the dApp handles this binding for you

**Note:** Bare wallet addresses and \`did:pkh\` are no longer accepted as the issuer DID.

## Step 4: Issue Credentials

Once you have a vault and a registered DID, you can start issuing credentials.

1. Navigate to the **Issue** section
2. Fill in the credential form:
   - **Credential ID** - Unique identifier
   - **Credential Data** - The actual credential information in JSON format
   - **Owner** - The wallet address whose vault will receive the credential
   - **Issuer DID** - Your registered \`did:stellar\`
3. Click **Issue Credential**
4. Sign the transaction with your wallet (an on-chain fee, default 1 USDC, is charged to you as the issuer)
5. The credential will be stored in the owner's vault and marked as valid

The credential is now on-chain and can be verified.

## Managing Issuer Access

Because issuance is open by default, you only act when you want to **stop** an issuer:

1. Go to the **Issuer access** section in the sidebar
2. Enter the wallet address of the issuer you want to block, then **Block** it (and sign)
3. To restore access later, **Unblock** the issuer (and sign)

Blocked issuers can no longer write to your vault; everyone else can issue freely.

## Next Steps

After completing the initial setup:

- **View Credentials** - Go to the **Vault** or **Credentials** section to see all your credentials
- **Share Credentials** - Use the share feature to create links with selected credential fields
- **Manage API Keys** - Create API keys for programmatic access in the **API Keys** section
- **Explore Tutorials** - Check out the **Tutorials** section for guided walkthroughs

For more information about specific features, see the [dApp Features](#dapp-features) guide.
    `,
};
