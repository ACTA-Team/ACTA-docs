import type { DocPage } from "@/@types/docs";

export const contractErrors: DocPage = {
  slug: "contract-errors",
  title: "Errores de contrato",
  section: "Contratos",
  tocItems: [
    "En un minuto",
    "Cuándo los ves",
    "Bóveda (vc-vault)",
    "Errores a nivel de API",
    "Registro de emisores",
    "Registro DID (did-stellar-registry)",
    "Para desarrolladores",
  ],
  content: `
# Errores de contrato

Si algo falla dentro del contrato Soroban, Stellar muestra **\`Error(Contract, #N)\`** — **N** es solo un número. **Importante:** el mismo **N** puede significar cosas distintas en el contrato **bóveda**, el **registro de emisores** o el **registro DID**. Siempre cruza el código con el contrato que invocaste.

> **v0.4.0:** las bóvedas son mono-inquilino y las despliega el \`vc-vault-factory\`. La emisión es **abierta por defecto** — los propietarios **bloquean** emisores (denegar-por-excepción) en vez de autorizarlos. Los antiguos códigos de lista de autorizados y de VC vinculada ya no aplican.

## En un minuto

- **Bóveda** — Una \`vc-vault\` mono-inquilino (una por propietario) desplegada por el factory: emitir, revocar, bloquear/desbloquear emisor y operaciones relacionadas.
- **Registro de emisores** — Otro contrato para metadatos de emisores; sus códigos de error están en la sección de abajo.
- **Registro DID** — El contrato de registro de identidad \`did:stellar\`; gestiona registro, actualizaciones, transferencias y desactivación de DIDs.

## Cuándo los ves

- **Casi siempre al enviar** — Prepare puede devolver XDR; el fallo suele verse solo cuando la transacción firmada se ejecuta on-chain.
- **RPC / Horizon** — En simulación o envío fallido viene el código de error del contrato.

## Bóveda (vc-vault)

Los códigos de abajo son **solo** de \`vc-vault\`.

| Error | Qué pasó y qué probar |
|-------|----------------------|
| **#1** · Bóveda ya existe | Ya existe una bóveda para ese owner con este \`userSalt\` — p. ej. desplegar dos veces para el mismo owner. **Prueba:** comprobar si existe bóveda antes; no repetir el deploy. |
| **#2** · Emisor bloqueado | Ese emisor fue **bloqueado** en la bóveda (denegar-por-excepción). **Prueba:** el propietario puede \`allow_issuer\` para desbloquear, o emitir desde una cuenta no bloqueada. |
| **#3** · Emisor ya en ese estado | Bloqueaste un emisor ya bloqueado, o desbloqueaste uno que no lo estaba. **Prueba:** refrescar la lista de bloqueados antes de cambiarla. |
| **#4** · Bóveda revocada / inactiva | La bóveda de ese owner está revocada o inactiva — no se permiten escrituras que exijan bóveda activa. **Prueba:** no emitir más ahí; recuperación off-chain si aplica. |
| **#6** · VC no encontrada | No hay credencial con ese \`vc_id\` para ese owner (typo, red o bóveda equivocada). **Prueba:** listar ids, revisar \`owner\` + \`vc_id\` + \`userSalt\`. |
| **#7** · VC ya revocada | Actuaste sobre una credencial ya revocada (p. ej. revocar dos veces). **Prueba:** refrescar estado on-chain; tratar la VC como inválida. |
| **#8** · Bóveda no inicializada | Aún no hay bóveda para ese owner. **Prueba:** desplegar bóveda (normal o patrocinada) antes de emitir. |
| **#9** · No inicializado | La instancia del contrato nunca se arrancó (sin admin). **Prueba:** flujo de init del despliegue; confirmar el id correcto del factory/bóveda en esa red. |
| **#10** · Contrato de bóveda inválido | Un parámetro debía apuntar a **esta** bóveda y apunta a otro contrato. **Prueba:** usar el id de bóveda correcto para tu red, o derivarlo de \`(factory, owner, userSalt)\`. |
| **#12** · VC ya existe | Emisión con un \`vc_id\` que ya existe para ese owner. **Prueba:** nuevo \`vc_id\` o tratar como ya emitida. |
| **#13** · Sin admin pendiente | Aceptar traspaso de admin sin nominación previa. **Prueba:** completar \`set_contract_admin\` (o equivalente) antes; no aceptar dos veces. |
| **#15** · Bóveda llena | La bóveda alcanzó el número máximo de VCs activas. **Prueba:** revocar VCs no usadas o usar una nueva bóveda. |
| **#16** · Límite muy grande | El \`limit\` de paginación excede \`MAX_LIST_LIMIT\`. **Prueba:** usar un tamaño de página menor. |
| **#17** · Lote muy grande | La solicitud de emisión por lote excede \`MAX_BATCH_SIZE\`. **Prueba:** dividir en lotes más pequeños. |
| **#18** · Lote vacío | Emisión por lote llamada con lista \`vcs\` vacía. **Prueba:** incluir al menos una VC en el lote. |
| **#19** · Input muy largo | Un campo de texto excede su longitud máxima por campo. **Prueba:** acortar el valor del campo. |
| **#22** · Monto de fee inválido | El monto del fee es negativo. **Prueba:** usar un valor de fee no negativo. |
| **#23** · Fee fuera de rango | El monto del fee excede \`MAX_FEE_AMOUNT\`. **Prueba:** usar un fee menor, o apoyarte en la tarifa estándar del factory. |

## Errores a nivel de API

Algunos errores vienen de la **API de ACTA** antes de que la transacción llegue al contrato — son códigos de texto, no \`Error(Contract, #N)\`:

| Error | Qué pasó y qué probar |
|-------|----------------------|
| **\`issuerDid_controller_mismatch\`** | El controlador on-chain del \`issuerDid\` no es igual al emisor que firma. La API exige este vínculo controlador↔DID al emitir. **Prueba:** emitir con el DID que realmente controlas, o transferir el controlador del DID a tu cuenta emisora. |

## Registro de emisores

Los códigos **1–5** son **solo** de \`vc-issuer-registry\` — no los mezcles con los de la bóveda.

| Error | Qué pasó y qué probar |
|-------|----------------------|
| **#1** · Ya inicializado | \`initialize\` cuando el registro ya estaba listo. **Prueba:** no reinicializar; usar el registro activo. |
| **#2** · Emisor no encontrado | Actualizar o borrar un emisor que no está en el registro. **Prueba:** verificar dirección; listar con tu indexador o herramientas. |
| **#3** · Emisor ya existe | Registrar un emisor que ya está guardado. **Prueba:** idempotencia o omitir duplicado según tu producto. |
| **#4** · No inicializado | Operación antes de \`initialize\`. **Prueba:** inicializar primero con admin/config correctos. |
| **#5** · Metadatos inválidos | Metadatos más grandes de lo que el contrato permite. **Prueba:** acortar JSON/URI; revisar límites en el código del contrato. |

## Registro DID (did-stellar-registry)

Los códigos **1–20** son **solo** de \`did-stellar-registry\` — el registro on-chain de identificadores \`did:stellar\`.

| Error | Qué pasó y qué probar |
|-------|----------------------|
| **#1** · DID ya existe | \`register\` con un \`did_id\` que ya tiene registro. **Prueba:** resolver el DID primero; usar un identificador diferente si ya está tomado. |
| **#2** · DID no encontrado | \`update\` / \`transfer_controller\` / \`deactivate\` para un DID desconocido. **Prueba:** verificar el string del DID y la red. |
| **#3** · Versión no coincide | \`expected_version\` no coincide con la versión on-chain actual. **Prueba:** releer el registro, obtener la última versión y reintentar. |
| **#4** · DID desactivado | Mutación sobre un DID desactivado (tombstone). **Prueba:** la desactivación es irreversible; crear un nuevo DID. |
| **#5** · Conteo de claves auth inválido | El conteo de \`authentication\` está fuera del rango permitido (1–3). **Prueba:** incluir entre 1 y 3 claves de autenticación. |
| **#6** · Conteo de claves de aserción inválido | El conteo de \`assertion_method\` excede el máximo (3). **Prueba:** reducir la cantidad de claves de aserción. |
| **#7** · Conteo de key agreement inválido | El conteo de \`key_agreement\` excede el máximo (1). **Prueba:** incluir como máximo 1 clave de key agreement. |
| **#8** · Conteo de servicios inválido | El conteo de \`services\` excede el máximo (3). **Prueba:** reducir la cantidad de servicios. |
| **#9** · Clave duplicada | El mismo \`public_key_multibase\` aparece dos veces en una misma relación. **Prueba:** eliminar la clave duplicada. |
| **#10** · Clave muy larga | \`public_key_multibase\` excede la longitud máxima (128 chars). **Prueba:** verificar la codificación de la clave. |
| **#11** · Clave vacía | \`public_key_multibase\` está vacía. **Prueba:** proveer una clave pública válida codificada en multibase. |
| **#12** · Tipo de servicio muy largo | \`service.service_type\` excede la longitud máxima (64 chars). **Prueba:** acortar el tipo de servicio. |
| **#13** · ID de servicio muy largo | \`service.id_suffix\` excede la longitud máxima (32 chars). **Prueba:** usar un ID de servicio más corto. |
| **#14** · Formato de ID de servicio inválido | \`service.id_suffix\` no coincide con el patrón requerido (\`^[a-z0-9-]+$\`). **Prueba:** usar solo letras minúsculas, dígitos y guiones. |
| **#15** · Endpoint de servicio inválido | \`service.service_endpoint\` no es una URL \`https://\` válida o excede la longitud máxima (255 chars). **Prueba:** proveer una URL HTTPS válida. |
| **#16** · URI de metadatos inválido | \`metadata_uri\` no es una URL \`https://\` válida o excede la longitud máxima (255 chars). **Prueba:** proveer una URL HTTPS válida. |
| **#17** · Sin admin propuesto | \`accept_admin\` sin admin propuesto previamente. **Prueba:** llamar primero a la función de proponer admin. |
| **#18** · Tipo de servicio vacío | \`service.service_type\` está vacío. **Prueba:** proveer un tipo de servicio no vacío. |
| **#19** · Overflow de versión | La versión del registro alcanzó el máximo (\`u32::MAX\`). **Prueba:** extremadamente improbable en la práctica; contactar soporte. |
| **#20** · Metadatos inconsistentes | Se proporcionó \`metadata_hash\` pero falta \`metadata_uri\`. **Prueba:** proveer ambos \`metadata_uri\` y \`metadata_hash\`, u omitir ambos. |

## Para desarrolladores

Los enums oficiales están en **contracts-acta**: \`contracts/vc-vault-factory/src/error.rs\`, \`contracts/vc-vault/src/error.rs\`, \`contracts/vc-issuer-registry/src/error.rs\` y \`contracts/did-stellar-registry/src/errors.rs\`. El código \`issuerDid_controller_mismatch\` se aplica en la API de ACTA, no en el contrato.
    `,
};
