import type { DocPage } from "@/@types/docs";

export const errors: DocPage = {
  slug: "api-errors",
  title: "Errores",
  section: "Referencia API",
  tocItems: [
    "Sobre de error",
    "Códigos de estado HTTP",
    "Autenticación y autorización",
    "Errores de validación",
    "Errores de DID del emisor",
    "Rate limiting",
    "Errores de Prepare/Submit",
    "Errores de contrato sobre HTTP",
    "Reintentos idempotentes",
  ],
  content: `
# Errores

Cada error que devuelve la API de ACTA usa un mismo sobre JSON con un código estable y legible por máquina. Ramifica por \`error\`, nunca por \`message\`.

## Sobre de error

\`\`\`json
{
  "error": "machine_readable_code",
  "message": "Human readable description",
  "details": { "optional": "context" },
  "request_id": "..."
}
\`\`\`

- \`error\` (siempre): código estable para ramificar.
- \`message\` (usualmente): descripción legible; su redacción puede cambiar entre releases.
- \`details\` (a veces): contexto estructurado, p. ej. \`{ "path", "method" }\` en \`404 not_found\`.
- \`request_id\` (siempre): id de correlación; inclúyelo al pedir soporte. Las respuestas \`5xx\` también llevan \`trace_id\`.
- \`retry_after\` (en \`429\`): segundos a esperar, replicado en el header \`Retry-After\`.

Las rutas desconocidas devuelven \`404 not_found\`; las excepciones no manejadas devuelven \`500 internal_error\` sin filtrar detalles internos.

## Códigos de estado HTTP

| Estado | Significado |
|--------|-------------|
| 200 / 201 | Éxito (201 para submits y creación de keys) |
| 400 | Parámetros inválidos o request malformado |
| 401 | API key ausente, inválida o expirada |
| 403 | Rol o propiedad no permitidos, u Origin prohibido |
| 404 | Recurso o ruta no encontrada |
| 409 | Conflicto (ya existe / ya revocado / estado desactualizado) |
| 410 | Gone (bóveda revocada) |
| 413 | Payload o campo demasiado grande |
| 429 | Rate limit excedido |
| 500 | Error interno (lleva \`trace_id\`) |
| 503 | Dependencia no disponible (p. ej. rate limiter, contrato no inicializado) |

## Autenticación y autorización

| Código | Estado | Significado y qué intentar |
|--------|--------|----------------------------|
| \`401\` (key ausente/inválida) | 401 | Falta el header \`X-ACTA-Key\`, la key es desconocida o expiró. **Intenta:** crea una key (ver [API Keys](doc:api-keys)) y envíala en cada request a \`/contracts/*\`. |
| \`network_mismatch\` | 400 | \`metadata.network\` no coincide con la red de la URL base. **Intenta:** alinea el body con el host que llamas. |
| Violación de propiedad | 403 | En \`issue\`, \`batch-issue\`, \`list-vc-ids\`, \`get-vc\` y \`push\`, el \`owner\` / \`fromOwner\` debe ser la wallet vinculada a tu API key (las keys admin están exentas). **Intenta:** usa la key creada para esa wallet. |

## Errores de validación

Se devuelven como \`400\` con un código por campo:

| Código | Significado |
|--------|-------------|
| \`owner_required\` / \`owner_invalid\` | Propietario de bóveda ausente o malformado (\`G...\`) |
| \`issuer_required\` / \`issuer_invalid\` | Dirección de emisor ausente o malformada |
| \`vcId_required\` | Falta el id de la credencial (máx. 64 caracteres) |
| \`vcData_required\` | Falta el payload de la credencial (máx. 10,000 caracteres) |
| \`userSalt_invalid\` | El salt debe ser 32 bytes en hex (64 caracteres hex) |
| \`vaultContract_invalid\` | Debe ser un contract id \`C...\` válido |
| \`limit_too_large\` | \`limit\` de paginación mayor a 200 |
| \`batch_empty\` / \`batch_too_large\` | El lote debe tener de 1 a 5 credenciales |
| \`vcs[i].vcId_too_long\` / \`vcs[i].vcData_too_long\` | Una entrada del lote excede los topes |
| \`payload_too_large\` | Body sobre el límite (413) |

## Errores de DID del emisor

La familia completa (\`issuerDid_required\`, \`issuerDid_invalid\`, \`issuerDid_unresolvable\`, \`issuerDid_controller_mismatch\`, \`issuerDid_network_mismatch\`, \`issuerDid_deactivated\`, \`issuerDid_registry_unavailable\`) está documentada con remedios en **[Errores de contrato](doc:contract-errors)**, y el trasfondo de did:stellar vive en la **[sección DID](doc:did-overview)**.

## Rate limiting

Las requests se limitan por API key en una ventana deslizante de 60 segundos, con buckets separados de lectura y escritura por rol (ver la tabla en **[Resumen de API](doc:api-overview)**).

| Código | Estado | Notas |
|--------|--------|-------|
| \`rate_limit_exceeded\` | 429 | Bucket de lectura agotado; espera \`Retry-After\` segundos |
| \`write_rate_limit_exceeded\` | 429 | Bucket de escritura agotado |
| \`rate_limit_unavailable\` | 503 | El backend del rate limiter está caído; reintenta luego |

Observa los headers \`X-RateLimit-*\` y \`X-WriteRateLimit-*\` para dosificar clientes proactivamente.

## Errores de Prepare/Submit

| Código | Estado | Significado y qué intentar |
|--------|--------|----------------------------|
| \`signed_xdr_invalid\` | 400 | El \`signedXdr\` enviado no se puede parsear. **Intenta:** firma exactamente el \`xdr\` que devolvió prepare, con la passphrase devuelta. |
| \`simulation_error\` | 400 | La simulación Soroban falló al preparar; el mensaje incluye la razón on-chain (a menudo un error de contrato, ver abajo). |
| \`tx_submit_error\` | 500 | El envío a la red falló. **Intenta:** reintenta con la misma \`Idempotency-Key\`. |

## Errores de contrato sobre HTTP

Cuando un contrato Soroban rechaza la operación, la API mapea \`Error(Contract, #N)\` a un código estable y un estado HTTP adecuado:

| Código | Estado | Causa on-chain |
|--------|--------|----------------|
| \`vault_already_exists\` | 409 | Ya hay bóveda desplegada para ese owner + salt |
| \`vault_revoked\` | 410 | La bóveda fue revocada; escrituras bloqueadas |
| \`vault_not_initialized\` | 404 | Aún no hay bóveda para este owner |
| \`vc_not_found\` | 404 | No hay credencial con ese \`vcId\` |
| \`vc_already_exists\` | 409 | \`vcId\` ya usado en esta bóveda |
| \`vc_already_revoked\` | 409 | La credencial ya está revocada |
| \`issuer_not_authorized\` | 403 | El emisor está bloqueado (denied) para esta bóveda |
| \`invalid_vault_contract\` | 400 | \`vaultContract\` no coincide con la bóveda llamada |
| \`vault_full\` | 409 | La bóveda llegó a su máximo de credenciales activas |
| \`input_too_long\` | 413 | Un campo excede su tope on-chain |
| \`batch_too_large\` / \`batch_empty\` | 400 | Tamaño de lote fuera de 1 a 5 |
| \`issuer_list_too_long\` | 400 | Lista de emisores denegados llena (1,000) |
| \`fee_out_of_bounds\` | 400 | El total de fee del lote desbordó |
| \`contract_not_initialized\` | 503 | Falta estado del contrato; revisa la red |
| \`no_pending_admin\` | 404 | Accept de admin sin nominación pendiente |

Para la semántica on-chain subyacente (y fallos de fee USDC/XLM como trustlines faltantes), ver **[Errores de contrato](doc:contract-errors)**.

## Reintentos idempotentes

Las rutas de escritura de contratos aceptan un header \`Idempotency-Key\` (hasta 200 caracteres). La primera respuesta de una key se cachea 24 horas; los reintentos la repiten con el header \`Idempotency-Replayed: true\`. Úsalo para que los reintentos de submit sean seguros tras timeouts o \`tx_submit_error\`.
    `,
};
