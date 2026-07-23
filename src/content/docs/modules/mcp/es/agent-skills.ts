import type { DocPage } from "@/@types/docs";

export const agentSkills: DocPage = {
  slug: "agent-skills",
  title: "Agent Skills",
  section: "AI",
  tocItems: [
    "Qué es",
    "Instalación",
    "Qué cubre la skill",
    "Cómo funciona",
    "Skill vs MCP",
    "Fuente de verdad",
  ],
  content: `
# Agent Skills

La **Agent Skill de ACTA** le enseña a un agente de IA de programación a construir con ACTA de forma correcta. Se publica como una [Agent Skill](https://www.skills.sh) abierta que se instala en Claude Code, Cursor, GitHub Copilot, Windsurf, Gemini y otros agentes compatibles con MCP o con skills.

Úsala cuando quieras que tu agente escriba integraciones de ACTA sin adivinar: el nombre correcto del paquete, las URLs base, el flujo prepare/submit, la identidad de emisor \`did:stellar\`, los códigos de error y el modelo de seguridad salen de la documentación oficial y no de datos de entrenamiento desactualizados.

- **Página de la skill:** [skills.sh/acta-team/skills/acta](https://www.skills.sh/acta-team/skills/acta)
- **Página del repo:** [skills.sh/acta-team/skills](https://www.skills.sh/acta-team/skills)
- **Código:** [github.com/ACTA-Team/skills](https://github.com/ACTA-Team/skills)

## Qué es

Una skill es una carpeta reutilizable (un \`SKILL.md\` más referencias y ejemplos) que el agente carga como contexto. El agente lee la descripción de la skill, decide que es relevante para tu tarea de ACTA y sigue sus instrucciones en lugar de adivinar. Consulta el [Resumen de IA](doc:ai-overview) para ver cómo encajan las skills junto al resto del tooling de IA.

## Instalación

Instálala en cualquier agente compatible con el CLI de skills:

\`\`\`bash
# Instalar todas las skills del repo
npx skills add ACTA-Team/skills

# O solo la skill acta
npx skills add ACTA-Team/skills/acta
\`\`\`

El CLI escribe la skill en el directorio de skills de tu agente (por ejemplo \`.claude/skills/\` en Claude Code) y el agente la toma automáticamente. Consulta la [documentación de skills.sh](https://www.skills.sh/docs) para detalles por agente.

También puedes copiar la carpeta \`acta/\` del repo directamente en el directorio de skills de tu agente.

## Qué cubre la skill

- El SDK de React \`@acta-team/credentials\`: \`ActaConfig\`, \`useCredential\`, \`useVault\`, \`useVaultRead\`, \`useActaClient\` y \`ActaClient\`.
- La API REST: endpoints \`/contracts/*\`, el header \`X-ACTA-Key\`, el flujo prepare/submit con XDR, reglas de propiedad, límites de tasa e idempotencia.
- Identidad de emisor y titular con \`did:stellar\`, resolución y verificación del emisor.
- Vaults: single-tenant, direccionamiento determinista, vaults patrocinados y push.
- Manejo de errores: códigos HTTP, validación, errores de issuer-DID, errores de contrato y los fallos de fee en USDC en mainnet.
- El modelo de seguridad y datos: quién firma qué, qué vive on-chain y qué está cifrado.

La skill está estructurada para divulgación progresiva: un \`SKILL.md\` conciso como entrada, con el detalle en \`references/\` y código ejecutable en \`examples/\`.

## Cómo funciona

[skills.sh](https://www.skills.sh) no tiene un paso de publicación separado. Un repositorio se indexa automáticamente mediante telemetría anónima de instalación la primera vez que alguien ejecuta \`npx skills add ACTA-Team/skills\`. Cuanto más se instala, más sube en el directorio.

## Skill vs MCP

La skill y el [servidor MCP](doc:mcp) son complementarios:

- La **skill** entrega guía de integración lista para usar que el agente sigue mientras escribe código.
- El **MCP** (\`@acta-team/docs-mcp\`) le permite al agente consultar la documentación oficial en vivo cuando la necesita.

Instala ambos para el mejor resultado: la skill para saber cómo construir, el MCP para consultar.

## Fuente de verdad

La skill está destilada de la documentación oficial en [docs.acta.build](https://docs.acta.build). Cuando un detalle de la skill entre en conflicto con la documentación en vivo, manda la documentación en vivo.
  `,
};
