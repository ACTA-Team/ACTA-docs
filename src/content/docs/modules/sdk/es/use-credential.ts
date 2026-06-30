import type { DocPage } from "@/@types/docs";

export const useCredential: DocPage = {
  slug: "useCredential",
  title: "useCredential",
  section: "Credentials SDK",
  tocItems: [
    "Función",
    "Identidad del emisor (did:stellar)",
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

## Identidad del emisor (did:stellar)

Emitir requiere que el emisor controle un **\`did:stellar\` registrado y resoluble** cuyo controlador on-chain sea igual a la cuenta del emisor. El SDK lo crea automáticamente: **\`getOrCreateIssuerIdentity\`** resuelve el \`did:stellar\` existente del emisor o registra uno nuevo antes de emitir, por lo que \`issue\` funciona sin que tengas que orquestar el registro del DID. Las direcciones de wallet planas / \`did:pkh\` ya no se aceptan como DID del emisor.

## issue

Emite una credencial (la guarda en la bóveda derivada del propietario y la marca como válida). La tarifa on-chain (por defecto 1 USDC, pagada por el emisor) se cobra en este paso.

### Argumentos

\`\`\`ts
{
  owner: string;                    // Propietario del vault: cuenta G o contrato C (bóveda derivada de él)
  vcId: string;                     // Identificador único de la credencial
  vcData: string | object;          // Datos de credencial (string JSON u objeto). @context si falta se agrega
  issuer: string;                   // Clave pública Stellar del emisor
  issuerDid?: string;               // did:stellar resoluble del emisor; auto-creado vía getOrCreateIssuerIdentity si se omite
  signTransaction: Signer;          // Firma del XDR devuelto por el prepare en ACTA
  userSalt?: string;                // salt de 32 bytes (hex) que selecciona la bóveda del propietario; por defecto todo en cero
  sourcePublicKey?: string;         // Cuenta G que firma (omitir para defaults)
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
      id: "did:stellar:testnet:znfxngsh46vkyqu6inrx4omphi",
      name: "John Doe"
    }
  }),
  issuer: "G...",
  issuerDid: "did:stellar:testnet:znfxngsh46vkyqu6inrx4omphi", // auto-creado si se omite
  signTransaction: async (xdr, { networkPassphrase }) => {
    // Firma el XDR con tu wallet
    return signedXdr;
  }
  // userSalt omitido → bóveda canónica de este propietario
});
\`\`\`

## revoke

Revoca una credencial en la bóveda derivada del propietario.

### Argumentos

\`\`\`ts
{
  owner: string;                   // Propietario del vault (G o C smart wallet); se envía para que el SDK derive la bóveda
  vcId: string;                    // ID de credencial a revocar
  signTransaction: Signer;         // Firma del XDR de prepare
  date?: string;                   // Fecha ISO (opcional)
  userSalt?: string;               // Selecciona la bóveda del propietario; por defecto todo en cero
  sourcePublicKey?: string;        // Firmante G explícito (omitir para defaults)
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

- El método \`issue\` almacena la credencial en la bóveda derivada del propietario y la marca como válida en una sola transacción; la tarifa on-chain se cobra entonces.
- El método \`revoke\` envía \`owner\` para que el SDK derive la bóveda correcta, y requiere que el propietario firme la transacción.
- La fecha de revocación se establece automáticamente a la fecha actual si no se provee.
    `,
};
