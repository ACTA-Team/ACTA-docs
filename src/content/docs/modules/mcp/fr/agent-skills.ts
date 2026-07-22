import type { DocPage } from "@/@types/docs";

export const agentSkills: DocPage = {
  slug: "agent-skills",
  title: "Agent Skills",
  section: "AI",
  tocItems: [
    "Ce que c'est",
    "Installation",
    "Ce que couvre la skill",
    "Comment ça marche",
    "Skill vs MCP",
    "Source de vérité",
  ],
  content: `
# Agent Skills

L'**Agent Skill ACTA** apprend à un agent de codage IA à construire correctement avec ACTA. Elle est publiée comme une [Agent Skill](https://www.skills.sh) ouverte qui s'installe dans Claude Code, Cursor, GitHub Copilot, Windsurf, Gemini et d'autres agents compatibles MCP ou skills.

Utilisez-la pour que votre agent écrive des intégrations ACTA sans deviner : le bon nom de paquet, les URLs de base, le flux prepare/submit, l'identité d'émetteur \`did:stellar\`, les codes d'erreur et le modèle de sécurité proviennent de la documentation officielle et non de données d'entraînement obsolètes.

- **Page de la skill :** [skills.sh/acta-team/skills/acta](https://www.skills.sh/acta-team/skills/acta)
- **Page du dépôt :** [skills.sh/acta-team/skills](https://www.skills.sh/acta-team/skills)
- **Source :** [github.com/ACTA-Team/skills](https://github.com/ACTA-Team/skills)

## Ce que c'est

Une skill est un dossier réutilisable (un \`SKILL.md\` plus des références et des exemples) que l'agent charge comme contexte. L'agent lit la description de la skill, décide qu'elle est pertinente pour votre tâche ACTA, et suit ses instructions au lieu de deviner. Voir l'[Aperçu de l'IA](doc:ai-overview) pour situer les skills parmi les autres outils IA.

## Installation

Installez-la dans n'importe quel agent compatible avec le CLI skills :

\`\`\`bash
# Installer toutes les skills du dépôt
npx skills add ACTA-Team/skills

# Ou seulement la skill acta
npx skills add ACTA-Team/skills/acta
\`\`\`

Le CLI écrit la skill dans le répertoire de skills de votre agent (par exemple \`.claude/skills/\` pour Claude Code) et l'agent la prend en compte automatiquement. Voir la [documentation skills.sh](https://www.skills.sh/docs) pour les détails par agent.

Vous pouvez aussi copier le dossier \`acta/\` du dépôt directement dans le répertoire de skills de votre agent.

## Ce que couvre la skill

- Le SDK React \`@acta-team/credentials\` : \`ActaConfig\`, \`useCredential\`, \`useVault\`, \`useVaultRead\`, \`useActaClient\` et \`ActaClient\`.
- L'API REST : endpoints \`/contracts/*\`, l'en-tête \`X-ACTA-Key\`, le flux prepare/submit XDR, les règles de propriété, les limites de débit et l'idempotence.
- L'identité d'émetteur et de titulaire \`did:stellar\`, la résolution et la vérification de l'émetteur.
- Les vaults : single-tenant, adressage déterministe, vaults sponsorisés et push.
- La gestion des erreurs : codes HTTP, validation, erreurs issuer-DID, erreurs de contrat et les échecs de frais USDC sur mainnet.
- Le modèle de sécurité et de données : qui signe quoi, ce qui est on-chain versus chiffré.

La skill est structurée pour une divulgation progressive : un \`SKILL.md\` concis comme point d'entrée, avec le détail dans \`references/\` et du code exécutable dans \`examples/\`.

## Comment ça marche

[skills.sh](https://www.skills.sh) n'a pas d'étape de publication séparée. Un dépôt est indexé automatiquement via une télémétrie d'installation anonyme la première fois que quelqu'un exécute \`npx skills add ACTA-Team/skills\`. Plus elle est installée, plus elle monte dans le répertoire.

## Skill vs MCP

La skill et le [serveur MCP](doc:mcp) sont complémentaires :

- La **skill** fournit des conseils d'intégration prêts à l'emploi que l'agent suit pendant qu'il écrit du code.
- Le **MCP** (\`@acta-team/docs-mcp\`) permet à l'agent d'interroger la documentation officielle en direct à la demande.

Installez les deux pour un résultat optimal : la skill pour savoir comment construire, le MCP pour la consultation.

## Source de vérité

La skill est distillée de la documentation officielle sur [docs.acta.build](https://docs.acta.build). Lorsqu'un détail de la skill entre en conflit avec la documentation en direct, la documentation en direct prévaut.
  `,
};
