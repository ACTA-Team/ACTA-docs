import type { DocPage } from "@/@types/docs";

export const useVault: DocPage = {
  slug: "useVault",
  title: "useVault",
  section: "Credentials SDK",
  tocItems: [
    "Función",
    "createVault",
    "Argumentos",
    "Tipo de firmante",
    "Valor de retorno",
    "Ejemplo",
    "denyIssuer",
    "allowIssuer",
    "Flujo de transacción",
  ],
  content: `
# useVault

Hook para operaciones de bóveda: crear bóveda, bloquear (deny) un emisor, desbloquear (allow) un emisor.

> **Denegar-por-excepción (v0.4.0):** la emisión es abierta por defecto. Los propietarios ya no autorizan emisores - los **bloquean** con \`denyIssuer\` y los **desbloquean** con \`allowIssuer\`. \`authorizeIssuer\` / \`revokeIssuer\` siguen existiendo como **alias** (authorize→allow, revoke→deny) por retrocompatibilidad.

## Función

\`\`\`ts
useVault(): {
  createVault: (args: CreateVaultArgs) => Promise<{ txId: string }>;
  denyIssuer: (args: DenyIssuerArgs) => Promise<{ txId: string }>;
  allowIssuer: (args: AllowIssuerArgs) => Promise<{ txId: string }>;
  // alias (retrocompatibilidad):
  authorizeIssuer: (args: AllowIssuerArgs) => Promise<{ txId: string }>;  // → allowIssuer
  revokeIssuer: (args: DenyIssuerArgs) => Promise<{ txId: string }>;      // → denyIssuer
}
\`\`\`

## createVault

Despliega una bóveda mono-inquilino para un propietario a través del factory.

### Argumentos

\`\`\`ts
{
  owner: string;                    // Vault: cuenta G... o wallet contrato C...
  ownerDid: string;                 // DID del propietario
  signTransaction: Signer;
  userSalt?: string;                // salt de 32 bytes (hex) que selecciona la bóveda; por defecto todo en cero (bóveda canónica)
  sourcePublicKey?: string;         // Firmante G explícito; por defecto el owner para bóvedas G si se omite
}
\`\`\`

### Tipo de firmante

\`\`\`ts
type Signer = (
  unsignedXdr: string,
  opts: { networkPassphrase: string }
) => Promise<string>;
\`\`\`

### Valor de retorno

- \`Promise<{ txId: string }>\`: ID de la transacción después de enviarse a la red

### Ejemplo

\`\`\`ts
import { useVault } from "@acta-team/credentials";

const { createVault } = useVault();

const { txId } = await createVault({
  owner: "G...",
  ownerDid: "did:stellar:testnet:znfxngsh46vkyqu6inrx4omphi",
  signTransaction: async (xdr, { networkPassphrase }) => {
    // Firma el XDR con tu wallet
    return signedXdr;
  }
  // userSalt omitido → bóveda canónica de este propietario
});
\`\`\`

## denyIssuer

Bloquea un emisor para que ya no pueda escribir en la bóveda del propietario.

### Argumentos

\`\`\`ts
{
  owner: string;                    // Propietario de la bóveda (G o C)
  issuer: string;                   // Cuenta del emisor a bloquear
  signTransaction: Signer;
  userSalt?: string;                // Selecciona la bóveda; por defecto todo en cero
  sourcePublicKey?: string;
}
\`\`\`

### Valor de retorno

- \`Promise<{ txId: string }>\`: ID de la transacción después de enviarse a la red

### Ejemplo

\`\`\`ts
import { useVault } from "@acta-team/credentials";

const { denyIssuer } = useVault();

const { txId } = await denyIssuer({
  owner: "G...",
  issuer: "G...",
  signTransaction: async (xdr, { networkPassphrase }) => {
    // Firma el XDR con tu wallet
    return signedXdr;
  }
});
\`\`\`

## allowIssuer

Quita un emisor de la lista de bloqueo, restaurando su capacidad (por defecto) de emitir.

### Argumentos

\`\`\`ts
{
  owner: string;                    // Propietario de la bóveda (G o C)
  issuer: string;                   // Emisor a desbloquear
  signTransaction: Signer;
  userSalt?: string;                // Selecciona la bóveda; por defecto todo en cero
  sourcePublicKey?: string;
}
\`\`\`

### Valor de retorno

- \`Promise<{ txId: string }>\`: ID de la transacción después de enviarse a la red

### Ejemplo

\`\`\`ts
import { useVault } from "@acta-team/credentials";

const { allowIssuer } = useVault();

const { txId } = await allowIssuer({
  owner: "G...",
  issuer: "G...",
  signTransaction: async (xdr, { networkPassphrase }) => {
    // Firma el XDR con tu wallet
    return signedXdr;
  }
});
\`\`\`

## Flujo de transacción

Todos los métodos siguen el mismo flujo:

1. **Preparar**: llama a la API para obtener un XDR sin firmar y el network passphrase
2. **Firmar**: usa \`signTransaction\` para firmar el XDR con el passphrase proporcionado
3. **Enviar**: envía el XDR firmado a la API para procesarlo en la red

El hook maneja automáticamente la diferencia entre las respuestas de “prepare” y “submit” usando type guards internos.
    `,
};
