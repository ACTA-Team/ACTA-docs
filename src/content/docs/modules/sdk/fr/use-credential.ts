import type { DocPage } from "@/@types/docs";

export const useCredential: DocPage = {
  slug: "useCredential",
  title: "useCredential",
  section: "Credentials SDK",
  tocItems: [
    "Fonction",
    "issue",
    "Arguments",
    "Type Signer",
    "Valeur de retour",
    "Exemple",
    "revoke",
    "Flux de transaction",
    "Notes",
  ],
  content: `
# useCredential

Hook pour les opérations sur les credentials : émission et révocation.

## Fonction

\`\`\`ts
useCredential(): {
  issue: (args: IssueArgs) => Promise<{ txId: string }>;
  revoke: (args: RevokeArgs) => Promise<{ txId: string }>;
}
\`\`\`

## issue

Émet un credential (le stocke dans le coffre et le marque comme valide).

### Arguments

\`\`\`ts
{
  owner: string;                    // Propriétaire du coffre : compte G ou identifiant de contrat smart-wallet C
  vcId: string;                    // Identifiant unique du credential
  vcData: string | object;         // Données du credential (chaîne JSON ou objet). @context est ajouté automatiquement s'il manque
  issuer: string;                  // Clé publique Stellar de l'émetteur
  issuerDid?: string;              // DID de l'émetteur : un did:stellar enregistré et résoluble
  signTransaction: Signer;         // Fonction qui signe le XDR non signé retourné par le prepare d'ACTA
  sourcePublicKey?: string;        // Signataire G (omettre pour les valeurs par défaut ; omettre pour les flux propriétaire C signés par relayer selon l'API)
  userSalt?: string;               // Sel de 32 octets sélectionnant un coffre non par défaut pour le propriétaire (optionnel)
  contractId?: string;             // ID du contrat (optionnel, utilise la valeur par défaut configurée)
}
\`\`\`

Le titulaire est exprimé dans \`vcData\` en tant que \`credentialSubject.id\` (un DID) ; il n'y a pas de champ \`holder\` / wallet séparé. L'\`issuerDid\` doit être un \`did:stellar\` enregistré et résoluble ; les adresses de wallet brutes et \`did:pkh\` ne sont plus acceptés. Le SDK réalise l'auto-onboarding du \`did:stellar\` de l'émetteur via \`getOrCreateIssuerIdentity\`, les intégrateurs obtiennent donc la configuration du DID d'émetteur gratuitement.

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
import { useCredential } from "@acta-team/credentials";

const { issue } = useCredential();

const { txId } = await issue({
  owner: "G...",
  vcId: "credential-123",
  vcData: JSON.stringify({
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://www.w3.org/ns/credentials/examples/v2"
    ],
    type: ["VerifiableCredential"],
    credentialSubject: {
      id: "did:stellar:...",   // DID du titulaire
      name: "John Doe"
    }
  }),
  issuer: "G...",
  issuerDid: "did:stellar:...",   // did:stellar enregistré et résoluble
  signTransaction: async (xdr, { networkPassphrase }) => {
    // Signez le XDR avec votre wallet
    return signedXdr;
  }
});
\`\`\`

## revoke

Révoque un credential. L'appel envoie l'\`owner\` à l'API afin que le bon coffre soit ciblé.

### Arguments

\`\`\`ts
{
  owner: string;                   // Propriétaire du coffre (compte G ou smart-wallet C) ; envoyé à l'API
  vcId: string;                    // Identifiant unique du credential à révoquer
  signTransaction: Signer;         // Fonction qui signe le XDR non signé retourné par le prepare d'ACTA
  date?: string;                   // Date de révocation au format ISO (optionnel)
  sourcePublicKey?: string;        // Signataire G explicite (omettre pour les valeurs par défaut / flux relayer)
  userSalt?: string;               // Sel de 32 octets sélectionnant un coffre non par défaut pour le propriétaire (optionnel)
  contractId?: string;             // ID du contrat (optionnel, utilise la valeur par défaut configurée)
}
\`\`\`

### Valeur de retour

- \`Promise<{ txId: string }>\` : ID de la transaction après envoi au réseau

### Exemple

\`\`\`ts
import { useCredential } from "@acta-team/credentials";

const { revoke } = useCredential();

const { txId } = await revoke({
  owner: "G...",
  vcId: "credential-123",
  signTransaction: async (xdr, { networkPassphrase }) => {
    // Signez le XDR avec votre wallet
    return signedXdr;
  },
  date: new Date().toISOString() // Optionnel
});
\`\`\`

## Flux de transaction

Toutes les méthodes suivent le même flux :

1. **Prepare** : Appelle l'API pour obtenir un XDR non signé et la passphrase du réseau
2. **Sign** : Utilise \`signTransaction\` pour signer le XDR avec la passphrase fournie
3. **Submit** : Envoie le XDR signé à l'API pour traitement sur le réseau

Le hook gère automatiquement la distinction entre les réponses prepare et submit à l'aide de gardes de type internes.

## Notes

- La méthode \`issue\` stocke automatiquement le credential dans le coffre et le marque comme valide en une seule transaction
- Le titulaire est \`credentialSubject.id\` dans \`vcData\` (un DID) ; il n'y a pas de champ titulaire séparé
- L'\`issuerDid\` doit être un \`did:stellar\` enregistré et résoluble ; le SDK réalise son auto-onboarding via \`getOrCreateIssuerIdentity\`
- La méthode \`revoke\` envoie l'\`owner\` à l'API et exige que le propriétaire (\`owner\`) signe la transaction
- La date de révocation est automatiquement définie sur la date actuelle si elle n'est pas fournie
    `,
};
