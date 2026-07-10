import type { DocPage } from "@/@types/docs";

export const healthStatus: DocPage = {
  slug: "api-health-status",
  title: "Santé et état",
  section: "Référence API",
  tocItems: ["Vérification de santé", "Configuration réseau"],
  content: `
# Endpoints de Santé et d'État

Endpoints pour vérifier la santé de l'API et récupérer la configuration réseau.

## Vérification de santé

### GET /health

Vérifie l'état de l'API. Aucune authentification requise.

**Réponse :**

\`\`\`json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "ACTA API"
}
\`\`\`

**Exemple :**

\`\`\`bash
curl https://api.testnet.acta.build/health
\`\`\`

:::health-try:::

## Configuration réseau

### GET /config

Récupère la configuration réseau publique. **Aucune authentification requise** (endpoint public de bootstrap, sans rate limit).

**Réponse :**

\`\`\`json
{
  "rpcUrl": "https://soroban-testnet.stellar.org:443",
  "networkPassphrase": "Test SDF Network ; September 2015",
  "networkType": "testnet",
  "factoryContractId": "C...",
  "vaultWasmHash": "2bd0323a...",
  "didStellarRegistryId": "C...",
  "actaContractId": "C..."
}
\`\`\`

- **factoryContractId** : l'identifiant du contrat \`vc-vault-factory\` pour ce réseau.
- **networkType** : \`testnet\` ou \`mainnet\`.
- **vaultWasmHash** : le hash WASM du template \`vc-vault\` déployé par la factory.
- **didStellarRegistryId** : l'identifiant du contrat de registre \`did:stellar\` utilisé pour résoudre les DIDs émetteurs.
- **actaContractId** : alias de rétrocompatibilité de \`factoryContractId\`.

**Exemple :**

\`\`\`bash
curl https://api.testnet.acta.build/config
\`\`\`
    `,
};
