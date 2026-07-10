import type { DocPage } from "@/@types/docs";

export const useVaultRead: DocPage = {
  slug: "useVaultRead",
  title: "useVaultRead",
  section: "Credentials SDK",
  tocItems: [
    "Fonction",
    "listVcIds",
    "Arguments",
    "Valeur de retour",
    "Exemple",
    "getVc",
    "verifyVc",
    "Notes",
  ],
  content: `
# useVaultRead

Hook pour lire les données du coffre : lister les IDs de credentials, obtenir des credentials, vérifier des credentials.

## Fonction

\`\`\`ts
useVaultRead(): {
  listVcIds: (args: ListVcIdsArgs) => Promise<string[]>;
  getVc: (args: GetVcArgs) => Promise<unknown | null>;
  verifyVc: (args: VerifyVcArgs) => Promise<VaultVerifyVcResponse>;
}
\`\`\`

## listVcIds

Liste les IDs de credentials détenus par un propriétaire.

### Arguments

\`\`\`ts
{
  owner: string;                   // Clé publique Stellar du propriétaire
  contractId?: string;             // ID du contrat de coffre (optionnel, évite la résolution via la factory)
}
\`\`\`

### Valeur de retour

- \`Promise<string[]>\` : Tableau d'IDs de credentials

### Exemple

\`\`\`ts
import { useVaultRead } from "@acta-team/credentials";

const { listVcIds } = useVaultRead();

const vcIds = await listVcIds({
  owner: "G..."
});
// vcIds: ["credential-1", "credential-2", ...]
\`\`\`

## getVc

Obtient un credential depuis le coffre.

### Arguments

\`\`\`ts
{
  owner: string;                   // Clé publique Stellar du propriétaire
  vcId: string;                    // Identifiant unique du credential
  contractId?: string;             // ID du contrat de coffre (optionnel, évite la résolution via la factory)
}
\`\`\`

### Valeur de retour

- \`Promise<unknown | null>\` : Données du credential ou \`null\` s'il est introuvable

### Exemple

\`\`\`ts
import { useVaultRead } from "@acta-team/credentials";

const { getVc } = useVaultRead();

const vc = await getVc({
  owner: "G...",
  vcId: "credential-123"
});

if (vc) {
  console.log("Credential found:", vc);
} else {
  console.log("Credential not found");
}
\`\`\`

## verifyVc

Vérifie le statut d'un credential dans le coffre.

### Arguments

\`\`\`ts
{
  owner: string;                   // Clé publique Stellar du propriétaire
  vcId: string;                    // Identifiant unique du credential
  contractId?: string;             // ID du contrat de coffre (optionnel, évite la résolution via la factory)
}
\`\`\`

### Valeur de retour

\`\`\`ts
Promise<{
  status: "valid" | "revoked";
  since?: string;                  // Date ISO depuis laquelle il est dans cet état (optionnel)
}>
\`\`\`

### Exemple

\`\`\`ts
import { useVaultRead } from "@acta-team/credentials";

const { verifyVc } = useVaultRead();

const verification = await verifyVc({
  owner: "G...",
  vcId: "credential-123"
});

console.log(\`Status: \${verification.status}\`); // "valid" ou "revoked"
if (verification.since) {
  console.log(\`Since: \${verification.since}\`);
}
\`\`\`

## Notes

- Toutes ces opérations sont **en lecture seule** et n'exigent pas de signer des transactions
- Elles exigent en revanche une clé d'API valide ; \`listVcIds\` et \`getVc\` ne fonctionnent que pour le propriétaire lié à votre clé d'API (l'API applique la propriété), tandis que \`verifyVc\` fonctionne pour n'importe quel propriétaire
- Les méthodes gèrent automatiquement les différents formats de réponse de l'API
- \`getVc\` retourne \`null\` si le credential n'existe pas dans le coffre
- Les hooks lisent toujours le **coffre canonique** du propriétaire (ils ne prennent pas de \`userSalt\`) ; pour lire un coffre non par défaut, passez son adresse résolue via \`contractId\`
- \`verifyVc\` retourne toujours un résultat avec le statut actuel du credential (\`valid\`, \`revoked\` ou \`invalid\`)
    `,
};
