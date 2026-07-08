import type { DocPage } from "@/@types/docs";

export const gettingStarted: DocPage = {
  slug: "dapp-getting-started",
  title: "Getting Started",
  section: "dApp",
  tocItems: [
    "Step 1: Connect Wallet",
    "Step 2: Create API Key",
    "Step 3: Register Issuer DID",
    "Step 4: Create Vault",
    "Step 5: Issue Credentials",
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
3. Select your Stellar wallet - **Freighter**, **Albedo**, or **WalletConnect** are supported
4. Approve the connection request
5. Choose your network (in **Settings**):
   - **Testnet** - For testing and development (the default)
   - **Mainnet** - For production use

Once connected, your wallet address will be displayed in the header. On your first visit, a guided tour walks you through the main sections.

## Step 2: Create Your API Key

Vault and credential operations in the dApp go through the ACTA API, so you need an API key first.

1. Navigate to the **API Keys** section
2. Click **Create API Key** and give it a name (optional)
3. **Save the key immediately** - it is shown only once

You get **one key per wallet per network**; creating a new one replaces (revokes) the previous key. The dApp keeps the key only for your current browser session.

## Step 3: Register Your Issuer DID

To issue credentials, the issuer needs a registered, resolvable **did:stellar** identity (not a bare wallet address). The dApp guides you through registering it with a single wallet signature. If you only plan to receive and hold credentials, you can skip this step.

## Step 4: Create Your Personal Vault

Your vault is your secure storage for credentials. Each owner has their own dedicated single-tenant vault contract, deployed deterministically by a factory behind the scenes.

1. Navigate to the **Dashboard** or **Vault** section
2. If you do not have a vault yet, you will see an option to create one
3. Click **Create Vault** or **Initialize Vault**
4. Sign the transaction with your wallet
5. Your vault is now ready to store credentials

The vault creation is a one-time operation per wallet address.

## Step 5: Issue Credentials

Once you have a vault, you can start issuing credentials. Issuing charges an on-chain fee paid by the issuer (mainnet: 1 USDC per credential; testnet: 5 XLM).

1. Navigate to the **Issue** section
2. Choose a **template** (built-in templates like course certificates or memberships, or your own custom template)
3. Fill in the template's fields and the **recipient wallet address** (whose vault will receive the credential)
4. Click **Issue Credential**
5. Sign the transaction with your wallet
6. The credential will be stored in the recipient's vault and marked as valid

The owner's vault receives the credential, while the holder is identified by a DID (the \`credentialSubject.id\`); there is no separate wallet or holder field. The credential is now on-chain and can be verified.

## Managing Issuer Access

Issuance is **open by default**: any issuer can issue credentials to your vault without prior approval, so you do not need to pre-authorize anyone. You only manage access when you want to stop a specific issuer.

1. Go to the **Issuer Access** section in the sidebar
2. Enter the issuer you want to **block**
3. Click **Block Issuer** and sign the transaction with your wallet
4. The blocked issuer can no longer issue credentials to your vault
5. To restore access, **unblock** the issuer at any time

**Note:** Because issuance is open by default, blocking is a deny-by-exception control. Anyone can issue to you unless you explicitly block them.

## Next Steps

After completing the initial setup:

- **View Credentials** - Go to the **Vault** section to see all your credentials
- **Share Credentials** - Use the share feature to create links and QR codes with selected credential fields; anyone can check them on the public verification page
- **Notifications** - Watch the bell icon for events like new credentials received
- **Explore Settings** - Switch network or language (English, Spanish, French)

For more information about specific features, see the [dApp Features](doc:dapp-features) guide.
    `,
};
