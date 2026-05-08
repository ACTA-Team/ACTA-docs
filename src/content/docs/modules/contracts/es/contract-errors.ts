import type { DocPage } from "@/@types/docs";

export const contractErrors: DocPage = {
  slug: "contract-errors",
  title: "Errores de contrato",
  section: "Contratos",
  tocItems: [
    "En un minuto",
    "Cuándo los ves",
    "Bóveda (vc-vault)",
    "Registro de emisores",
    "Para desarrolladores",
  ],
  content: `
# Errores de contrato

Si algo falla dentro del contrato Soroban, Stellar muestra **\`Error(Contract, #N)\`** — **N** es solo un número. **Importante:** el mismo **N** puede significar cosas distintas en el contrato **bóveda** que en el **registro de emisores**. Siempre cruza el código con el contrato que invocaste.

## En un minuto

- **Bóveda** — Guarda credenciales por owner: crear bóveda, emitir, revocar, flujos patrocinados y operaciones relacionadas.
- **Registro de emisores** — Otro contrato para metadatos de emisores; sus códigos de error están en la sección de abajo.

## Cuándo los ves

- **Casi siempre al enviar** — Prepare puede devolver XDR; el fallo suele verse solo cuando la transacción firmada se ejecuta on-chain.
- **RPC / Horizon** — En simulación o envío fallido viene el código de error del contrato.

## Bóveda (vc-vault)

Los códigos **1–14** son **solo** de \`vc-vault\`. Si tu WASM desplegado es antiguo, quizá no veas códigos por encima del **10**.

| Error | Qué pasó y qué probar |
|-------|----------------------|
| **#1** · Ya inicializado | La bóveda o el contrato ya estaba configurado — p. ej. \`create_vault\` / \`create_sponsored_vault\` dos veces para el mismo owner. **Prueba:** comprobar si existe bóveda antes; no repetir init. |
| **#2** · Emisor no autorizado | Ese emisor no está en la lista permitida de la bóveda para esta operación. **Prueba:** autorizar antes o usar la dirección de emisor correcta. |
| **#3** · Emisor ya autorizado | Añadiste un emisor que ya estaba permitido. **Prueba:** omitir duplicado o refrescar la lista antes de cambiar. |
| **#4** · Bóveda revocada | La bóveda de ese owner está revocada — no se permiten escrituras que exijan bóveda activa. **Prueba:** no emitir más ahí; recuperación off-chain si aplica. |
| **#5** · Ya migrado | Llamaste a migrar cuando no quedaba nada. **Prueba:** dar migración por hecha; no repetir migrate. |
| **#6** · VC no encontrada | No hay credencial con ese \`vc_id\` para ese owner (typo, red o contrato equivocado). **Prueba:** listar ids, revisar \`owner\` + \`vc_id\`. |
| **#7** · VC ya revocada | Actuaste sobre una credencial ya revocada (p. ej. revocar dos veces). **Prueba:** refrescar estado on-chain; tratar la VC como inválida. |
| **#8** · Bóveda no inicializada | Aún no hay bóveda para ese owner. **Prueba:** crear bóveda (normal o patrocinada) antes de emitir. |
| **#9** · No inicializado | La instancia del contrato nunca se arrancó (sin admin). **Prueba:** flujo de init del despliegue; confirmar el id \`C...\` correcto en esa red. |
| **#10** · Contrato de bóveda inválido | Un parámetro debía apuntar a **esta** bóveda y apunta a otro contrato. **Prueba:** usar el id de bóveda correcto para tu red. |
| **#11** · Sponsor no permitido | Bóveda patrocinada: el sponsor no es admin ni está en la lista y el modo “abierto a todos” está apagado. **Prueba:** que un admin añada sponsor, active modo abierto, o uses un sponsor permitido. |
| **#12** · VC ya existe | Emisión con un \`vc_id\` que ya existe para ese owner. **Prueba:** nuevo \`vc_id\` o tratar como ya emitida. |
| **#13** · Sin admin pendiente | Aceptar traspaso de admin sin nominación previa. **Prueba:** completar \`set_contract_admin\` (o equivalente) antes; no aceptar dos veces. |
| **#14** · VC padre inválida | Emisión vinculada: la VC padre falta, es errónea o está revocada. **Prueba:** revisar \`owner\` + \`vc_id\` del padre y que siga activa. |

## Registro de emisores

Los códigos **1–5** son **solo** de \`vc-issuer-registry\` — no los mezcles con los de la bóveda.

| Error | Qué pasó y qué probar |
|-------|----------------------|
| **#1** · Ya inicializado | \`initialize\` cuando el registro ya estaba listo. **Prueba:** no reinicializar; usar el registro activo. |
| **#2** · Emisor no encontrado | Actualizar o borrar un emisor que no está en el registro. **Prueba:** verificar dirección; listar con tu indexador o herramientas. |
| **#3** · Emisor ya existe | Registrar un emisor que ya está guardado. **Prueba:** idempotencia o omitir duplicado según tu producto. |
| **#4** · No inicializado | Operación antes de \`initialize\`. **Prueba:** inicializar primero con admin/config correctos. |
| **#5** · Metadatos inválidos | Metadatos más grandes de lo que el contrato permite. **Prueba:** acortar JSON/URI; revisar límites en el código del contrato. |

## Para desarrolladores

Los enums oficiales están en **contracts-acta**: \`contracts/vc-vault/src/error.rs\` y \`contracts/vc-issuer-registry/src/error.rs\`.
    `,
};
