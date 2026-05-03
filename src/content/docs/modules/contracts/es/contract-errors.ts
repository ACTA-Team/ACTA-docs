import type { DocPage } from "@/@types/docs";

const tocItems = [
  "Cómo aparecen los errores",
  "vc-vault",
  "Tabla de referencia",
  ...Array.from({ length: 14 }, (_, i) => `Error de bóveda ${i + 1}`),
  "vc-issuer-registry",
  "Tabla de referencia (registro de emisores)",
  ...Array.from({ length: 5 }, (_, i) => `Error de registro ${i + 1}`),
  "Fuente",
];

export const contractErrors: DocPage = {
  slug: "contract-errors",
  title: "Errores de contrato",
  section: "Contratos",
  tocItems,
  content: `
# Errores de contrato

Cuando un contrato Soroban hace \`panic\` con un \`ContractError\`, la red muestra **\`Error(Contract, #N)\`**, donde **N** es el código numérico. Cada apartado **Error de bóveda N** / **Error de registro N** explica ese código en lenguaje claro.

Los códigos son **por WASM**: vc-vault y vc-issuer-registry tienen cada uno su \`error.rs\`. El mismo **N** puede significar otra cosa en otro contrato.

## Cómo aparecen los errores

- **RPC / Horizon:** simulación o envío fallido incluye el código de error del contrato.
- **API ACTA:** el \`prepare\` puede devolver XDR; el código suele verse en el **\`submit\`** cuando la transacción se ejecuta on-chain.

## vc-vault

Crate \`contracts-acta/contracts/vc-vault\`, archivo \`src/error.rs\`. Los apartados **Error de bóveda 1** … **14** coinciden con el enum de este repositorio. Si tu WASM desplegado solo llega al código **10**, tu árbol aún no incluye los errores **11–14** (sponsor, id duplicado, traspaso de admin, VC padre en emisión vinculada).

### Tabla de referencia

| N | Variante |
|---|----------|
| 1 | \`AlreadyInitialized\` |
| 2 | \`IssuerNotAuthorized\` |
| 3 | \`IssuerAlreadyAuthorized\` |
| 4 | \`VaultRevoked\` |
| 5 | \`VCSAlreadyMigrated\` |
| 6 | \`VCNotFound\` |
| 7 | \`VCAlreadyRevoked\` |
| 8 | \`VaultNotInitialized\` |
| 9 | \`NotInitialized\` |
| 10 | \`InvalidVaultContract\` |
| 11 | \`NotAuthorizedSponsor\` |
| 12 | \`VCAlreadyExists\` |
| 13 | \`NoPendingAdmin\` |
| 14 | \`ParentVCInvalid\` |

### Error de bóveda 1

**Variante:** \`AlreadyInitialized\` (código **1**). Algo se inicializó dos veces: el **contrato** ya tiene admin, o este **owner** ya tiene bóveda. Casos típicos: repetir \`create_vault\` o \`create_sponsored_vault\` para el mismo owner, o init cuando la instancia ya está lista. **Qué hacer:** tratar la bóveda como existente; comprobar con lecturas antes de crear; no repetir el flujo de inicialización.

### Error de bóveda 2

**Variante:** \`IssuerNotAuthorized\` (código **2**). La operación exigía un emisor en la **lista autorizada** de la bóveda y no lo está (emisión, revocación u otra validación de emisor). **Qué hacer:** autorizar antes, o usar la dirección de emisor correcta.

### Error de bóveda 3

**Variante:** \`IssuerAlreadyAuthorized\` (código **3**). Intentaste añadir un emisor que **ya** está autorizado. **Qué hacer:** omitir duplicados o leer la lista actual y comparar.

### Error de bóveda 4

**Variante:** \`VaultRevoked\` (código **4**). La bóveda de ese owner está **revocada**; no se permiten escrituras que exijan bóveda activa. **Qué hacer:** no emitir ni mutar VCs para ese owner en esta bóveda; política de recuperación off-chain o nuevo owner si aplica.

### Error de bóveda 5

**Variante:** \`VCSAlreadyMigrated\` (código **5**). Se llamó **migrate** cuando ya no queda nada por migrar. **Qué hacer:** dar migración por terminada; no llamar migrate en bucle.

### Error de bóveda 6

**Variante:** \`VCNotFound\` (código **6**). El \`vc_id\` (y owner) no existe en el almacenamiento de la bóveda o la ruta de estado no tiene esa VC. **Qué hacer:** verificar owner + \`vc_id\`, listar ids primero, revisar red y id de contrato.

### Error de bóveda 7

**Variante:** \`VCAlreadyRevoked\` (código **7**). Operación sobre una VC **ya revocada** (por ejemplo revocar dos veces). **Qué hacer:** tratar la VC como inválida; refrescar estado desde cadena.

### Error de bóveda 8

**Variante:** \`VaultNotInitialized\` (código **8**). La lógica esperaba una **bóveda por owner** que aún no existe. **Qué hacer:** crear bóveda (\`create_vault\` / patrocinada) antes de emitir u otras operaciones.

### Error de bóveda 9

**Variante:** \`NotInitialized\` (código **9**). La **instancia del contrato** no fue inicializada (sin admin / bootstrap). **Qué hacer:** ejecutar la inicialización del contrato; confirmar el id de contrato correcto.

### Error de bóveda 10

**Variante:** \`InvalidVaultContract\` (código **10**). Un parámetro que debe apuntar a **este** vc-vault apunta a **otro** contrato. **Qué hacer:** pasar la dirección correcta del contrato bóveda en esa red.

### Error de bóveda 11

**Variante:** \`NotAuthorizedSponsor\` (código **11**). Creación de **bóveda patrocinada:** el sponsor no es admin del contrato ni está en la **lista de sponsors autorizados**, y el modo **abierto a todos** está desactivado. **Qué hacer:** que un admin añada el sponsor, active modo abierto, o firme un sponsor permitido.

### Error de bóveda 12

**Variante:** \`VCAlreadyExists\` (código **12**). Emisión con un \`vc_id\` que **ya existe** para ese owner; no se permite re-emisión con el mismo id. **Qué hacer:** usar un \`vc_id\` nuevo o tratar la credencial como ya emitida.

### Error de bóveda 13

**Variante:** \`NoPendingAdmin\` (código **13**). Se llamó aceptación de admin sin **traspaso pendiente**. **Qué hacer:** asegurar nominación previa (\`set_contract_admin\` / flujo equivalente); no aceptar dos veces.

### Error de bóveda 14

**Variante:** \`ParentVCInvalid\` (código **14**). **Emisión vinculada:** la VC padre no existe, es incorrecta o está **revocada**. **Qué hacer:** verificar owner + \`vc_id\` del padre y que la VC padre siga activa.

## vc-issuer-registry

Crate \`contracts-acta/contracts/vc-issuer-registry\`, archivo \`src/error.rs\`. Los códigos **1–5** son **solo** de este contrato.

### Tabla de referencia (registro de emisores)

| N | Variante |
|---|----------|
| 1 | \`AlreadyInitialized\` |
| 2 | \`IssuerNotFound\` |
| 3 | \`IssuerAlreadyExists\` |
| 4 | \`NotInitialized\` |
| 5 | \`InvalidMetadata\` |

### Error de registro 1

**Variante:** \`AlreadyInitialized\` (código **1**). \`initialize\` se llamó cuando el registro **ya** estaba configurado. **Qué hacer:** no reinicializar.

### Error de registro 2

**Variante:** \`IssuerNotFound\` (código **2**). Actualizar o borrar un emisor que **no** está en el registro. **Qué hacer:** revisar la dirección y el listado (off-chain o indexador).

### Error de registro 3

**Variante:** \`IssuerAlreadyExists\` (código **3**). Registro duplicado de un emisor **ya** guardado. **Qué hacer:** idempotencia a nivel de producto o tratar duplicado como éxito según reglas.

### Error de registro 4

**Variante:** \`NotInitialized\` (código **4**). Operaciones sobre el registro **antes** de \`initialize\`. **Qué hacer:** inicializar primero con admin/config correctos.

### Error de registro 5

**Variante:** \`InvalidMetadata\` (código **5**). Los metadatos **superan** el tamaño máximo permitido. **Qué hacer:** acortar campos JSON/URI; revisar límites en el código del contrato.

## Fuente

Enum y comentarios oficiales:

- \`contracts-acta/contracts/vc-vault/src/error.rs\`
- \`contracts-acta/contracts/vc-issuer-registry/src/error.rs\`
    `,
};
