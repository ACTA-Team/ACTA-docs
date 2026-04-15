import type { DocPage } from "@/@types/docs";

export const useVaultRead: DocPage = {
  slug: "useVaultRead",
  title: "useVaultRead",
  section: "React SDK",
  tocItems: [
    "Función",
    "listVcIds",
    "Argumentos",
    "Valor de retorno",
    "Ejemplo",
    "getVc",
    "getVcParent",
    "verifyVc",
    "Notas",
  ],
  content: `
# useVaultRead

Hook para leer datos de la bóveda: listar IDs de credenciales, obtener credenciales, obtener info de VC padre, verificar credenciales.

## Función

\`\`\`ts
useVaultRead(): {
  listVcIds: (args: ListVcIdsArgs) => Promise<string[]>;
  getVc: (args: GetVcArgs) => Promise<unknown | null>;
  getVcParent: (args: GetVcParentArgs) => Promise<{ owner: string; vc_id: string } | null>;
  verifyVc: (args: VerifyVcArgs) => Promise<VaultVerifyVcResponse>;
}
\`\`\`

## listVcIds

Lista los IDs de credenciales de un propietario.

### Argumentos

\`\`\`ts
{
  owner: string;                   // Clave pública Stellar del propietario
  contractId?: string;             // ID de contrato (opcional, usa el configurado por defecto)
}
\`\`\`

### Valor de retorno

- \`Promise<string[]>\`: array de IDs de credenciales  

### Ejemplo

\`\`\`ts
import { useVaultRead } from "@acta-team/acta-sdk";

const { listVcIds } = useVaultRead();

const vcIds = await listVcIds({
  owner: "G..."
});
// vcIds: ["credential-1", "credential-2", ...]
\`\`\`

## getVc

Obtiene una credencial desde la bóveda.

### Argumentos

\`\`\`ts
{
  owner: string;                   // Clave pública Stellar del propietario
  vcId: string;                    // Identificador único de la credencial
  contractId?: string;             // ID de contrato (opcional, usa el configurado por defecto)
}
\`\`\`

### Valor de retorno

- \`Promise<unknown | null>\`: datos de la credencial o \`null\` si no existe  

### Ejemplo

\`\`\`ts
import { useVaultRead } from "@acta-team/acta-sdk";

const { getVc } = useVaultRead();

const vc = await getVc({
  owner: "G...",
  vcId: "credential-123"
});

if (vc) {
  console.log("Credencial encontrada:", vc);
} else {
  console.log("Credencial no encontrada");
}
\`\`\`

## getVcParent

Obtiene la info de la VC padre para una credencial vinculada. Devuelve \`null\` si la credencial no tiene vínculo padre.

### Argumentos

\`\`\`ts
{
  owner: string;                   // Clave pública Stellar del propietario
  vcId: string;                    // Identificador único de la credencial
  contractId?: string;             // ID de contrato (opcional, usa el configurado por defecto)
}
\`\`\`

### Valor de retorno

\`\`\`ts
Promise<{ owner: string; vc_id: string } | null>
\`\`\`

- Devuelve un objeto con la dirección \`owner\` de la VC padre y su \`vc_id\`, o \`null\` si la credencial no está vinculada a un padre.

### Ejemplo

\`\`\`ts
import { useVaultRead } from "@acta-team/acta-sdk";

const { getVcParent } = useVaultRead();

const parent = await getVcParent({
  owner: "G...",
  vcId: "linked-credential-456"
});

if (parent) {
  console.log("Propietario padre:", parent.owner);
  console.log("ID de VC padre:", parent.vc_id);
} else {
  console.log("Esta credencial no tiene vínculo padre");
}
\`\`\`

## verifyVc

Verifica el estado de una credencial en la bóveda.

### Argumentos

\`\`\`ts
{
  owner: string;                   // Clave pública Stellar del propietario
  vcId: string;                    // Identificador único de la credencial
  contractId?: string;             // ID de contrato (opcional, usa el configurado por defecto)
}
\`\`\`

### Valor de retorno

\`\`\`ts
Promise<{
  status: "valid" | "revoked";
  since?: string;                  // Fecha ISO desde cuándo tiene ese estado (opcional)
}>
\`\`\`

### Ejemplo

\`\`\`ts
import { useVaultRead } from "@acta-team/acta-sdk";

const { verifyVc } = useVaultRead();

const verification = await verifyVc({
  owner: "G...",
  vcId: "credential-123"
});

console.log(\`Estado: \${verification.status}\`); // "valid" o "revoked"
if (verification.since) {
  console.log(\`Desde: \${verification.since}\`);
}
\`\`\`

## Notes

- Todas estas operaciones son **solo lectura** y no requieren firmar transacciones  
- Los métodos manejan automáticamente distintos formatos de respuesta de la API  
- \`getVc\` devuelve \`null\` si la credencial no existe en la bóveda  
- \`getVcParent\` devuelve \`null\` si la credencial no tiene vínculo padre
- \`verifyVc\` siempre devuelve el estado actual de la credencial  
    `,
};
