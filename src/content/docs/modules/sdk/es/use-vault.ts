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

La emisión es abierta por defecto, así que solo actúas sobre las excepciones: \`denyIssuer\` bloquea un emisor en la bóveda y \`allowIssuer\` desbloquea uno que fue denegado antes. Los nombres antiguos \`authorizeIssuer\` y \`revokeIssuer\` siguen disponibles como **alias de compatibilidad** (\`authorizeIssuer\` ≙ \`allowIssuer\`, \`revokeIssuer\` ≙ \`denyIssuer\` - llaman a las rutas de compatibilidad de la API con la misma semántica).

## Función

\`\`\`ts
useVault(): {
  createVault: (args: CreateVaultArgs) => Promise<{ txId: string }>;
  denyIssuer: (args: DenyIssuerArgs) => Promise<{ txId: string }>;
  allowIssuer: (args: AllowIssuerArgs) => Promise<{ txId: string }>;
  // alias de compatibilidad:
  authorizeIssuer: (args: AllowIssuerArgs) => Promise<{ txId: string }>; // misma semántica que allowIssuer
  revokeIssuer: (args: DenyIssuerArgs) => Promise<{ txId: string }>;     // misma semántica que denyIssuer
}
\`\`\`

## createVault

Crea (inicializa) una bóveda para un propietario.

### Argumentos

\`\`\`ts
{
  owner: string;                    // Vault: cuenta G... o wallet contrato C...
  ownerDid: string;                 // DID del propietario
  signTransaction: Signer;
  sourcePublicKey?: string;         // Opcional: firma cuenta G explícita
  userSalt?: string;                // Salt de 32 bytes; por defecto 32 bytes en cero = una bóveda canónica por propietario
  contractId?: string;
}
\`\`\`

La dirección de la bóveda se deriva de \`(factory, owner, userSalt)\`. Omite \`userSalt\` para la bóveda canónica del propietario; pasa un salt distinto de 32 bytes para desplegar una bóveda adicional del mismo propietario.

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
  ownerDid: "did:stellar:G...",
  signTransaction: async (xdr, { networkPassphrase }) => {
    // Firma el XDR con tu wallet
    return signedXdr;
  }
});
\`\`\`

## denyIssuer

Bloquea un emisor en una bóveda. Como la emisión es abierta por defecto, así es como un propietario impide que un emisor concreto escriba credenciales. También expuesto como \`revokeIssuer\` por compatibilidad.

### Argumentos

\`\`\`ts
{
  owner: string;                    // Propietario de la bóveda (G o C)
  issuer: string;                   // Emisor a bloquear
  signTransaction: Signer;
  sourcePublicKey?: string;         // Por defecto owner para owners G; se ignora para owners C (firma el relayer)
  userSalt?: string;                // Salt de 32 bytes que selecciona una bóveda no canónica (opcional)
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

Desbloquea un emisor que fue denegado antes, restaurando su capacidad por defecto de escribir credenciales en la bóveda. También expuesto como \`authorizeIssuer\` por compatibilidad.

### Argumentos

\`\`\`ts
{
  owner: string;                    // Propietario de la bóveda (G o C)
  issuer: string;                   // Emisor a desbloquear
  signTransaction: Signer;
  sourcePublicKey?: string;         // Por defecto owner para owners G; se ignora para owners C (firma el relayer)
  userSalt?: string;                // Salt de 32 bytes que selecciona una bóveda no canónica (opcional)
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
