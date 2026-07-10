import type { DocPage } from "@/@types/docs";

export const mcp: DocPage = {
  slug: "mcp",
  title: "MCP",
  section: "MCP",
  tocItems: [
    "Ce que c'est",
    "Installation rapide",
    "Configuration du client MCP",
    "Mises à jour de la documentation",
    "Configuration avancée",
    "Outils disponibles",
    "Ressources disponibles",
    "Quand utiliser ce MCP",
  ],
  content: `
# MCP

**MCP** (package npm \`@acta-team/docs-mcp\`) est un serveur [Model Context Protocol (MCP)](https://modelcontextprotocol.io) en lecture seule. Les clients compatibles MCP - par exemple Claude, Cursor ou d'autres assistants qui prennent en charge MCP - peuvent interroger la **documentation officielle d'ACTA** à travers lui.

Utilisez-le quand vous voulez qu'un assistant réponde à des questions sur ACTA avec une documentation **publique, officielle et à jour**, et non avec de simples suppositions issues de ses données d'entraînement générales.

## Ce que c'est

Le package est \`@acta-team/docs-mcp\`.

Il fournit un accès en lecture seule à la documentation publique d'ACTA. Il n'exige pas de clé d'API.

Ce serveur MCP :

- N'effectue pas d'actions dans ACTA.
- N'émet pas de credentials.
- Ne signe pas de transactions.
- N'accède pas aux wallets.
- N'interroge pas de données privées.
- Ne modifie pas les smart contracts.
- Fournit uniquement un accès en lecture à la documentation publique d'ACTA.

## Installation rapide

Exécutez le serveur directement avec \`npx\` :

\`\`\`bash
npx -y @acta-team/docs-mcp
\`\`\`

La plupart des utilisateurs devraient utiliser cette commande sans modifications.

## Configuration du client MCP

Utilisez cette configuration dans un client compatible MCP :

\`\`\`json
{
  "mcpServers": {
    "acta-docs": {
      "command": "npx",
      "args": ["-y", "@acta-team/docs-mcp"]
    }
  }
}
\`\`\`

Après avoir sauvegardé la configuration, redémarrez ou rechargez votre client MCP.

## Mises à jour de la documentation

Au démarrage, le serveur charge la documentation la plus récente depuis :

\`\`\`text
https://docs.acta.build/api/mcp/docs-data
\`\`\`

Si la documentation d'ACTA change, les utilisateurs n'ont **pas** besoin de mettre à jour le package npm. Redémarrer ou recharger le client MCP suffit pour que le processus serveur charge la documentation mise à jour.

De nouvelles versions npm ne sont nécessaires **que** lorsque le **code** du serveur MCP change. Si l'endpoint distant échoue, le serveur utilise la copie de la documentation **embarquée** dans le package npm.

## Configuration avancée

- **\`ACTA_DOCS_MCP_OFFLINE=1\` :** ignorer la récupération distante et utiliser uniquement la documentation embarquée.
- **\`ACTA_DOCS_MCP_DATA_URL\` :** utiliser une autre URL distante de JSON de documentation.

N'utilisez \`ACTA_DOCS_MCP_DATA_URL\` que si vous faites entièrement confiance à la source configurée. Le client IA utilisera ce contenu comme contexte pour répondre aux questions sur ACTA.

## Outils disponibles

- **\`list_acta_docs\` :** liste les pages de documentation disponibles.
- **\`read_acta_doc\` :** lit une page spécifique à partir de son \`slug\` et de sa locale.
- **\`search_acta_docs\` :** recherche du contenu dans la documentation d'ACTA.

## Ressources disponibles

Les pages de documentation sont exposées avec ce format d'URI :

\`\`\`text
acta-docs://{locale}/{slug}
\`\`\`

Locales actuellement prises en charge :

- \`en\`
- \`es\`
- \`fr\`

## Quand utiliser ce MCP

Utilisez ce MCP pour poser des questions sur :

- Ce qu'est ACTA.
- Le fonctionnement de l'émission et de la vérification de credentials.
- Comment s'intégrer avec l'API ou le SDK d'ACTA.
- Le fonctionnement de l'architecture documentée d'ACTA.
- Les endpoints, flux ou concepts expliqués dans la documentation officielle.

Ce MCP est conçu pour la documentation et le support technique. Il ne remplace pas une intégration directe avec l'API ACTA.
  `,
};
