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

**Patrocinio abierto, on-chain y por HTTP:** en el contrato, cualquier dirección sponsor puede llamar a \`deploy_sponsored\` para un owner (sujeto a la auth y comisiones de Stellar/Soroban) - no hay lista de sponsors permitidos ni un interruptor de "abierto a todos". La ruta de la API de ACTA hace lo mismo: cualquier **API key estándar** puede patrocinar, pagando con su propia wallet.

El factory deriva la dirección de la bóveda de forma determinista a partir de \`(factory, owner, userSalt)\`, por lo que un despliegue patrocinado y un despliegue autoservicio para el mismo owner + salt resuelven a la misma bóveda. Volver a desplegar para un owner que ya tiene bóveda en ese salt falla on-chain (ya desplegada).

Al tener éxito, el factory emite un evento de bóveda desplegada con \`sponsor\`, \`owner\` y \`did_uri\`.

## On-chain (vc-vault-factory)

El entrypoint relevante del factory es:

| Función | Auth | Descripción |
|---------|------|-------------|
| \`deploy_sponsored(deployer, owner, did_uri, user_salt)\` | Deployer (sponsor) | Despliega de forma determinista la bóveda del owner si aún no está desplegada en ese salt. |

El campo \`sponsor\` de la API se mapea al parámetro \`deployer\` del contrato.

**HTTP público:** la API de ACTA documenta solo **\`POST /contracts/sponsored-vault/create\`** (prepare/submit para \`deploy_sponsored\`).

## API HTTP

Esta ruta acepta cualquier **API key estándar** (header \`X-ACTA-Key\`) y tiene límite de tasa por key. Antepón las rutas con la URL base de tu red (ej. \`https://sandbox-api.acta.build\`).

> **Solo puedes patrocinar con tu propia cuenta.** \`sponsor\` debe ser la \`wallet_address\` vinculada a tu API key, y \`sourcePublicKey\`, si lo envías, debe ser esa misma dirección; cualquier otra cosa devuelve \`403\`. Una key sin wallet vinculada también recibe \`403\`. El **owner** queda deliberadamente sin restricción: pagar la bóveda de otra persona es justamente para lo que sirve el endpoint.

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
- **sourcePublicKey** (requerido): Cuenta Stellar usada como **fuente de transacción** cuando la API prepara el XDR, lo que la convierte en la cuenta que paga la comisión de red. Para keys estándar debe ser igual a \`sponsor\`, de modo que el sponsor sea siempre a la vez la cuenta que autoriza y la que paga.

**Cuerpo submit:** \`{ "signedXdr": "AAAA..." }\`

**Respuestas:** Prepare devuelve \`{ "xdr", "network" }\`; Submit devuelve \`{ "tx_id" }\`.

## Prepare / submit

Este endpoint de escritura sigue el flujo estándar de dos pasos:

1. **Prepare** - JSON con campos de la operación (sin \`signedXdr\`) devuelve \`xdr\` + \`network\` passphrase.
2. **Firmar** - la wallet Stellar firma el XDR para cumplir los requisitos de auth del sponsor.
3. **Submit** - haz POST a la misma ruta con \`{ "signedXdr" }\` y devuelve \`tx_id\`.

## Notas operativas

- Evita llamar a **create** cuando el owner ya tiene bóveda en el \`userSalt\` elegido; el despliegue on-chain falla si la bóveda ya existe. Mejor consulta la existencia de la bóveda on-chain o por API primero (ver operaciones de lectura de bóveda).
- **La dirección de la bóveda es determinista, así que se puede ocupar primero.** Como \`(factory, owner, userSalt)\` fija la dirección y el patrocinio es abierto, cualquiera puede desplegar la bóveda canónica de un owner antes que él, con el \`didUri\` que elija. No es una toma de control: el constructor guarda al **owner** como dueño y admin de la bóveda, y \`set_vault_did\` exige la auth del owner, así que él puede corregir el DID. Lo que sí implica es que el despliegue propio del owner puede fallar porque la dirección ya está ocupada, y que el \`didUri\` inicial de una bóveda solo es tan confiable como quien la desplegó. Lee \`vault_did\` y confírmalo antes de tratarlo como del owner.
- Las comisiones de emisión se cobran on-chain en la bóveda (vía \`quote_fee\` del factory) y las paga el emisor al momento de emitir, con independencia de quién patrocinó el despliegue de la bóveda.
    `,
};
