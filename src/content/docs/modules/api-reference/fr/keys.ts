import type { DocPage } from "@/@types/docs";

export const keys: DocPage = {
  slug: "api-keys",
  title: "API Keys",
  section: "Référence API",
  tocItems: [
    "Créer une API Key testnet",
    "Créer une API Key mainnet",
    "Corps de la requête",
    "Réponse",
    "Rate limiting",
  ],
  content: `
# Endpoints des API Keys

Endpoint public pour créer des API keys. Aucune authentification requise, mais soumis à un rate limit.

> **Note :** vous pouvez également demander des API keys directement depuis la [dApp ACTA](https://dapp.acta.build/). La dApp fournit une interface conviviale pour créer et gérer vos API keys.

## Créer une API Key

### POST /public/api-keys

Crée une API key (rôle standard, expiration dans 6 mois). Utilisez l'URL de base **testnet** ou **mainnet** selon le réseau dont vous avez besoin.

- Testnet : \`https://api.testnet.acta.build/public/api-keys\`
- Mainnet : \`https://api.mainnet.acta.build/public/api-keys\`

**Rate limit :** 5 requêtes par minute et par IP

**Corps de la requête :**

\`\`\`json
{
  "name": "My API Key",
  "wallet_address": "G...",
  "metadata": {
    "network": "testnet"
  }
}
\`\`\`

Incluez \`metadata.network\` : \`"testnet"\` ou \`"mainnet"\` afin de correspondre à l'URL de base de l'API que vous appelez.

**Réponse :**

\`\`\`json
{
  "message": "API key created successfully. Save this key - it will not be shown again.",
  "api_key": "64-character hex string",
  "api_key_record": {
    "id": "uuid",
    "name": "My API Key",
    "role": "standard",
    "is_active": true,
    "expires_at": "2024-07-01T00:00:00.000Z",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
\`\`\`

**Exemple (testnet) :**

\`\`\`bash
curl -X POST https://api.testnet.acta.build/public/api-keys \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "My Testnet Key",
    "wallet_address": "G...",
    "metadata": {
      "network": "testnet"
    }
  }'
\`\`\`

**Exemple (mainnet) :**

\`\`\`bash
curl -X POST https://api.mainnet.acta.build/public/api-keys \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "My Mainnet Key",
    "wallet_address": "G...",
    "metadata": {
      "network": "mainnet"
    }
  }'
\`\`\`

## Corps de la requête

- \`name\` (optionnel) : nom de l'API key (max 120 caractères)
- \`wallet_address\` (optionnel) : adresse du wallet Stellar (G...)
- \`metadata\` (optionnel) : objet de métadonnées supplémentaires
  - \`network\` (requis) : "testnet" ou "mainnet"

## Réponse

- \`api_key\` : l'API key - une chaîne hexadécimale de 64 caractères sans préfixe (conservez-la, elle ne sera plus affichée)
- \`api_key_record\` : métadonnées de la clé créée

**Une clé par wallet :** créer à nouveau une clé pour le même wallet effectue une rotation - la clé précédente est révoquée et remplacée. \`metadata.network\` doit correspondre au réseau de l'URL de base appelée ; une incohérence renvoie \`400 network_mismatch\`.

## Rate limiting

- Maximum 5 requêtes par minute et par adresse IP
- En-têtes de rate limit inclus dans la réponse :
  - \`X-RateLimit-Limit\` : 5
  - \`X-RateLimit-Remaining\` : requêtes restantes
  - \`X-RateLimit-Reset\` : timestamp Unix de réinitialisation de la limite

**Note :** la création d'API key via ces endpoints est restreinte par une liste d'origines autorisées (\`https://dapp.acta.build\`, plus \`localhost\` pour le développement) ; les autres origines reçoivent \`403 forbidden_origin\`. Pour une expérience plus simple, nous recommandons d'utiliser la [dApp ACTA](https://dapp.acta.build/) pour créer et gérer vos API keys.
    `,
};
