import type { DocPage } from "@/@types/docs";

export const versions: DocPage = {
  slug: "versions",
  title: "Versiones y Changelog",
  section: "Bienvenida",
  tocItems: [
    "Línea de versiones actual",
    "Compatibilidad",
    "Novedades en v0.4.0",
    "Eliminado en v0.4.0",
    "Deprecaciones y retrocompatibilidad",
    "Dónde viven los changelogs",
  ],
  content: `
# Versiones y Changelog

Las versiones que describe esta documentación, cómo encajan entre sí y qué cambió en la línea de versiones actual.

## Línea de versiones actual

| Componente | Paquete / artefacto | Versión |
|-----------|--------------------|---------|
| SDK de credenciales | \`@acta-team/credentials\` | 1.1.4 |
| Librería DID | \`@acta-team/did-stellar\` | 0.1.1 |
| ACTA API | acta-api | 1.1.1 |
| dApp | dapp.acta.build | 2.1.1 |
| Contrato vc-vault | WASM de plantilla | 0.4.0 |
| Contrato vc-vault-factory | por red | 0.1.0 |
| Contrato did-stellar-registry | mainnet | 0.2.0 |
| Servidor MCP de docs | \`@acta-team/docs-mcp\` | 0.1.0 |

## Compatibilidad

- El **SDK 1.1.2+** requiere **acta-api 1.1.1** (la superficie de API de vc-vault-factory v0.4.0). Las versiones anteriores del SDK apuntan a endpoints eliminados y fallarán.
- Las URL base por defecto del SDK apuntan a la API alojada para ambas redes, que corre las versiones de arriba; \`GET /config\` te dice en tiempo de ejecución qué factory, hash de WASM de plantilla y registro DID usa un despliegue.
- Peer dependency del SDK: React 18 o 19.

## Novedades en v0.4.0

La línea de versiones actual ("vc-vault-factory v0.4.0 + did:stellar", 2026-06-30) introdujo:

- **Bóvedas single-tenant desplegadas por un factory**: una \`vc-vault\` por propietario, direcciones deterministas, en reemplazo de la bóveda multi-tenant anterior (v0.3.0).
- **Emisión deny-by-exception**: abierta por defecto; los propietarios bloquean/desbloquean emisores (\`deny-issuer\` / \`allow-issuer\`).
- **did:stellar como identidad obligatoria del emisor**, con el vínculo controller-firmante exigido por la API; el SDK hace auto-onboarding de los DID de emisor (\`getOrCreateIssuerIdentity\`).
- **Comisiones on-chain** vía el \`quote_fee\` del factory (mainnet 1 USDC, testnet 5 XLM), eliminando la lógica de comisiones del lado de la API y los overrides de comisión.
- **Bóvedas inmutables**: se eliminó el entrypoint \`upgrade\` de la bóveda.
- Endurecimiento del SDK 1.1.4: \`ActaApiError\` en cada fallo, timeouts de 30s, hooks memoizados, identidades en IndexedDB cifradas en reposo.
- dApp 2.1.x: el acceso de emisores replanteado como lista de bloqueo, almacenamiento de API keys solo por sesión, security headers, comprobaciones de seguridad de la transacción antes de firmar.

## Eliminado en v0.4.0

Si integraste contra v0.3.0, esto ya no existe:

- Endpoints: \`POST /contracts/vc/issue-linked\`, \`GET /contracts/vault/get-vc-parent\`, el batch \`authorize-issuers\`, las lecturas de lista/conteo de emisores autorizados, los endpoints de niveles de comisión por rol y los endpoints de whitelist de sponsors (\`open-to-all\`, \`add-sponsor\`, \`remove-sponsor\`).
- Campos de request: el campo \`holder\` separado (el holder ahora vive en \`vcData.credentialSubject.id\`) y cualquier override de comisión en los cuerpos de request.
- Identidad: \`did:pkh\` y direcciones de wallet a secas como DID de emisor.
- Métodos del SDK: \`vcIssueLinked\`/\`issueLinked\`, \`vaultGetVcParent\`/\`getVcParent\` (1.1.2) y \`vaultMigrate\`, el batch \`vaultAuthorizeIssuers\`, los helpers de whitelist de sponsored-vault (1.1.3).

## Deprecaciones y retrocompatibilidad

Siguen funcionando hoy, pero está previsto que cambien:

| Elemento | Estado |
|------|--------|
| \`POST /contracts/vault/authorize-issuer\` / \`revoke-issuer\` | Alias de retrocompatibilidad de \`allow-issuer\` / \`deny-issuer\` |
| \`actaContractId\` en \`GET /config\` | Alias de retrocompatibilidad de \`factoryContractId\` |
| URLs con prefijo de ruta (estilo \`acta.build/api/{network}/...\`) | Legacy; los hosts canónicos son \`api.{network}.acta.build\` |
| SDK \`createCredential\`, \`getDefaults\`, \`prepareStoreTx\`, \`prepareListVcIdsTx\`, \`prepareGetVcTx\`, \`vaultStore\` | Stubs deprecados, eliminación prevista para el SDK 2.0.0 |

## Dónde viven los changelogs

Cada repositorio mantiene su propio \`CHANGELOG.md\` en la [organización de GitHub ACTA-Team](https://github.com/ACTA-Team): la API, el SDK de credenciales, la dApp, los contratos, el monorepo de DID y este sitio de documentación.
    `,
};
