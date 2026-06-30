import type { DocPage } from "@/@types/docs";

export const contractErrors: DocPage = {
  slug: "contract-errors",
  title: "Errores de contrato",
  section: "Contratos",
  tocItems: [
    "En un minuto",
    "Cuándo los ves",
    "Bóveda (vc-vault)",
    "Factory (vc-vault-factory)",
    "Registro did:stellar",
    "Errores de la API",
    "Para desarrolladores",
  ],
  content: `
# Errores de contrato

Si algo falla dentro del contrato Soroban, Stellar muestra **\`Error(Contract, #N)\`** - **N** es solo un número. **Importante:** el mismo **N** puede significar cosas distintas en el contrato **bóveda** que en el **factory** o el **registro did:stellar**. Siempre cruza el código con el contrato que invocaste. Los valores de **N** de abajo son **indicativos**, no oficiales: los enums pueden renumerarse entre versiones, así que identifica los errores por su **nombre/significado** y confírmalos contra el código fuente (ver *Para desarrolladores*).

## En un minuto

- **Factory (vc-vault-factory)** - Uno por red. Despliega contratos \`vc-vault\` single-tenant de forma determinista a partir de un WASM plantilla de bóveda, y entrega la cotización de comisión on-chain (\`quote_fee\`).
- **Bóveda (vc-vault)** - Una por owner, desplegada por el factory. Guarda las credenciales de ese owner. La emisión es **abierta por defecto** (deny-by-exception): el owner bloquea/desbloquea emisores. Las comisiones se cobran on-chain (las paga el emisor). Las bóvedas son **inmutables** (la plantilla queda fija al desplegar).
- **Registro did:stellar** - Otro contrato para los metadatos del DID del emisor; sus códigos de error están en la sección de abajo.
- **Errores de la API** - Algunos fallos (como un controlador de DID que no coincide) los devuelve la API de ACTA, no un contrato Soroban.

## Cuándo los ves

- **Casi siempre al enviar** - Prepare puede devolver XDR; el fallo suele verse solo cuando la transacción firmada se ejecuta on-chain.
- **RPC / Horizon** - En simulación o envío fallido viene el código de error del contrato.
- **Respuestas de la API** - Los errores de la API llegan como error estructurado en la respuesta HTTP, antes o en lugar de un código Soroban.

## Bóveda (vc-vault)

Los códigos de abajo son **solo** de \`vc-vault\` y siguen el modelo **deny-by-exception**: todo emisor está permitido hasta que el owner lo bloquea. Los números son indicativos: cruza por nombre.

| Error | Qué pasó y qué probar |
|-------|----------------------|
| **#1** · Ya inicializado | La bóveda o el contrato ya estaba configurado - p. ej. una llamada de init/create dos veces para el mismo owner. **Prueba:** comprobar si existe bóveda antes; no repetir init. |
| **#2** · Bóveda no inicializada | Aún no hay bóveda para ese owner. **Prueba:** crear la bóveda del owner (vía el factory) antes de emitir. |
| **#3** · Contrato no inicializado | La instancia del contrato nunca se arrancó (sin admin/config). **Prueba:** flujo de init del despliegue; confirmar el id \`C...\` correcto en esa red. |
| **#4** · Emisor bloqueado | Ese emisor está **bloqueado** para esta bóveda, así que la operación se rechaza. **Prueba:** el owner puede desbloquearlo con \`allow_issuer\`, o usa otro emisor (permitido). |
| **#5** · Emisor ya bloqueado | Se llamó a \`deny_issuer\` para un emisor que ya estaba bloqueado. **Prueba:** trátalo como idempotente; refresca la lista de bloqueos antes de cambiarla. |
| **#6** · Emisor no bloqueado | Se llamó a \`allow_issuer\` para un emisor que no estaba bloqueado. **Prueba:** no hay nada que deshacer; el emisor ya está permitido. |
| **#7** · Bóveda no activa / revocada | La bóveda de ese owner no está activa (p. ej. revocada) - no se permiten escrituras que exijan bóveda activa. **Prueba:** no emitir más ahí; recuperación off-chain si aplica. |
| **#8** · VC no encontrada | No hay credencial con ese \`vc_id\` para ese owner (typo, red o contrato equivocado). **Prueba:** listar ids, revisar \`owner\` + \`vc_id\`. |
| **#9** · VC ya existe | Emisión con un \`vc_id\` que ya existe para ese owner. **Prueba:** nuevo \`vc_id\` o tratar como ya emitida. |
| **#10** · VC ya revocada | Actuaste sobre una credencial ya revocada (p. ej. revocar dos veces). **Prueba:** refrescar estado on-chain; tratar la VC como inválida. |
| **#11** · Contrato de bóveda inválido | Un parámetro debía apuntar a **esta** bóveda y apunta a otro contrato. **Prueba:** usar el id de bóveda correcto para tu red. |
| **#12** · Comisión fuera de rango | La comisión enviada/observada queda fuera del rango que la bóveda acepta (frente al \`quote_fee\` del factory). **Prueba:** vuelve a cotizar la comisión y envía un valor dentro del rango permitido. |

## Factory (vc-vault-factory)

Un factory por red despliega y registra todas las \`vc-vault\`. Estos códigos son **solo** de \`vc-vault-factory\`. Los números son indicativos: cruza por nombre.

| Error | Qué pasó y qué probar |
|-------|----------------------|
| **Ya inicializado** | El factory ya estaba arrancado. **Prueba:** no reinicializar; usar el factory activo de esa red. |
| **No inicializado** | Una operación del factory corrió antes de configurarlo. **Prueba:** ejecutar el init del factory con admin/config correctos primero. |
| **Bóveda ya desplegada** | Se pidió un despliegue determinista para un \`(owner, userSalt)\` cuya bóveda ya existe. **Prueba:** darlo por hecho; leer la dirección de la bóveda derivada de \`(factory, owner, userSalt)\`. |
| **Despliegue fallido / plantilla inválida** | Falló desplegar desde el WASM plantilla de bóveda (p. ej. wasm hash erróneo/desconocido). **Prueba:** confirmar el wasm hash de la plantilla de bóveda configurado para esa red. |
| **Comisión fuera de rango** | Una comisión enviada a \`quote_fee\` / fijada como comisión custom por emisor queda fuera del rango permitido. **Prueba:** usar un valor dentro de los límites de la comisión estándar/custom. |
| **No autorizado** | Quien llama no puede hacer esa acción de admin/config (p. ej. cambiar comisiones, desplegar). **Prueba:** llamar con el admin correcto, o que el admin lo haga. |

## Registro did:stellar

Los códigos de aquí son **solo** del **registro did:stellar** - no los mezcles con los de la bóveda o el factory. Los números son indicativos: cruza por nombre.

| Error | Qué pasó y qué probar |
|-------|----------------------|
| **#1** · Ya inicializado | \`initialize\` cuando el registro ya estaba listo. **Prueba:** no reinicializar; usar el registro activo. |
| **#2** · Emisor no encontrado | Actualizar o borrar un emisor que no está en el registro. **Prueba:** verificar dirección; listar con tu indexador o herramientas. |
| **#3** · Emisor ya existe | Registrar un emisor que ya está guardado. **Prueba:** idempotencia u omitir duplicado según tu producto. |
| **#4** · No inicializado | Operación antes de \`initialize\`. **Prueba:** inicializar primero con admin/config correctos. |
| **#5** · Metadatos inválidos | Metadatos más grandes de lo que el contrato permite. **Prueba:** acortar JSON/URI; revisar límites en el código del contrato. |

## Errores de la API

Algunos fallos nunca llegan a un contrato: la API de ACTA los rechaza antes y devuelve un error estructurado.

- **\`issuerDid_controller_mismatch\`** - El emisor debe ser un **\`did:stellar\`** registrado y resoluble. La API exige una vinculación controlador-DID: el controlador on-chain del DID debe ser igual al **emisor que firma**. Si emites con un \`did:stellar\` cuyo controlador difiere del firmante, la solicitud falla con este error (lo devuelve la API, no es un código de contrato Soroban). Las direcciones de wallet "a secas" y los valores \`did:pkh\` ya no se aceptan como DID del emisor. **Prueba:** firmar con la wallet que controla el DID, o registrar/resolver un \`did:stellar\` cuyo controlador coincida con tu firmante.

## Para desarrolladores

Los enums oficiales están en **contracts-acta**: \`contracts/vc-vault/src/error.rs\`, \`contracts/vc-vault-factory/src/error.rs\` y el \`error.rs\` del registro did:stellar. Trata los números **N** de arriba como indicativos y confirma nombres/códigos contra ese código fuente para la versión que tengas desplegada.
    `,
};
