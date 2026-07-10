import type { DocPage } from "@/@types/docs";

export const sponsoredVault: DocPage = {
  slug: "sponsoredVault",
  title: "sponsoredVault",
  section: "Credentials SDK",
  tocItems: ["Client", "sponsoredVaultCreate", "Prepare et submit"],
  content: `
# sponsoredVault

\`ActaClient.sponsoredVaultCreate\` enveloppe **\`POST /contracts/sponsored-vault/create\`** (prepare/submit pour le \`deploy_sponsored\` de la factory), accessible avec \`useActaClient()\` sous \`ActaConfig\`.

Sur la chaîne, le sponsoring est **ouvert** : n'importe quel sponsor peut déployer un coffre sponsorisé pour un propriétaire. L'appel de contrat sous-jacent est le \`deploy_sponsored\` de la factory (il remplace l'ancienne méthode de coffre \`create_sponsored_vault\`). Notez que la route HTTP exige une **clé d'API avec le rôle admin** ; configurez donc \`ActaConfig\` / \`ActaClient\` avec une clé admin pour utiliser cette méthode.

La sémantique Soroban, les modes d'autorisation et le JSON des requêtes sont documentés sous **Référence de l'API → Coffre sponsorisé** (\`api-sponsored-vault\`). Cette page documente uniquement **l'utilisation en TypeScript** de la surface publique.

## Client

\`\`\`ts
import { useActaClient } from "@acta-team/credentials";

const client = useActaClient();
\`\`\`

## sponsoredVaultCreate

\`\`\`ts
client.sponsoredVaultCreate(
  payload:
    | {
        sponsor: string;          // Adresse du sponsor (paie et signe)
        owner: string;            // Propriétaire du coffre
        didUri: string;           // URI du DID stocké pour le coffre
        sourcePublicKey: string;  // Doit être le sponsor
        contractId?: string;
      }
    | { signedXdr: string }
): Promise<SponsoredVaultCreateResponse>
\`\`\`

- **Prepare :** premier objet → \`{ xdr, network }\`.
- **Submit :** \`{ signedXdr }\` → \`{ tx_id }\`.

## Prepare et submit

Passez les champs prepare (sans \`signedXdr\`) ou \`{ signedXdr }\` après signature. Utilise la même \`baseURL\` et la même clé d'API que le reste d'\`ActaClient\` pour les routes de contrat publiques.
    `,
};
