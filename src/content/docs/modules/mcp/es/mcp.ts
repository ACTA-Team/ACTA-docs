import type { DocPage } from "@/@types/docs";

export const mcp: DocPage = {
  slug: "mcp",
  title: "MCP",
  section: "MCP",
  tocItems: [
    "Qué es",
    "Instalación rápida",
    "Configuración del cliente MCP",
    "Actualizaciones de documentación",
    "Configuración avanzada",
    "Herramientas disponibles",
    "Recursos disponibles",
    "Cuándo usar este MCP",
  ],
  content: `
# MCP

**MCP** (paquete npm \`@acta-team/docs-mcp\`) es un servidor [Model Context Protocol (MCP)](https://modelcontextprotocol.io) de solo lectura. Los clientes compatibles con MCP - por ejemplo Claude, Cursor u otros asistentes con soporte MCP - pueden consultar la **documentación oficial de ACTA** a través de él.

Úsalo cuando quieras que un asistente responda sobre ACTA apoyándose en documentación **pública, oficial y actualizada**, y no solo en conocimiento genérico del modelo.

## Qué es

El paquete es \`@acta-team/docs-mcp\`.

Proporciona acceso de lectura a documentación pública de ACTA. No requiere API key.

Este servidor MCP:

- No realiza acciones dentro de ACTA.
- No emite credenciales.
- No firma transacciones.
- No accede a wallets.
- No consulta datos privados.
- No modifica smart contracts.
- Solo proporciona acceso de lectura a documentación pública de ACTA.

## Instalación rápida

Ejecuta el servidor directamente con \`npx\`:

\`\`\`bash
npx -y @acta-team/docs-mcp
\`\`\`

La mayoría de usuarios debería usar este comando sin cambios.

## Configuración del cliente MCP

Usa esta configuración en un cliente compatible con MCP:

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

Después de guardar la configuración, reinicia o recarga tu cliente MCP.

## Actualizaciones de documentación

Al iniciar, el servidor carga la documentación más reciente desde:

\`\`\`text
https://docs.acta.build/api/mcp/docs-data
\`\`\`

Si cambia la documentación de ACTA, normalmente **no** hace falta actualizar el paquete npm. Basta con **reiniciar o recargar** el cliente MCP para que el proceso del servidor cargue la documentación actualizada.

Las **nuevas versiones npm** solo son necesarias cuando cambia el **código** del servidor MCP. Si el endpoint remoto falla, el servidor usa la copia de documentación **incluida** en el paquete npm.

## Configuración avanzada

- **\`ACTA_DOCS_MCP_OFFLINE=1\`:** omite la descarga remota y usa solo la documentación incluida en el paquete.
- **\`ACTA_DOCS_MCP_DATA_URL\`:** usa otra URL remota para el JSON de documentación.

Usa \`ACTA_DOCS_MCP_DATA_URL\` solo si confías completamente en la fuente configurada. El cliente de IA usará ese contenido como contexto para responder preguntas sobre ACTA.

## Herramientas disponibles

- **\`list_acta_docs\`:** lista las páginas de documentación disponibles.
- **\`read_acta_doc\`:** lee una página específica usando su \`slug\` e idioma.
- **\`search_acta_docs\`:** busca contenido dentro de la documentación de ACTA.

## Recursos disponibles

Las páginas de documentación se exponen usando este formato de URI:

\`\`\`text
acta-docs://{locale}/{slug}
\`\`\`

Los idiomas soportados actualmente son:

- \`en\`
- \`es\`
- \`fr\`

## Cuándo usar este MCP

Usa este MCP para preguntar sobre:

- Qué es ACTA.
- Cómo funciona la emisión y verificación de credenciales.
- Cómo integrarse con la API o SDK de ACTA.
- Cómo funciona la arquitectura documentada de ACTA.
- Qué endpoints, flujos o conceptos están explicados en la documentación oficial.

Este MCP está diseñado para documentación y soporte técnico. No reemplaza una integración directa con la API de ACTA.
  `,
};
