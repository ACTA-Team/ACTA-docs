import type { DocPage } from "@/@types/docs";

export const aiPrompts: DocPage = {
  slug: "ai-prompts",
  title: "Recetas de Prompts",
  section: "IA",
  tocItems: [
    "Cómo usar estas recetas",
    "Entender ACTA",
    "Integrar el SDK",
    "Trabajar con la API",
    "Depurar errores",
    "DID e identidad",
    "Consejos para mejores respuestas",
  ],
  content: `
# Recetas de prompts

Con el servidor MCP de documentación conectado ([ver MCP](/es/mcp)), tu asistente puede responder sobre ACTA apoyándose en la documentación oficial. Estas son recetas listas para usar, agrupadas por tarea.

## Cómo usar estas recetas

Pega el prompt en tu asistente y ajústalo a tu caso. Cuando el MCP está activo, el modelo llamará a \`search_acta_docs\` o \`read_acta_doc\` para responder con fuentes reales en lugar de conocimiento genérico.

## Entender ACTA

> Explícame en 5 líneas qué es ACTA y en qué se diferencia una credencial de una bóveda. Usa la documentación oficial.

> ¿Cuál es la arquitectura de ACTA? Resume los componentes principales y cómo se relacionan.

## Integrar el SDK

> Muéstrame el código mínimo para emitir una credencial con el SDK de ACTA. Incluye imports y explica cada paso.

> ¿Cuál es la diferencia entre \`useVault\` y \`useVaultRead\`? Dame un ejemplo de cada uno.

> Genera un componente React que verifique una credencial usando el SDK de ACTA.

## Trabajar con la API

> Lista los endpoints de la API de ACTA para operaciones de bóveda y explica cuáles son de lectura y cuáles de escritura.

> ¿Cómo obtengo y uso una API key de ACTA? Muéstrame un ejemplo de request autenticado con \`curl\`.

> Explícame el flujo de una bóveda patrocinada (sponsored vault) y cuándo conviene usarla.

## Depurar errores

> Estoy recibiendo este error de contrato de ACTA: <pega el código o mensaje>. ¿Qué significa y cómo lo soluciono según la documentación?

> Mi request a la API devolvió <pega la respuesta>. Explícame el error y el siguiente paso.

## DID e identidad

> ¿Qué es \`did:stellar\` en ACTA y cómo se registra y resuelve un DID? Resume con la documentación oficial.

> Muéstrame cómo usar la librería TypeScript de DID de ACTA para resolver un DID.

## Consejos para mejores respuestas

- Pide explícitamente que use la documentación oficial ("según la documentación de ACTA").
- Da contexto de tu stack (framework, lenguaje) para recibir snippets aplicables.
- Al depurar, pega el error o el código exacto; el modelo puede cruzarlo con la página de errores.
- Si la respuesta parece genérica, pídele que cite la página de documentación que usó.
  `,
};
