import type { DocPage } from "@/@types/docs";

export const mainnetGuide: DocPage = {
  slug: "mainnet-guide",
  title: "Passer en Mainnet",
  section: "Guides",
  tocItems: [
    "Ce qui change sur mainnet",
    "Checklist",
    "1. Pointer vers l'API mainnet",
    "2. Créer une API key mainnet",
    "3. Approvisionner l'émetteur en USDC",
    "4. Enregistrer votre DID sur mainnet",
    "5. Recréer le coffre",
    "Adresses des contrats mainnet",
    "Pièges à éviter",
  ],
  content: `
# Passer en Mainnet

Tout ce que vous avez validé sur testnet fonctionne à l'identique sur mainnet, mais quatre choses changent : l'URL de base, l'API key, le jeton des frais et le réseau où vivent votre DID et votre coffre. Cette page est la checklist.

## Ce qui change sur mainnet

| Aspect | Testnet | Mainnet |
|--------|---------|---------|
| URL de base | \`https://sandbox-api.acta.build\` | \`https://production-api.acta.build\` |
| Constante SDK | \`testNet\` | \`mainNet\` |
| Frais d'émission | 5 XLM (natif, aucune trustline requise) | **1 USDC** par credential |
| Prérequis des frais | Compte testnet approvisionné | **Trustline USDC + solde** sur le wallet émetteur |
| Registre DID | Registre testnet | Registre mainnet (un DID testnet ne fonctionne **pas**) |
| Coffre | Déployé sur testnet | Doit être déployé à nouveau sur mainnet |
| Swagger UI | \`/docs\` disponible | Désactivé (renvoie 404) |

## Checklist

1. Basculer l'URL de base / la constante SDK vers mainnet
2. Créer une API key **mainnet**
3. Doter le wallet émetteur d'une **trustline USDC et d'un solde**
4. Enregistrer (ou auto-embarquer) le **DID de l'émetteur sur mainnet**
5. Créer le **coffre du propriétaire sur mainnet**
6. Émettre un credential de test et le vérifier

## 1. Pointer vers l'API mainnet

\`\`\`tsx
import { ActaConfig, mainNet } from "@acta-team/credentials";

<ActaConfig baseURL={mainNet} apiKey={process.env.NEXT_PUBLIC_ACTA_API_KEY_MAINNET}>
\`\`\`

Le SDK déduit le réseau de l'URL. Si vous utilisez des clés via variables d'environnement, la variable spécifique au réseau est \`ACTA_API_KEY_MAINNET\`.

## 2. Créer une API key mainnet

Les clés sont **par réseau** : votre clé testnet ne fonctionne pas sur mainnet. Dans le [dApp ACTA](https://dapp.acta.build), basculez le réseau sur **Mainnet** dans les Paramètres, puis créez la clé dans **API Keys**. Mêmes règles que sur testnet : une clé par wallet, affichée une seule fois, expiration de 6 mois.

## 3. Approvisionner l'émetteur en USDC

Sur mainnet, les frais d'émission sont de **1 USDC par credential**, facturés on-chain à l'**émetteur** au moment de l'émission via le \`quote_fee\` de la factory. Cela exige que le wallet émetteur :

- Ait une **trustline vers USDC** (le Stellar Asset Contract utilisé par la factory est \`CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75\`)
- Détienne assez d'USDC pour couvrir les credentials que vous prévoyez d'émettre

Les deux échecs d'émission mainnet les plus courants sont exactement ceux-là : *"trustline entry is missing for account"* et *"balance is not sufficient"*. Les deux proviennent du contrat de jeton USDC, pas du coffre ; voir les **[Erreurs de contrat](doc:contract-errors)**.

## 4. Enregistrer votre DID sur mainnet

Les DID sont liés à un réseau : \`did:stellar:testnet:...\` ne se résout pas sur mainnet, et l'utiliser renvoie \`issuerDid_network_mismatch\`.

- **Avec le SDK** : l'auto-onboarding stocke les identités par réseau, donc le premier \`issue\` contre l'API mainnet crée et enregistre un nouveau \`did:stellar:mainnet:...\` avec une seule signature de wallet.
- **Avec le dApp ou la bibliothèque DID** : enregistrez explicitement sur mainnet (voir la **[section DID](doc:did-overview)**). Le registre mainnet est \`CD6LSWW5ZSXOO5WAIHKQLQ262TW7BPI37PNEVMMA273BAPC65NN2AYXQ\`.

## 5. Recréer le coffre

Les coffres aussi sont par réseau : la factory sur mainnet déploie un coffre neuf pour votre wallet la première fois que vous appelez \`createVault\` (ou \`POST /contracts/vault/create\`) contre l'API mainnet. La dérivation d'adresse suit le même schéma déterministe \`(factory, owner, userSalt)\`.

## Adresses des contrats mainnet

| Contrat | ID |
|----------|----|
| vc-vault-factory | \`CCWNZ6UMUXCDOVP2TWOPVLI4KP4VY4YF7VKPN6XLYVHNFAT24NDB33CX\` |
| did:stellar registry | \`CD6LSWW5ZSXOO5WAIHKQLQ262TW7BPI37PNEVMMA273BAPC65NN2AYXQ\` |
| Hash WASM du template vc-vault | \`2bd0323a98acb8469606808368da6c79824f2dd8391494b94ddbeb3d22c1a957\` |
| USDC (jeton des frais, SAC) | \`CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75\` |

Network passphrase : \`Public Global Stellar Network ; September 2015\`. Vous pouvez confirmer tout cela à l'exécution avec le \`GET /config\` public sur l'URL de base mainnet.

## Pièges à éviter

- **Swagger est réservé au testnet** : \`https://production-api.acta.build/docs\` renvoie 404 par conception. Explorez sur testnet ; les chemins sont identiques.
- **Réseau du wallet** : assurez-vous que votre wallet (par ex. Freighter) est basculé sur Mainnet avant de signer, sinon les signatures porteront la mauvaise network passphrase.
- **Conservez les deux environnements** : rien ne vous force à abandonner testnet ; utilisez-le pour le développement indéfiniment et réservez les clés mainnet à la production.
    `,
};
