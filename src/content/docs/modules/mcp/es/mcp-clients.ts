import type { DocPage } from "@/@types/docs";

export const mcpClients: DocPage = {
  slug: "mcp-clients",
  title: "Configuración por Cliente",
  section: "IA",
  tocItems: [
    "Requisitos",
    "Claude Desktop",
    "Claude Code",
    "Cursor",
    "VS Code",
    "Windsurf",
    "Verificar la conexión",
    "Troubleshooting",
  ],
  content: `
# Configuración por cliente

El servidor MCP de documentación de ACTA (\`@acta-team/docs-mcp\`) funciona en cualquier cliente compatible con [Model Context Protocol](https://modelcontextprotocol.io). Aquí tienes bloques listos para copiar y pegar por cliente. Todos ejecutan el mismo comando; solo cambia dónde vive la configuración.

## Requisitos

- **Node.js 18 o superior** en el PATH (\`npx\` viene incluido).
- Acceso de red saliente a \`https://docs.acta.build\` (para descargar la documentación más reciente). Si no lo tienes, mira el modo offline en [MCP](/es/mcp).

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

## Troubleshooting

- **\`npx\` o \`node\` no encontrado:** instala Node.js 18+ y asegúrate de que está en el PATH del entorno donde corre el cliente. En Windows, reinicia el cliente después de instalar Node.
- **El servidor no aparece:** revisa que el JSON sea válido (sin comas colgantes) y reinicia o recarga el cliente por completo.
- **Sin acceso a red o proxy corporativo:** usa \`ACTA_DOCS_MCP_OFFLINE=1\` para servir la documentación incluida en el paquete, o apunta \`ACTA_DOCS_MCP_DATA_URL\` a una copia interna de confianza. Ver [MCP](/es/mcp).
- **Documentación desactualizada:** el servidor carga la documentación al iniciar. Reinicia o recarga el cliente para volver a descargarla; no suele hacer falta actualizar el paquete npm.
- **Primer arranque lento:** la primera ejecución de \`npx\` descarga el paquete. Ejecuciones posteriores usan la caché.
  `,
};
