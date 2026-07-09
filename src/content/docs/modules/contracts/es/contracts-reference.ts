import type { DocPage } from "@/@types/docs";

export const contractsReference: DocPage = {
  slug: "contracts-reference",
  title: "Referencia de Contratos",
  section: "Contratos",
  tocItems: [
    "Resumen",
    "vc-vault",
    "Roles de la bóveda",
    "Funciones de la bóveda",
    "Límites de la bóveda",
    "Eventos de la bóveda",
    "vc-vault-factory",
    "Funciones del factory",
    "Direcciones deterministas",
    "Contratos desplegados",
    "Inmutabilidad y almacenamiento",
  ],
  content: `
# Referencia de Contratos

La interfaz pública de los contratos Soroban de ACTA, para equipos que integran a nivel de contrato (Rust, CLI o tooling propio) sin pasar por la API de ACTA. El código fuente vive en el repositorio **contracts-acta**; los códigos de error están en **[Errores de contrato](doc:contract-errors)** y la interfaz del registro did:stellar está documentada en **[Registro y Resolver](doc:did-registry)**.

## Resumen

| Contrato | Versión | Rol |
|----------|---------|------|
| \`vc-vault\` | 0.4.0 | Bóveda de credenciales single-tenant, una por propietario, instanciada por el factory a partir de un WASM de plantilla |
| \`vc-vault-factory\` | 0.1.0 | Uno por red; despliega bóvedas de forma determinista y cotiza la comisión de emisión |
| \`did-stellar-registry\` | 0.2.0 | Registros de DID de emisores (ver [Registro y Resolver](doc:did-registry)) |

## vc-vault

Cada bóveda la construye el factory con \`(vault_owner, contract_admin, did_uri, factory_address)\`. El admin de la bóveda empieza siendo el propietario.

## Roles de la bóveda

| Rol | Puede llamar |
|------|----------|
| \`contract_admin\` | \`nominate_admin\`; el nominado llama a \`accept_contract_admin\` (sin poderes de upgrade ni de comisiones) |
| Admin de la bóveda (el propietario por defecto) | \`set_vault_admin\`, \`deny_issuer\`, \`allow_issuer\`, \`revoke_vault\`, \`push\` |
| \`vault_owner\` | \`set_vault_did\`, \`revoke\` |
| Cualquier emisor no denegado | \`issue\`, \`batch_issue\` |

## Funciones de la bóveda

| Función | Auth | Notas |
|----------|------|-------|
| \`version() -> String\` | Ninguna | Devuelve la versión del crate, p. ej. \`"0.4.0"\` |
| \`vault_owner() -> Address\` | Ninguna | |
| \`vault_did() -> Option<String>\` | Ninguna | |
| \`set_vault_did(did_uri)\` | Propietario de la bóveda | \`did_uri\` hasta 256 bytes |
| \`set_vault_admin(new_admin)\` | Admin de la bóveda | |
| \`deny_issuer(issuer_addr)\` | Admin de la bóveda | No-op si ya está denegado; lista limitada a 1,000 |
| \`allow_issuer(issuer_addr)\` | Admin de la bóveda | No-op si no está en la lista |
| \`revoke_vault()\` | Admin de la bóveda | **Irreversible**; bloquea todas las escrituras |
| \`issue(vc_id, vc_data, vault_contract, issuer_addr, issuer_did) -> String\` | Emisor | Cobra al emisor la comisión cotizada por el factory; un \`vc_id\` duplicado falla |
| \`batch_issue(issuer_addr, vault_contract, issuer_did, vcs) -> Vec<String>\` | Emisor | \`vcs\` = lista de \`(vc_id, vc_data)\`, de 1 a 5 entradas; una sola transferencia de comisión de unidad x n |
| \`revoke(vc_id, date)\` | Propietario de la bóveda | La credencial debe ser válida; el estado pasa a \`Revoked(date)\` |
| \`push(vc_id, dest_vault)\` | Admin de la bóveda | Mueve una credencial válida a otra bóveda desplegada por el factory con el **mismo propietario**, y luego la borra localmente |
| \`receive_push(source_vault, source_owner, vc_id, vc_data, issuer_did)\` | Bóveda de origen | Valida el origen vía \`is_vault\` del factory y la regla de mismo propietario |
| \`list_vc_ids(offset, limit) -> Vec<String>\` | Ninguna | \`limit\` hasta 200 |
| \`vc_count() -> u32\` | Ninguna | |
| \`get_vc(vc_id) -> Option<VerifiableCredential>\` | Ninguna | Devuelve \`{ id, data, issuance_contract, issuer_did }\`; \`data\` es el payload cifrado |
| \`verify_vc(vc_id) -> VCStatus\` | Ninguna | \`Valid\`, \`Invalid\` o \`Revoked(date)\`. **Solo el estado**: no demuestra quién emitió; para eso revisa \`issuer_did\` |
| \`list_denied_issuers(offset, limit) -> Vec<Address>\` | Ninguna | \`limit\` hasta 200 |
| \`denied_issuer_count() -> u32\` | Ninguna | |
| \`nominate_admin(new_admin)\` / \`accept_contract_admin()\` | Admin / nominado | Traspaso del contract-admin en dos pasos |

## Límites de la bóveda

| Límite | Valor |
|-------|-------|
| \`vc_id\` | máx. 64 bytes |
| \`vc_data\` | máx. 10,000 bytes |
| \`did_uri\` / \`issuer_did\` | máx. 256 bytes |
| \`date\` | máx. 64 bytes |
| Tamaño de batch | máx. 5 credenciales |
| Tamaño de página de listado | máx. 200 |
| Emisores denegados | máx. 1,000 |

## Eventos de la bóveda

\`ContractInitialized\`, \`VaultCreated\`, \`AdminNominated\`, \`AdminTransferred\`, \`VaultAdminChanged\`, \`VaultDidChanged\`, \`IssuerDenied\`, \`IssuerAllowed\`, \`VaultRevoked\`, \`VCIssued\` (por credencial, también se emite en batch y en \`receive_push\`), \`VCRevoked\`, \`VCPushed\`.

## vc-vault-factory

Se construye una vez por red con \`VaultInitMeta { vault_hash, contract_admin }\`. El hash de la plantilla **no tiene setter**: publicar código nuevo de bóveda implica desplegar un factory nuevo.

## Funciones del factory

| Función | Auth | Notas |
|----------|------|-------|
| \`deploy(owner, did_uri, user_salt) -> Address\` | Propietario | Despliega la bóveda del propietario; emite \`VaultDeployed\` |
| \`deploy_sponsored(deployer, owner, did_uri, user_salt) -> Address\` | Deployer | El sponsor paga y firma; la bóveda pertenece a \`owner\`; emite \`SponsoredVaultDeployed\` |
| \`is_vault(vault_address) -> bool\` | Ninguna | True si y solo si fue desplegada por este factory |
| \`quote_fee(issuer) -> FeeQuote\` | Ninguna | \`{ enabled, amount, token, dest }\`; la comisión custom por emisor (con expiración opcional) gana sobre la comisión estándar |
| \`set_fee_config(token, dest, standard)\` | Admin | |
| \`set_fee_enabled(enabled)\` | Admin | Habilitarla requiere token + dest + standard configurados |
| \`set_fee_standard(amount)\` / \`set_min_fee(amount)\` | Admin | Los montos se validan como no negativos, por encima de la comisión mínima y como máximo 10^18 |
| \`set_fee_custom(issuer, amount, expires_at?)\` / \`remove_fee_custom(issuer)\` | Admin | La expiración debe estar en el futuro |
| \`nominate_admin\` / \`accept_admin\` / \`get_admin\` | Admin / nominado / ninguna | Traspaso en dos pasos |

## Direcciones deterministas

La dirección de la bóveda se deriva antes del despliegue, sin tabla de búsqueda:

\`\`\`
deploy_salt = keccak256(user_salt (32 bytes) || XDR(ScAddress(owner)))
\`\`\`

El propietario se codifica como **XDR** canónico de ScAddress (no la forma de texto \`G...\`). El mismo \`(owner, user_salt)\` siempre produce la misma dirección; el salt por defecto son 32 bytes en cero (una bóveda canónica por propietario). Mezclar el propietario en el salt evita colisiones entre propietarios y el front-running.

## Contratos desplegados

**Mainnet** (passphrase \`Public Global Stellar Network ; September 2015\`)

| Contrato | ID / hash |
|----------|-----------|
| vc-vault-factory | \`CCWNZ6UMUXCDOVP2TWOPVLI4KP4VY4YF7VKPN6XLYVHNFAT24NDB33CX\` |
| WASM de la plantilla vc-vault | \`2bd0323a98acb8469606808368da6c79824f2dd8391494b94ddbeb3d22c1a957\` |
| Configuración de comisión | Habilitada; 1 USDC por credencial (SAC de USDC \`CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75\`) |

**Testnet** (passphrase \`Test SDF Network ; September 2015\`)

| Contrato | ID / hash |
|----------|-----------|
| vc-vault-factory | \`CDRFQRIP4FA3WMPWCSAM3XEY6EM6EGKRYZRSCSVZ5NHCF6AGEVR2XEPQ\` |
| WASM de la plantilla vc-vault | \`2bd0323a98acb8469606808368da6c79824f2dd8391494b94ddbeb3d22c1a957\` |
| Configuración de comisión | Habilitada; 5 XLM por credencial (SAC de XLM nativo) |

El contrato \`vc-vault\` no tiene un contract ID independiente en ninguna de las dos redes: existe solo como instancias por propietario desplegadas por el factory.

## Inmutabilidad y almacenamiento

- **Sin entrypoints de upgrade**: ni la bóveda (desde 0.4.0) ni el factory pueden cambiar su código.
- Los datos de credenciales y los índices de la bóveda viven en almacenamiento Soroban **persistente**; el almacenamiento de instancia guarda el estado de admin. Los TTL se extienden tanto en lecturas como en escrituras (umbral ~30 días, extensión ~180 días con ledgers de 5 segundos).
- Los contratos se compilan para el target \`wasm32v1-none\` y se optimizan con la Stellar CLI.
    `,
};
