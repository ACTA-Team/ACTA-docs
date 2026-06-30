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
    "revoke",
    "Flujo de transacción",
    "Notas",
  ],
  content: `
# useCredential

Hook para operaciones de credenciales: emitir y revocar.

## Función

\`\`\`ts
useCredential(): {
  issue: (args: IssueArgs) => Promise<{ txId: string }>;
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
  issuerDid?: string;              // DID del emisor: un did:stellar registrado y resoluble
  signTransaction: Signer;         // Firma del XDR devuelto por el prepare en ACTA
  sourcePublicKey?: string;        // Cuenta G que firma (opcional; omitir cuando el relay firma vaults C)
  userSalt?: string;               // Salt de 32 bytes que selecciona una bóveda no predeterminada del propietario (opcional)
  contractId?: string;             // ID de contrato (opcional, usa el configurado por defecto)
}
\`\`\`

El titular se expresa dentro de \`vcData\` como \`credentialSubject.id\` (un DID); no hay un campo \`holder\` / wallet aparte. El \`issuerDid\` debe ser un \`did:stellar\` registrado y resoluble; las direcciones de wallet sueltas y \`did:pkh\` ya no se aceptan. El SDK realiza el alta automática del \`did:stellar\` del emisor mediante \`getOrCreateIssuerIdentity\`, de modo que los integradores obtienen la configuración del DID de emisor sin costo adicional.

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
      id: "did:stellar:...",   // DID del titular
      name: "John Doe"
    }
  }),
  issuer: "G...",
  issuerDid: "did:stellar:...",   // did:stellar registrado y resoluble
  signTransaction: async (xdr, { networkPassphrase }) => {
    // Firma el XDR con tu wallet
    return signedXdr;
  }
});
\`\`\`

## revoke

Revoca una credencial. La llamada envía el \`owner\` a la API para apuntar a la bóveda correcta.

### Argumentos

\`\`\`ts
{
  owner: string;                   // Vault owner (G o C smart wallet); se envía a la API
  vcId: string;                    // ID de credencial a revocar
  signTransaction: Signer;         // Firma del XDR de prepare
  date?: string;                   // Fecha ISO (opcional)
  sourcePublicKey?: string;        // Firmante G explícito (opcional / relay)
  userSalt?: string;               // Salt de 32 bytes que selecciona una bóveda no predeterminada del propietario (opcional)
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
- El titular es \`credentialSubject.id\` dentro de \`vcData\` (un DID); no hay un campo holder aparte
- El \`issuerDid\` debe ser un \`did:stellar\` registrado y resoluble; el SDK lo da de alta automáticamente mediante \`getOrCreateIssuerIdentity\`
- El método \`revoke\` envía el \`owner\` a la API y requiere que el \`owner\` firme la transacción
- La fecha de revocación se establece automáticamente a la fecha actual si no se provee
    `,
};
