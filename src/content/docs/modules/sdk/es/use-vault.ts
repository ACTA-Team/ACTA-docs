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
    "authorizeIssuer",
    "revokeIssuer",
    "Flujo de transacción",
  ],
  content: `
# useVault

Hook para operaciones de bóveda: crear bóveda, autorizar emisor, revocar emisor.

## Función

\`\`\`ts
useVault(): {
  createVault: (args: CreateVaultArgs) => Promise<{ txId: string }>;
  authorizeIssuer: (args: AuthorizeIssuerArgs) => Promise<{ txId: string }>;
  revokeIssuer: (args: RevokeIssuerArgs) => Promise<{ txId: string }>;
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
  sourcePublicKey?: string;         // Opcional — firma cuenta G explícita
  contractId?: string;
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
  ownerDid: "did:stellar:G...",
  signTransaction: async (xdr, { networkPassphrase }) => {
    // Firma el XDR con tu wallet
    return signedXdr;
  }
});
\`\`\`

## authorizeIssuer

Autoriza un emisor en una bóveda.

### Argumentos

\`\`\`ts
{
  owner: string;
  issuer: string;
  signTransaction: Signer;
  sourcePublicKey?: string;
  contractId?: string;
}
\`\`\`

### Valor de retorno

- \`Promise<{ txId: string }>\`: ID de la transacción después de enviarse a la red  

### Ejemplo

\`\`\`ts
import { useVault } from "@acta-team/credentials";

const { authorizeIssuer } = useVault();

const { txId } = await authorizeIssuer({
  owner: "G...",
  issuer: "G...",
  signTransaction: async (xdr, { networkPassphrase }) => {
    // Firma el XDR con tu wallet
    return signedXdr;
  }
});
\`\`\`

## revokeIssuer

Revoca (elimina) un emisor autorizado de una bóveda.

### Argumentos

\`\`\`ts
{
  owner: string;
  issuer: string;
  signTransaction: Signer;
  sourcePublicKey?: string;
  contractId?: string;
}
\`\`\`

### Valor de retorno

- \`Promise<{ txId: string }>\`: ID de la transacción después de enviarse a la red  

### Ejemplo

\`\`\`ts
import { useVault } from "@acta-team/credentials";

const { revokeIssuer } = useVault();

const { txId } = await revokeIssuer({
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
