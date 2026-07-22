import type { DocPage } from "@/@types/docs";

export const aiOverview: DocPage = {
  slug: "ai-overview",
  title: "Resumen de IA",
  section: "IA",
  tocItems: [
    "Dos formas de usar IA con ACTA",
    "IA sobre ACTA",
    "Credenciales para agentes",
    "Qué hay en esta sección",
    "Principios de seguridad",
  ],
  content: `
# IA en ACTA

Esta sección reúne todo lo relacionado con inteligencia artificial y ACTA: cómo conectar asistentes de IA a la documentación y a las APIs de ACTA, y cómo usar credenciales verificables como capa de confianza para agentes de IA.

## Dos formas de usar IA con ACTA

Hay dos ejes distintos, y conviene tenerlos claros:

1. **IA sobre ACTA.** Usas un asistente (Claude, Cursor, VS Code, Windsurf u otro) para construir sobre ACTA más rápido: preguntar cómo funciona el SDK, generar snippets, entender errores o verificar credenciales mediante herramientas.
2. **Credenciales para agentes.** Usas ACTA para dar identidad y credenciales verificables a los propios agentes de IA, de modo que puedan probar quiénes son, qué permisos tienen y quién los opera.

## IA sobre ACTA

El punto de entrada es el **servidor MCP de documentación** (\`@acta-team/docs-mcp\`), que expone la documentación oficial y actualizada de ACTA a cualquier cliente compatible con [Model Context Protocol](https://modelcontextprotocol.io). Con él, el asistente responde sobre ACTA apoyándose en fuentes reales en lugar de conocimiento genérico.

Encima de eso puedes darle a un modelo **herramientas de solo lectura** contra la API de ACTA (por ejemplo, verificar una credencial) usando function calling. La emisión, la firma y el acceso a wallets nunca deben quedar en manos autónomas del modelo.

## Credenciales para agentes

Los mismos primitivos que ACTA ofrece para personas y organizaciones (DIDs \`did:stellar\`, bóvedas y credenciales verificables) aplican a agentes de IA. Un agente puede tener su propio DID, portar credenciales que declaren su operador y sus permisos, y presentarlas de forma verificable ante otros servicios o agentes.

Consulta [Identidad para agentes de IA](/es/agent-identity) para el detalle conceptual y los patrones de integración.

## Qué hay en esta sección

- **[MCP](/es/mcp):** el servidor de documentación de solo lectura y su configuración base.
- **[Configuración por cliente](/es/mcp-clients):** bloques listos para Claude, Cursor, VS Code y Windsurf, más troubleshooting.
- **[Recetas de prompts](/es/ai-prompts):** ejemplos concretos para sacarle provecho al MCP.
- **[Identidad para agentes de IA](/es/agent-identity):** credenciales verificables aplicadas a agentes.

## Principios de seguridad

- El MCP de documentación es **solo lectura**: no emite credenciales, no firma transacciones y no accede a wallets.
- Al exponer herramientas de API a un modelo, limita el alcance a operaciones de lectura salvo que haya un humano aprobando cada acción sensible.
- Trata cualquier fuente de contexto configurable (por ejemplo \`ACTA_DOCS_MCP_DATA_URL\`) como confiable solo si tú controlas su origen.
  `,
};
