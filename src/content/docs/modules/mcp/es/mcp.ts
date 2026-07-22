import type { DocPage } from "@/@types/docs";

export const mcp: DocPage = {
  slug: "mcp",
  title: "MCP",
  section: "MCP",
  tocItems: [
    "Qué es",
    "Requisitos",
    "Instalación rápida",
    "Claude Desktop",
    "Claude Code",
    "Cursor",
    "VS Code",
    "Windsurf",
    "Verificar la conexión",
    "Actualizaciones de documentación",
    "Configuración avanzada",
    "Herramientas disponibles",
    "Recursos disponibles",
    "Troubleshooting",
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

## Requisitos

- **Node.js 18 o superior** en el PATH (\`npx\` viene incluido).
- Acceso de red saliente a \`https://docs.acta.build\` para descargar la documentación más reciente. Si no lo tienes, mira el modo offline en Configuración avanzada.

## Instalación rápida

Ejecuta el servidor directamente con \`npx\`:

\`\`\`bash
npx -y @acta-team/docs-mcp
\`\`\`

La mayoría de usuarios debería usar este comando sin cambios. Todos los clientes de abajo ejecutan el mismo comando; solo cambia dónde vive la configuración.

## Claude Desktop

Edita el archivo de configuración:

- **macOS:** \`~/Library/Application Support/Claude/claude_desktop_config.json\`
- **Windows:** \`%APPDATA%\\Claude\\claude_desktop_config.json\`

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

Guarda y reinicia Claude Desktop.

## Claude Code

Desde la terminal, en la raíz de tu proyecto:

\`\`\`bash
claude mcp add acta-docs -- npx -y @acta-team/docs-mcp
\`\`\`

Comprueba que quedó registrado con \`claude mcp list\`.

## Cursor

Crea \`.cursor/mcp.json\` en tu proyecto (o el archivo global de MCP de Cursor):

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

Abre **Settings > MCP** y confirma que \`acta-docs\` aparece activo.

## VS Code

Crea \`.mcp.json\` en la raíz del workspace (soportado por Copilot Chat en modo agente):

\`\`\`json
{
  "servers": {
    "acta-docs": {
      "command": "npx",
      "args": ["-y", "@acta-team/docs-mcp"]
    }
  }
}
\`\`\`

## Windsurf

Edita \`~/.codeium/windsurf/mcp_config.json\`:

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

Recarga los servidores MCP desde el panel de Cascade.

## Verificar la conexión

Con el servidor conectado, pídele al asistente algo que solo pueda responder con la documentación, por ejemplo:

> Lista las páginas de documentación de ACTA disponibles.

Deberías ver que usa la herramienta \`list_acta_docs\`. Si responde de forma genérica sin llamar a ninguna herramienta, revisa el troubleshooting.

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

## Troubleshooting

- **\`npx\` o \`node\` no encontrado:** instala Node.js 18+ y asegúrate de que está en el PATH del entorno donde corre el cliente. En Windows, reinicia el cliente después de instalar Node.
- **El servidor no aparece:** revisa que el JSON sea válido (sin comas colgantes) y reinicia o recarga el cliente por completo.
- **Sin acceso a red o proxy corporativo:** usa \`ACTA_DOCS_MCP_OFFLINE=1\` para servir la documentación incluida en el paquete, o apunta \`ACTA_DOCS_MCP_DATA_URL\` a una copia interna de confianza.
- **Documentación desactualizada:** el servidor carga la documentación al iniciar. Reinicia o recarga el cliente para volver a descargarla; no suele hacer falta actualizar el paquete npm.
- **Primer arranque lento:** la primera ejecución de \`npx\` descarga el paquete. Ejecuciones posteriores usan la caché.

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
