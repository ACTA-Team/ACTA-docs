import type { DocPage } from "@/@types/docs";

export const sponsoredVault: DocPage = {
  slug: "api-sponsored-vault",
  title: "Bóveda patrocinada (Sponsored Vault)",
  section: "Referencia API",
  tocItems: [
    "Concepto",
    "On-chain (vc-vault-factory)",
    "API HTTP",
    "Prepare / submit",
    "Notas operativas",
  ],
  content: `
# Bóveda patrocinada (Sponsored Vault)

Una **bóveda patrocinada** es una bóveda ACTA mono-inquilino normal, desplegada mediante **\`deploy_sponsored\`** en el contrato **vc-vault-factory**. El **sponsor** invoca el factory y debe satisfacer la auth de Soroban (\`sponsor.require_auth()\`); el **owner** es el admin de la bóveda y no firma esta transacción. Úsala cuando una organización paga comisiones u orquesta el onboarding mientras el usuario final solo recibe la bóveda.

Para comparar, \`POST /contracts/vault/create\` prepara el despliegue del propio owner vía factory, donde normalmente firma el **owner**. El flujo patrocinado usa \`POST /contracts/sponsored-vault/create\`; la invocación debe satisfacer la auth on-chain del **sponsor** - en la práctica el XDR preparado suele firmarlo la cuenta del sponsor (ver **sourcePublicKey** abajo).

## Concepto

| Rol | Responsabilidad |
|-----|-----------------|
| **Sponsor** | Firma la transacción. Paga red/comisiones como cualquier invocación. |
| **Owner** | Recibe la bóveda; su dirección se guarda como admin de la bóveda; \`didUri\` se guarda para la bóveda. |

**Patrocinio abierto:** el patrocinio es **abierto**. Cualquier dirección sponsor puede llamar a \`deploy_sponsored\` para un owner (siempre sujeto a la auth y comisiones de Stellar/Soroban). En este modelo no hay lista de sponsors permitidos ni un interruptor de "abierto a todos".

El factory deriva la dirección de la bóveda de forma determinista a partir de \`(factory, owner, userSalt)\`, por lo que un despliegue patrocinado y un despliegue autoservicio para el mismo owner + salt resuelven a la misma bóveda. Volver a desplegar para un owner que ya tiene bóveda en ese salt falla on-chain (ya desplegada).

Al tener éxito, el factory emite un evento de bóveda desplegada con \`sponsor\`, \`owner\` y \`did_uri\`.

## On-chain (vc-vault-factory)

El entrypoint relevante del factory es:

| Función | Auth | Descripción |
|---------|------|-------------|
| \`deploy_sponsored(sponsor, owner, did_uri, user_salt)\` | Sponsor | Despliega de forma determinista la bóveda del owner si aún no está desplegada en ese salt. |

**HTTP público:** la API de ACTA documenta solo **\`POST /contracts/sponsored-vault/create\`** (prepare/submit para \`deploy_sponsored\`).

## API HTTP

Esta ruta usa el mismo middleware que otras rutas de escritura públicas \`/contracts/*\`: header **\`X-ACTA-Key\`**, API key válida y límites de tasa. Antepón las rutas con la URL base de tu red (ej. \`https://api.testnet.acta.build\`).

### POST /contracts/sponsored-vault/create

Prepara o envía \`deploy_sponsored\`.

**Cuerpo prepare:**

\`\`\`json
{
  "sponsor": "G...",
  "owner": "G...",
  "didUri": "did:stellar:...",
  "userSalt": "00...00",
  "sourcePublicKey": "G..."
}
\`\`\`

- **sponsor** (requerido): Dirección Stellar pasada al factory como sponsor (debe satisfacer \`sponsor.require_auth()\` cuando la transacción se firma y envía).
- **owner** (requerido): Owner de la bóveda (\`G...\`).
- **didUri** (requerido): URI del DID guardado para la bóveda.
- **userSalt** (opcional): salt de 32 bytes que selecciona la bóveda del owner; por defecto 32 bytes en cero (una bóveda canónica por owner).
- **sourcePublicKey** (requerido): Cuenta Stellar usada como **fuente de transacción** cuando la API prepara el XDR. La invocación firmada debe autorizar igualmente al **sponsor** en el contrato; normalmente la cuenta del sponsor es a la vez \`sponsor\` y la cuenta firmante/fuente.

**Cuerpo submit:** \`{ "signedXdr": "AAAA..." }\`

**Respuestas:** Prepare devuelve \`{ "xdr", "network" }\`; Submit devuelve \`{ "tx_id" }\`.

## Prepare / submit

Este endpoint de escritura sigue el flujo estándar de dos pasos:

1. **Prepare** - JSON con campos de la operación (sin \`signedXdr\`) devuelve \`xdr\` + \`network\` passphrase.
2. **Firmar** - la wallet Stellar firma el XDR para cumplir los requisitos de auth del sponsor.
3. **Submit** - haz POST a la misma ruta con \`{ "signedXdr" }\` y devuelve \`tx_id\`.

## Notas operativas

- Evita llamar a **create** cuando el owner ya tiene bóveda en el \`userSalt\` elegido; el despliegue on-chain falla si la bóveda ya existe. Mejor consulta la existencia de la bóveda on-chain o por API primero (ver operaciones de lectura de bóveda).
- Las comisiones de emisión se cobran on-chain en la bóveda (vía \`quote_fee\` del factory) y las paga el emisor al momento de emitir, con independencia de quién patrocinó el despliegue de la bóveda.
    `,
};
