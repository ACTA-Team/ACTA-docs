import type { DocPage } from "@/@types/docs";

export const useVault: DocPage = {
  slug: "useVault",
  title: "useVault",
  section: "Credentials SDK",
  tocItems: [
    "Fonction",
    "createVault",
    "Arguments",
    "Type Signer",
    "Valeur de retour",
    "Exemple",
    "denyIssuer",
    "allowIssuer",
    "Flux de transaction",
  ],
  content: `
# useVault

Hook pour les opérations de coffre : créer un coffre, bloquer (deny) un émetteur, débloquer (allow) un émetteur.

L'émission est ouverte par défaut, vous n'agissez donc que sur les exceptions : \`denyIssuer\` bloque un émetteur pour le coffre et \`allowIssuer\` débloque un émetteur précédemment refusé. Les anciens noms de méthodes \`authorizeIssuer\` et \`revokeIssuer\` restent disponibles comme **alias de rétrocompatibilité** (\`authorizeIssuer\` ≙ \`allowIssuer\`, \`revokeIssuer\` ≙ \`denyIssuer\` - ils appellent les routes de rétrocompatibilité de l'API avec la même sémantique).

## Fonction

\`\`\`ts
useVault(): {
  createVault: (args: CreateVaultArgs) => Promise<{ txId: string }>;
  denyIssuer: (args: DenyIssuerArgs) => Promise<{ txId: string }>;
  allowIssuer: (args: AllowIssuerArgs) => Promise<{ txId: string }>;
  // alias de rétrocompatibilité :
  authorizeIssuer: (args: AllowIssuerArgs) => Promise<{ txId: string }>; // même sémantique que allowIssuer
  revokeIssuer: (args: DenyIssuerArgs) => Promise<{ txId: string }>;     // même sémantique que denyIssuer
}
\`\`\`

## createVault

Crée (initialise) un coffre pour un propriétaire.

### Arguments

\`\`\`ts
{
  owner: string;                    // Propriétaire du coffre : compte classique (G...) ou contrat smart-wallet (C...)
  ownerDid: string;                  // URI du DID associé au propriétaire
  signTransaction: Signer;          // Fonction qui signe les payloads XDR du prepare
  sourcePublicKey?: string;          // Signataire G explicite ; par défaut le propriétaire pour les coffres G quand omis (les coffres C reposent sur le relais selon les règles de l'API)
  userSalt?: string;                 // Sel de 32 octets ; par défaut 32 octets à zéro = un coffre canonique par propriétaire
  contractId?: string;              // ID du contrat (optionnel, utilise la valeur par défaut configurée)
}
\`\`\`

L'adresse du coffre est dérivée de \`(factory, owner, userSalt)\`. Omettez \`userSalt\` pour le coffre canonique du propriétaire ; passez un sel distinct de 32 octets pour déployer un coffre supplémentaire pour le même propriétaire.

### Type Signer

\`\`\`ts
type Signer = (
  unsignedXdr: string,
  opts: { networkPassphrase: string }
) => Promise<string>;
\`\`\`

### Valeur de retour

- \`Promise<{ txId: string }>\` : ID de la transaction après envoi au réseau

### Exemple

\`\`\`ts
import { useVault } from "@acta-team/credentials";

const { createVault } = useVault();

const { txId } = await createVault({
  owner: "G...",
  ownerDid: "did:stellar:G...",
  signTransaction: async (xdr, { networkPassphrase }) => {
    // Signez le XDR avec votre wallet
    return signedXdr;
  }
});
\`\`\`

## denyIssuer

Bloque un émetteur pour un coffre. Comme l'émission est ouverte par défaut, c'est ainsi qu'un propriétaire empêche un émetteur spécifique d'écrire des credentials. Également exposé sous le nom \`revokeIssuer\` pour la rétrocompatibilité.

### Arguments

\`\`\`ts
{
  owner: string;                    // Propriétaire du coffre (G ou C)
  issuer: string;                   // Compte de l'émetteur à bloquer
  signTransaction: Signer;
  sourcePublicKey?: string;         // Par défaut le propriétaire pour les propriétaires G ; ignoré pour les propriétaires C (le relayer signe)
  userSalt?: string;                // Sel de 32 octets sélectionnant un coffre non par défaut (optionnel)
}
\`\`\`

### Valeur de retour

- \`Promise<{ txId: string }>\` : ID de la transaction après envoi au réseau

### Exemple

\`\`\`ts
import { useVault } from "@acta-team/credentials";

const { denyIssuer } = useVault();

const { txId } = await denyIssuer({
  owner: "G...",
  issuer: "G...",
  signTransaction: async (xdr, { networkPassphrase }) => {
    // Signez le XDR avec votre wallet
    return signedXdr;
  }
});
\`\`\`

## allowIssuer

Débloque un émetteur précédemment refusé, en restaurant sa capacité par défaut à écrire des credentials dans le coffre. Également exposé sous le nom \`authorizeIssuer\` pour la rétrocompatibilité.

### Arguments

\`\`\`ts
{
  owner: string;                    // Propriétaire du coffre (G ou C)
  issuer: string;                   // Émetteur à débloquer
  signTransaction: Signer;
  sourcePublicKey?: string;         // Par défaut le propriétaire pour les propriétaires G ; ignoré pour les propriétaires C (le relayer signe)
  userSalt?: string;                // Sel de 32 octets sélectionnant un coffre non par défaut (optionnel)
}
\`\`\`

### Valeur de retour

- \`Promise<{ txId: string }>\` : ID de la transaction après envoi au réseau

### Exemple

\`\`\`ts
import { useVault } from "@acta-team/credentials";

const { allowIssuer } = useVault();

const { txId } = await allowIssuer({
  owner: "G...",
  issuer: "G...",
  signTransaction: async (xdr, { networkPassphrase }) => {
    // Signez le XDR avec votre wallet
    return signedXdr;
  }
});
\`\`\`

## Flux de transaction

Toutes les méthodes suivent le même flux :

1. **Prepare** : Appelle l'API pour obtenir un XDR non signé et la passphrase du réseau
2. **Sign** : Utilise \`signTransaction\` pour signer le XDR avec la passphrase fournie
3. **Submit** : Envoie le XDR signé à l'API pour traitement sur le réseau

Le hook gère automatiquement la distinction entre les réponses prepare et submit à l'aide de gardes de type internes.
    `,
};
