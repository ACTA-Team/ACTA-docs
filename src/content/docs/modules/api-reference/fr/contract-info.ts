import type { DocPage } from "@/@types/docs";

export const contractInfo: DocPage = {
  slug: "api-contract-info",
  title: "Infos du Contrat",
  section: "Référence API",
  tocItems: [
    "Obtenir la version du contrat",
    "Frais",
    "Paramètres de requête",
    "Réponse",
  ],
  content: `
# Endpoints d'Infos du Contrat

Endpoints pour récupérer des informations sur les contrats.

## Obtenir la version du contrat

### GET /contracts/version

Renvoie la chaîne de version du contrat de **coffre** d'un propriétaire. Les coffres sont mono-locataires, la version est donc propre à chaque coffre : passez l'\`owner\` (et éventuellement \`userSalt\`) afin que la factory puisse résoudre le coffre à interroger. **Requiert une API key** (\`X-ACTA-Key\`).

**Paramètres de requête :**

- \`owner\` (optionnel) : adresse du propriétaire du coffre (G...) dont vous voulez la version. Sans ce paramètre, l'endpoint renvoie l'identifiant de la factory et une note au lieu d'une version (il n'existe pas de version au niveau de la factory).
- \`userSalt\` (optionnel) : sel de 32 octets sélectionnant le coffre du propriétaire ; 32 octets à zéro par défaut
- \`sourcePublicKey\` (optionnel) : un compte Stellar existant (G...) utilisé pour la simulation Soroban

**Réponse (avec \`owner\`) :**

\`\`\`json
{
  "version": "0.4.0"
}
\`\`\`

**Réponse (sans \`owner\`) :**

\`\`\`json
{
  "factory_id": "C...",
  "note": "No factory-level version; pass ?owner= for a vault version."
}
\`\`\`

**Exemple :**

\`\`\`bash
curl -H "X-ACTA-Key: your_key" \\
  "https://sandbox-api.acta.build/contracts/version?owner=G...&sourcePublicKey=G..."
\`\`\`

## Frais

Les frais d'émission sont lus **on-chain, uniquement via le \`quote_fee\` de la factory**. Il n'y a pas de paliers de frais par rôle : un seul tarif standard s'applique, avec un tarif personnalisé optionnel par émetteur, tous deux résolus on-chain. Les frais sont payés par l'émetteur au moment de l'émission (mainnet : 1 USDC par credential ; testnet : 5 XLM). L'API n'expose pas d'endpoint de paliers de frais et n'accepte pas de surcharge des frais.

## Paramètres de requête

- **owner** (optionnel) : adresse du propriétaire du coffre (G...) ; omettez-le pour obtenir l'identifiant de la factory au lieu d'une version de coffre
- **userSalt** (optionnel) : sel de 32 octets sélectionnant le coffre du propriétaire ; 32 octets à zéro par défaut
- **sourcePublicKey** (optionnel) : clé publique Stellar (G...) utilisée pour la simulation du contrat

## Réponse

- **version** : chaîne de version du contrat de coffre
    `,
};
