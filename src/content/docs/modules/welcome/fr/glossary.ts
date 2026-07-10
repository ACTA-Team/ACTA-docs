import type { DocPage } from "@/@types/docs";

export const glossary: DocPage = {
  slug: "glossary",
  title: "Glossaire",
  section: "Aide",
  tocItems: [
    "Credentials",
    "Identité",
    "Coffres et contrats",
    "Transactions et API",
  ],
  content: `
# Glossaire

Les termes utilisés dans cette documentation, en langage simple.

## Credentials

- **Verifiable Credential (VC)** : une attestation numérique (un certificat, un badge, un reçu, une adhésion...) dont l'existence et le statut peuvent être vérifiés sur la blockchain. ACTA suit le modèle de données W3C Verifiable Credentials.
- **Émetteur** : le wallet qui crée et signe un credential, et paie les frais d'émission on-chain. Doit avoir une identité did:stellar enregistrée.
- **Titulaire / sujet** : la personne concernée par le credential. Identifié par un DID dans le champ \`credentialSubject.id\` du credential.
- **Propriétaire** : le wallet dont le coffre stocke le credential. Souvent le wallet du titulaire, mais formellement c'est celui qui possède le coffre destinataire.
- **\`vcId\`** : l'identifiant unique d'un credential à l'intérieur d'un coffre (64 caractères max).
- **\`vcData\`** : le contenu du credential (JSON). Il est chiffré avant d'être stocké on-chain.
- **Révocation** : marquer un credential comme n'étant plus valide. Effectuée par le propriétaire du coffre ; le changement de statut est enregistré on-chain avec une date.
- **Divulgation sélective** : partager seulement certains champs d'un credential (ce que fait la fonctionnalité de partage du dApp).

## Identité

- **DID (Decentralized Identifier)** : un identifiant d'identité portable qu'aucune autorité centrale ne contrôle. Ressemble à \`did:stellar:testnet:znfx...\`.
- **did:stellar** : la méthode DID d'ACTA sur Stellar ; l'identité obligatoire pour les émetteurs. Voir la [section DID](doc:did-overview).
- **Contrôleur** : le wallet Stellar qui contrôle un DID et signe ses modifications.
- **DID Document** : le document public que vous obtenez en résolvant un DID : ses clés, leurs usages et ses services.
- **Resolver** : un service qui transforme une chaîne DID en son DID Document. ACTA en héberge un sur \`did.acta.build\`.
- **Désactivation / tombstone** : désactiver définitivement un DID. Irréversible ; le DID se résout alors comme un document "tombstone" vide.

## Coffres et contrats

- **Coffre (\`vc-vault\`)** : le smart contract qui stocke les credentials d'un propriétaire. Single-tenant : un coffre par propriétaire.
- **Factory (\`vc-vault-factory\`)** : le contrat qui déploie les coffres (une factory par réseau) et cote les frais d'émission.
- **\`userSalt\`** : une valeur optionnelle de 32 octets qui permet à un propriétaire d'avoir plus d'un coffre. Omise, vous obtenez le coffre canonique.
- **Deny-by-exception** : le modèle d'émetteurs d'ACTA : n'importe qui peut émettre dans un coffre sauf si le propriétaire le bloque explicitement.
- **Coffre sponsorisé** : un coffre déployé et payé par un tiers (le sponsor) pour le compte d'un propriétaire. La route HTTP exige une API key admin ; les clés admin sont provisionnées par l'équipe ACTA, pas en libre-service (contactez le [Support](doc:support)).
- **Soroban** : la plateforme de smart contracts de Stellar, où s'exécutent les contrats d'ACTA.
- **Contract ID** : une adresse de contrat Soroban, commençant par \`C...\`.

## Transactions et API

- **XDR** : le format binaire d'une transaction Stellar. L'API renvoie les transactions sous forme de chaînes XDR non signées.
- **Prepare/submit** : le flux d'écriture en deux étapes d'ACTA : l'API prépare un XDR non signé, votre wallet le signe, et vous soumettez le XDR signé en retour.
- **\`signTransaction\` / Signer** : le callback fourni par votre application pour que le wallet de l'utilisateur signe un XDR.
- **Network passphrase** : une chaîne identifiant le réseau Stellar (testnet ou mainnet) qui doit être utilisée lors de la signature.
- **API key** : le credential pour appeler l'API ACTA, envoyé dans l'en-tête \`X-ACTA-Key\`. Une par wallet et par réseau, expire au bout de 6 mois.
- **Limite de débit** : le plafond de requêtes par minute par clé ; le dépasser renvoie HTTP 429.
- **Clé d'idempotence** : un en-tête optionnel qui rend le réessai d'une écriture sûr : la même clé rejoue la réponse originale au lieu d'exécuter deux fois.
- **Trustline** : l'adhésion d'un compte Stellar pour détenir un jeton comme l'USDC. Les émetteurs mainnet ont besoin d'une trustline USDC pour payer les frais.
- **Testnet / Mainnet** : le réseau de test gratuit de Stellar vs le réseau de production. ACTA exécute les deux, avec des clés, des DID et des coffres séparés.
    `,
};
