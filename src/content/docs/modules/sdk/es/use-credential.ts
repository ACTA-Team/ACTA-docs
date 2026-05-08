import type { DocPage } from "@/@types/docs";

export const useCredential: DocPage = {
  slug: "useCredential",
  title: "useCredential",
  section: "Credentials SDK",
  tocItems: [
    "Función",
    "issue",
    "Argumentos",
    "Tipo de firmante",
    "Valor de retorno",
    "Ejemplo",
    "issueLinked",
    "revoke",
    "Flujo de transacción",
    "Notas",
  ],
  content: `
# useCredential

Hook para operaciones de credenciales: emitir, emitir vinculada y revocar.

## Función

\`\`\`ts
useCredential(): {
  issue: (args: IssueArgs) => Promise<{ txId: string }>;
  issueLinked: (args: IssueLinkedArgs) => Promise<{ txId: string }>;
  revoke: (args: RevokeArgs) => Promise<{ txId: string }>;
}
\`\`\`

## issue

Emite una credencial (la guarda en la bóveda y la marca como válida).

### Argumentos

\`\`\`ts
{
  owner: string;                    // Propietario del vault: cuenta G o contrato C (smart wallet)
  vcId: string;                    // Identificador único de la credencial
  vcData: string | object;         // Datos de credencial (string JSON u objeto). @context si falta se agrega
  issuer: string;                  // Clave pública Stellar del emisor
  issuerDid?: string;              // DID del emisor; si omites puede derivarse de la dirección
  signTransaction: Signer;         // Firma del XDR devuelto por el prepare en ACTA
  sourcePublicKey?: string;        // Cuenta G que firma (opcional; omitir cuando el relay firma vaults C)
  contractId?: string;             // ID de contrato (opcional, usa el configurado por defecto)
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
import { useCredential } from "@acta-team/credentials";

const { issue } = useCredential();

const { txId } = await issue({
  owner: "G...",
  vcId: "credential-123",
  vcData: JSON.stringify({
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://www.w3.org/ns/credentials/examples/v2"
    ],
    type: ["VerifiableCredential"],
    credentialSubject: {
      id: "did:pkh:stellar:testnet:G...",
      name: "John Doe"
    }
  }),
  issuer: "G...",
  issuerDid: "G...",
  signTransaction: async (xdr, { networkPassphrase }) => {
    // Firma el XDR con tu wallet
    return signedXdr;
  }
});
\`\`\`

## issueLinked

Emite una credencial vinculada a una VC padre. La VC padre debe existir y estar válida en su bóveda. Esto permite relaciones jerárquicas entre credenciales.

### Argumentos

\`\`\`ts
{
  owner: string;                    // Propietario del vault: cuenta G o contrato C (smart wallet)
  vcId: string;                    // Identificador único de la credencial
  vcData: string | object;         // Datos de credencial; @context opcional automático
  issuer: string;                  // Clave pública del emisor
  issuerDid?: string;              // DID del emisor
  signTransaction: Signer;         // Firma del XDR de prepare ACTA
  sourcePublicKey?: string;        // G firmante (opcional; vaults C con relay pueden omitir)
  contractId?: string;             // ID de contrato (opcional, usa el default)
  parentOwner: string;             // Owner de la VC padre
  parentVcId: string;              // Identificador de la VC padre
}
\`\`\`

### Valor de retorno

- \`Promise<{ txId: string }>\`: ID de la transacción después de enviarse a la red  

### Ejemplo

\`\`\`ts
import { useCredential } from "@acta-team/credentials";

const { issueLinked } = useCredential();

const { txId } = await issueLinked({
  owner: "G...",
  vcId: "linked-credential-456",
  vcData: JSON.stringify({
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://www.w3.org/ns/credentials/examples/v2"
    ],
    type: ["VerifiableCredential"],
    credentialSubject: {
      id: "did:pkh:stellar:testnet:G...",
      name: "John Doe",
      certification: "Nivel Avanzado"
    }
  }),
  issuer: "G...",
  signTransaction: async (xdr, { networkPassphrase }) => {
    // Firma el XDR con tu wallet
    return signedXdr;
  },
  parentOwner: "G...",             // Propietario de la VC padre
  parentVcId: "credential-123"    // ID de la VC padre
});
\`\`\`

## revoke

Revoca una credencial.

### Argumentos

\`\`\`ts
{
  owner: string;                   // Vault owner (G o C smart wallet)
  vcId: string;                    // ID de credencial a revocar
  signTransaction: Signer;         // Firma del XDR de prepare
  date?: string;                   // Fecha ISO (opcional)
  sourcePublicKey?: string;        // Firmante G explícito (opcional / relay)
  contractId?: string;             // ID de contrato (opcional)
}
\`\`\`

### Valor de retorno

- \`Promise<{ txId: string }>\`: ID de la transacción después de enviarse a la red  

### Ejemplo

\`\`\`ts
import { useCredential } from "@acta-team/credentials";

const { revoke } = useCredential();

const { txId } = await revoke({
  owner: "G...",
  vcId: "credential-123",
  signTransaction: async (xdr, { networkPassphrase }) => {
    // Firma el XDR con tu wallet
    return signedXdr;
  },
  date: new Date().toISOString() // Opcional
});
\`\`\`

## Flujo de transacción

Todos los métodos siguen el mismo flujo:

1. **Preparar**: llama a la API para obtener un XDR sin firmar y el network passphrase  
2. **Firmar**: usa \`signTransaction\` para firmar el XDR con el passphrase proporcionado  
3. **Enviar**: envía el XDR firmado a la API para procesarlo en la red  

El hook maneja automáticamente la diferencia entre las respuestas de “prepare” y “submit” usando type guards internos.

## Notas

- El método \`issue\` almacena automáticamente la credencial en la bóveda y la marca como válida en una sola transacción  
- El método \`revoke\` requiere que el \`owner\` firme la transacción  
- La fecha de revocación se establece automáticamente a la fecha actual si no se provee  
    `,
};
