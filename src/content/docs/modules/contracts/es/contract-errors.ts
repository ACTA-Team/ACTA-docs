import type { DocPage } from "@/@types/docs";

export const contractErrors: DocPage = {
  slug: "contract-errors",
  title: "Errores de contrato",
  section: "Contratos",
  tocItems: [
    "En un minuto",
    "Cuándo los ves",
    "Comisión de emisión (USDC / XLM)",
    "Bóveda (vc-vault)",
    "Factory (vc-vault-factory)",
    "Registro did:stellar",
    "Errores de la API",
    "Para desarrolladores",
  ],
  content: `
# Errores de contrato

Si algo falla dentro de un contrato Soroban, Stellar muestra **\`Error(Contract, #N)\`** donde **N** es un número. **Importante:** el mismo **N** significa cosas distintas en la **bóveda** que en el **factory**, el **registro did:stellar** o el **token USDC** que cobra la comisión de emisión. Siempre cruza el código con el contrato que invocaste de verdad. Los códigos de abajo corresponden a los contratos v0.4.0 desplegados; los enums pueden renumerarse entre versiones, así que ante la duda confirma contra el código fuente (ver *Para desarrolladores*).

## En un minuto

- **Factory (vc-vault-factory)** - Uno por red. Despliega contratos \`vc-vault\` single-tenant de forma determinista a partir de un WASM plantilla de bóveda, y entrega la cotización de comisión on-chain (\`quote_fee\`).
- **Bóveda (vc-vault)** - Una por owner, desplegada por el factory. Guarda las credenciales de ese owner. La emisión es **abierta por defecto** (deny-by-exception): el owner bloquea/desbloquea emisores. La comisión de emisión se cobra on-chain (USDC en mainnet, XLM en testnet), la paga el emisor. Las bóvedas son **inmutables** (la plantilla queda fija al desplegar).
- **Registro did:stellar** - Otro contrato para los metadatos del DID del emisor; tiene sus propios códigos de error.
- **Token USDC** - La emisión cobra una comisión que transfiere el contrato del token USDC. Sus errores son de trustline y saldo, no de la bóveda (ver abajo).
- **Errores de la API** - Algunos fallos (como un controlador de DID que no coincide) los devuelve la API de ACTA antes de llegar a un contrato.

## Cuándo los ves

- **A menudo al enviar** - Prepare puede devolver XDR; el fallo suele verse solo cuando la transacción firmada se ejecuta on-chain.
- **A menudo al preparar** - La API simula al preparar, así que fallos on-chain (incluida la transferencia de la comisión en USDC) también pueden aparecer como el error de la llamada de prepare.
- **RPC / Horizon** - En simulación o envío fallido viene el código de error del contrato y un registro de eventos de diagnóstico.
- **Respuestas de la API** - Los errores de la API llegan como error estructurado en la respuesta HTTP, antes o en lugar de un código Soroban.

## Comisión de emisión (USDC / XLM)

Emitir una credencial cobra una **comisión on-chain** (cotizada por \`quote_fee\` del factory, la paga el **emisor**): en **mainnet** el token de comisión es **USDC** (1 USDC por credencial); en **testnet** es **XLM nativo** (5 XLM por credencial), así que ahí no hay trustline de por medio. La transferencia ocurre dentro del contrato del token de comisión, así que cuando falla el error viene del token, no de la bóveda. Es el fallo de emisión más común en producción (mainnet).

| Lo que ves | Qué pasó y qué probar |
|-------|----------------------|
| **"trustline entry is missing for account"** | La wallet emisora no tiene **trustline de USDC**, así que no puede tener ni enviar USDC. **Prueba:** agregar una trustline de USDC a la wallet emisora (USDC de Circle en mainnet) y reintentar. |
| **insufficient / "balance is not sufficient"** | El emisor tiene trustline de USDC pero **no le alcanza** para la comisión. **Prueba:** fondear la wallet emisora con USDC y reintentar. |

> El contrato del token USDC tiene sus **propios** códigos de error que **no** coinciden con los de la bóveda. Por ejemplo, su "trustline missing" es un código propio, sin relación con ningún \`#N\` de la bóveda. Identifica un fallo de comisión por el texto de diagnóstico (trustline / saldo) y por el id del contrato del token en el registro de eventos, no por el número a secas.

Si tu despliegue todavía no quiere cobrar comisión, el admin del factory puede desactivarla con \`set_fee_enabled(false)\` o fijar la comisión estándar en \`0\`.

## Bóveda (vc-vault)

Estos códigos son **solo** de \`vc-vault\`, bajo el modelo **deny-by-exception** (todo emisor está permitido hasta que el owner lo bloquea).

| Error | Qué pasó y qué probar |
|-------|----------------------|
| **#4** · VaultRevoked | La bóveda está revocada, así que se bloquean las escrituras que necesitan bóveda activa. **Prueba:** dejar de emitir en esta bóveda; recuperación off-chain. |
| **#6** · VCNotFound | No hay credencial con ese \`vc_id\` en esta bóveda (typo, red o bóveda equivocada). **Prueba:** listar los \`vc_id\` de la bóveda; revisar \`owner\` + \`vc_id\`. |
| **#7** · VCAlreadyRevoked | Revocaste una credencial que ya estaba revocada. **Prueba:** refrescar el estado on-chain; tratar la VC como inválida. |
| **#8** · VaultNotInitialized | Aún no hay bóveda para este owner. **Prueba:** crear la bóveda del owner (vía el factory) antes de emitir. |
| **#9** · NotInitialized | El contrato no tiene admin/config. **Prueba:** confirmar que llamas a la bóveda \`C...\` correcta para esta red. |
| **#10** · InvalidVaultContract | Un parámetro \`vault_contract\` no apunta a la bóveda que se está llamando. **Prueba:** pasar el id \`C...\` correcto; refrescar la dirección derivada y reintentar. |
| **#12** · VCAlreadyExists | La emisión usó un \`vc_id\` que ya existe en esta bóveda. **Prueba:** elegir otro \`vc_id\`, o tratar la credencial como ya emitida. |
| **#13** · NoPendingAdmin | \`accept_contract_admin\` corrió pero no hay nominación de admin pendiente. **Prueba:** nominar primero al nuevo admin y luego aceptar. |
| **#15** · VaultFull | La bóveda llegó al máximo de credenciales activas. **Prueba:** revocar VCs sin uso o usar otra bóveda. |
| **#16** · LimitTooLarge | Un \`limit\` de paginación supera el máximo del contrato. **Prueba:** pedir una página más pequeña. |
| **#17** · BatchTooLarge | Una emisión por lote supera \`MAX_BATCH_SIZE\`. **Prueba:** dividir en lotes más pequeños. |
| **#18** · BatchEmpty | Se llamó a la emisión por lote con una lista vacía. **Prueba:** incluir al menos una credencial. |
| **#19** · InputTooLong | Un campo (vc_id, vc_data, did_uri, issuer_did o fecha) supera su largo máximo. **Prueba:** acortar el campo. |
| **#20** · IssuerListTooLong | La **lista de emisores bloqueados** de la bóveda llegó a su máximo (1,000 entradas). **Prueba:** desbloquear emisores que ya no necesites bloquear antes de bloquear nuevos. |
| **#23** · FeeOutOfBounds | El total de comisión del lote (comisión por credencial x tamaño del lote) desbordó \`i128\`. **Prueba:** reducir el tamaño del lote. |
| **#24** · SourceNotAVault | El origen de un push no es una bóveda desplegada por el factory. **Prueba:** hacer push solo entre bóvedas del factory. |
| **#25** · IssuerDenied | El emisor está en la **lista de bloqueados** de esta bóveda, así que la emisión se rechaza. **Prueba:** el owner puede desbloquearlo con \`allow_issuer\`, o usa otro emisor (permitido). |
| **#26** · PushOwnerMismatch | La bóveda origen de un \`receive_push\` tiene un owner distinto al de esta bóveda. **Prueba:** hacer push solo entre bóvedas del mismo owner. |

> Los códigos **#2** (IssuerNotAuthorized) y **#3** (IssuerAlreadyAuthorized) están retirados del antiguo modelo de whitelist y ya no se lanzan, pero se conservan por estabilidad de ABI.

## Factory (vc-vault-factory)

Un factory por red despliega y registra todas las \`vc-vault\`. Estos códigos son **solo** de \`vc-vault-factory\`.

| Error | Qué pasó y qué probar |
|-------|----------------------|
| **#1** · NoPendingAdmin | \`accept_admin\` corrió pero no hay nominación de admin pendiente. **Prueba:** nominar primero al nuevo admin y luego aceptar. |
| **#2** · InvalidFeeAmount | Un monto de comisión es negativo. **Prueba:** pasar un monto no negativo. |
| **#3** · FeeOutOfBounds | Un monto de comisión supera \`MAX_FEE_AMOUNT\`. **Prueba:** usar un valor dentro del rango permitido. |
| **#4** · FeeBelowMin | Un monto de comisión está por debajo del \`MinFee\` configurado. **Prueba:** subir el monto al mínimo. |
| **#5** · FeeNotConfigured | Se llamó a \`set_fee_enabled(true)\` antes de fijar token + destino + comisión estándar. **Prueba:** configurar la comisión (\`set_fee_config\`) antes de activarla. |
| **#6** · ExpiryInPast | La expiración de una comisión custom por emisor no está en el futuro. **Prueba:** usar un timestamp futuro u omitir la expiración. |
| **#7** · NotInitialized | Falta \`VaultMeta\` (el constructor nunca corrió o se perdió el estado). **Prueba:** usar el factory activo de esta red. |

## Registro did:stellar

Los códigos de aquí son **solo** del **registro did:stellar**, el contrato que guarda los registros de DID del emisor. No los mezcles con los de la bóveda o el factory.

| Error | Qué pasó y qué probar |
|-------|----------------------|
| **#1** · DidAlreadyExists | Se llamó a \`register\` con un id de DID que ya existe. **Prueba:** resolver el DID existente, o usar un id nuevo. |
| **#2** · DidNotFound | Update / resolve / transfer referenció un DID no registrado. **Prueba:** verificar el id y la red del DID; registrarlo primero. |
| **#3** · VersionMismatch | Un update envió una versión que no coincide con el registro guardado (concurrencia optimista). **Prueba:** releer el registro y reintentar con la versión actual. |
| **#4** · DidDeactivated | El DID fue desactivado y ya no se puede actualizar ni usar. **Prueba:** registrar un DID nuevo. |
| **#5** · InvalidAuthKeyCount | La cantidad de claves de authentication está fuera de rango. **Prueba:** incluir un número válido de claves de authentication. |
| **#6** · InvalidAssertionKeyCount | La cantidad de claves de assertionMethod está fuera de rango. **Prueba:** ajustar las claves de assertion. |
| **#7** · InvalidKeyAgreementCount | La cantidad de claves de keyAgreement está fuera de rango. **Prueba:** ajustar las claves de key agreement. |
| **#8** · InvalidServiceCount | El número de servicios supera el límite. **Prueba:** reducir la cantidad de servicios. |
| **#9** · DuplicateKey | La misma clave aparece más de una vez donde debe ser única. **Prueba:** quitar el duplicado. |
| **#10** · KeyTooLong | Un valor de clave multibase supera el largo máximo. **Prueba:** revisar la codificación/largo de la clave. |
| **#11** · KeyEmpty | Un valor de clave está vacío. **Prueba:** proveer una clave multibase válida. |
| **#12** · ServiceTypeTooLong | Un \`type\` de servicio supera el largo máximo. **Prueba:** acortar el type. |
| **#13** · ServiceIdTooLong | El sufijo \`id\` de un servicio supera el largo máximo. **Prueba:** acortar el sufijo del id. |
| **#14** · ServiceIdInvalidFormat | El sufijo \`id\` de un servicio tiene un formato inválido. **Prueba:** usar un sufijo de id válido. |
| **#15** · ServiceEndpointInvalid | Un endpoint de servicio no es un URI válido. **Prueba:** proveer un URI de endpoint válido. |
| **#16** · MetadataUriInvalid | Un URI de metadatos es inválido. **Prueba:** proveer un URI válido. |
| **#17** · NoProposedAdmin | \`accept_admin\` corrió sin nominación de admin pendiente. **Prueba:** nominar primero y luego aceptar. |
| **#18** · ServiceTypeEmpty | Un \`type\` de servicio está vacío. **Prueba:** proveer un type no vacío. |
| **#19** · VersionOverflow | El contador de versión del registro desbordó. **Prueba:** es prácticamente inalcanzable en la práctica; contacta a los mantenedores. |
| **#20** · MetadataInconsistent | Los metadatos guardados son internamente inconsistentes. **Prueba:** reenviar un registro consistente. |
| **#21** · DuplicateServiceId | Dos servicios comparten el mismo sufijo \`id\`. **Prueba:** hacer único el sufijo de id de cada servicio. |

## Errores de la API

Algunos fallos nunca llegan a un contrato: la API de ACTA los rechaza antes y devuelve un error estructurado (un \`code\` estable más un mensaje).

**DID del emisor (\`did:stellar\` solamente):** el emisor debe ser un \`did:stellar\` registrado y resoluble cuyo controlador on-chain sea igual al emisor que firma. Las direcciones de wallet "a secas" y los valores \`did:pkh\` no se aceptan como DID del emisor.

| Code | Significado y qué probar |
|------|--------------------------|
| **\`issuerDid_required\`** | No se entregó un DID de emisor. **Prueba:** registrar tu \`did:stellar\` (la dApp te guía en el proceso, y el SDK puede auto-registrarlo) y pasarlo. |
| **\`issuerDid_invalid\`** | El valor no es un \`did:stellar\` bien formado. **Prueba:** usar la forma \`did:stellar:{red}:{id}\`. |
| **\`issuerDid_unresolvable\`** | El DID no resuelve en el registro de esta red (no registrado, o registrado en otra). **Prueba:** registrar el DID en esta red antes de emitir. |
| **\`issuerDid_controller_mismatch\`** | El controlador on-chain del DID no es el emisor que firma. **Prueba:** firmar con la wallet que controla el DID. |
| **\`issuerDid_network_mismatch\`** | La red del DID no coincide con la red en la que emites. **Prueba:** cambiar de red, o usar un DID registrado en esta. |
| **\`issuerDid_deactivated\`** | El DID fue desactivado. **Prueba:** registrar un DID nuevo. |
| **\`issuerDid_registry_unavailable\`** | No hay registro configurado para esta red en la API. **Prueba:** reintentar luego o contactar al operador. |

**Validación:** \`owner_invalid\` / \`owner_required\`, \`issuer_invalid\` / \`issuer_required\`, \`vcId_required\`, \`vcData_required\`, \`vaultContract_invalid\` (debe ser un \`C...\` válido) y \`userSalt_invalid\` (debe ser 32 bytes en hex) se devuelven ante solicitudes mal formadas. **Prueba:** corregir el campo y reenviar.

## Para desarrolladores

Los enums oficiales están en **contracts-acta**: \`contracts/vc-vault/src/error.rs\`, \`contracts/vc-vault-factory/src/error.rs\` y \`contracts/did-stellar-registry/src/errors.rs\`. El error de comisión en USDC viene del **Stellar Asset Contract** del token de comisión configurado (sus códigos los define Stellar, no ACTA). La API mapea los códigos de contrato reconocidos a \`code\`s string estables; confirma contra el código fuente para la versión que tengas desplegada.
    `,
};
