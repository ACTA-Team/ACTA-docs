# ACTA Docs MCP

ACTA Docs MCP is a read-only MCP server that lets MCP-compatible AI clients query the official ACTA documentation.

Use it when you want an assistant such as Claude, Cursor, or another MCP-compatible client to answer questions about ACTA using public, official, and up-to-date documentation.

## What it is

The package is `@acta-team/docs-mcp`.

It provides read-only access to public ACTA documentation. It does not require an API key.

This MCP server:

- Does not perform actions inside ACTA.
- Does not issue credentials.
- Does not sign transactions.
- Does not access wallets.
- Does not query private data.
- Does not modify smart contracts.
- Only provides read access to public ACTA documentation.

## Quick installation

Run the server directly with `npx`:

```bash
npx -y @acta-team/docs-mcp
```

Most users should use this command without changes.

## MCP client configuration

Use this configuration in an MCP-compatible client:

```json
{
  "mcpServers": {
    "acta-docs": {
      "command": "npx",
      "args": ["-y", "@acta-team/docs-mcp"]
    }
  }
}
```

After saving the configuration, restart or reload your MCP client.

## Documentation updates

When it starts, the server loads the latest documentation from:

```text
https://docs.acta.build/api/mcp/docs-data
```

If ACTA documentation changes, users do not need to update the npm package. Restarting or reloading the MCP client is enough for the server process to load the updated documentation.

New npm versions are only needed when the MCP server code changes. If the remote endpoint fails, the server uses the documentation copy bundled in the npm package.

## Advanced configuration

- `ACTA_DOCS_MCP_OFFLINE=1`: skip the remote fetch and use bundled documentation only.
- `ACTA_DOCS_MCP_DATA_URL`: use a different remote docs JSON URL.

Use `ACTA_DOCS_MCP_DATA_URL` only if you completely trust the configured source. The AI client will use that content as context to answer questions about ACTA.

## Available tools

- `list_acta_docs`: lists the available documentation pages.
- `read_acta_doc`: reads a specific page using its `slug` and locale.
- `search_acta_docs`: searches content inside the ACTA documentation.

## Available resources

Documentation pages are exposed using this URI format:

```text
acta-docs://{locale}/{slug}
```

Currently supported locales:

- `en`
- `es`

## When to use this MCP

Use this MCP to ask about:

- What ACTA is.
- How credential issuance and verification work.
- How to integrate with the ACTA API or SDK.
- How the documented ACTA architecture works.
- Which endpoints, flows, or concepts are explained in the official documentation.

This MCP is designed for documentation and technical support. It does not replace a direct integration with the ACTA API.

---

# ACTA Docs MCP

ACTA Docs MCP es un servidor MCP de solo lectura que permite a clientes de IA compatibles con MCP consultar la documentación oficial de ACTA.

Úsalo cuando quieras que un asistente como Claude, Cursor u otro cliente compatible con MCP responda preguntas sobre ACTA usando documentación pública, oficial y actualizada.

## Qué es

El paquete es `@acta-team/docs-mcp`.

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

Ejecuta el servidor directamente con `npx`:

```bash
npx -y @acta-team/docs-mcp
```

La mayoría de usuarios debería usar este comando sin cambios.

## Configuración del cliente MCP

Usa esta configuración en un cliente compatible con MCP:

```json
{
  "mcpServers": {
    "acta-docs": {
      "command": "npx",
      "args": ["-y", "@acta-team/docs-mcp"]
    }
  }
}
```

Después de guardar la configuración, reinicia o recarga tu cliente MCP.

## Actualizaciones de documentación

Al iniciar, el servidor carga la documentación más reciente desde:

```text
https://docs.acta.build/api/mcp/docs-data
```

Si cambia la documentación de ACTA, no hace falta actualizar el paquete npm. Basta con reiniciar o recargar el cliente MCP para que el proceso del servidor cargue la documentación actualizada.

Las nuevas versiones npm solo son necesarias cuando cambia el código del servidor MCP. Si el endpoint remoto falla, el servidor usa la copia de documentación incluida en el paquete npm.

## Configuración avanzada

- `ACTA_DOCS_MCP_OFFLINE=1`: omite la descarga remota y usa solo la documentación incluida en el paquete.
- `ACTA_DOCS_MCP_DATA_URL`: usa otra URL remota para el JSON de documentación.

Usa `ACTA_DOCS_MCP_DATA_URL` solo si confías completamente en la fuente configurada. El cliente de IA usará ese contenido como contexto para responder preguntas sobre ACTA.

## Herramientas disponibles

- `list_acta_docs`: lista las páginas de documentación disponibles.
- `read_acta_doc`: lee una página específica usando su `slug` e idioma.
- `search_acta_docs`: busca contenido dentro de la documentación de ACTA.

## Recursos disponibles

Las páginas de documentación se exponen usando este formato de URI:

```text
acta-docs://{locale}/{slug}
```

Los idiomas soportados actualmente son:

- `en`
- `es`

## Cuándo usar este MCP

Usa este MCP para preguntar sobre:

- Qué es ACTA.
- Cómo funciona la emisión y verificación de credenciales.
- Cómo integrarse con la API o SDK de ACTA.
- Cómo funciona la arquitectura documentada de ACTA.
- Qué endpoints, flujos o conceptos están explicados en la documentación oficial.

Este MCP está diseñado para documentación y soporte técnico. No reemplaza una integración directa con la API de ACTA.
