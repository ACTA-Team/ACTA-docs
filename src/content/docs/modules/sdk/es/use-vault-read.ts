import type { DocPage } from "@/@types/docs";

export const useVaultRead: DocPage = {
  slug: "useVaultRead",
  title: "useVaultRead",
  section: "Credentials SDK",
  tocItems: [
    "Función",
    "listVcIds",
    "Argumentos",
    "Valor de retorno",
    "Ejemplo",
    "getVc",
    "verifyVc",
    "Notas",
  ],
  content: `
# useVaultRead

Hook para leer datos de la bóveda: listar IDs de credenciales, obtener credenciales, verificar credenciales.

## Función

\`\`\`ts
useVaultRead(): {
  listVcIds: (args: ListVcIdsArgs) => Promise<string[]>;
  getVc: (args: GetVcArgs) => Promise<unknown | null>;
  verifyVc: (args: VerifyVcArgs) => Promise<VaultVerifyVcResponse>;
}
\`\`\`

## listVcIds

Lista los IDs de credenciales de un propietario.

### Argumentos

\`\`\`ts
{
  owner: string;                   // Clave pública Stellar del propietario
  userSalt?: string;               // Salt de 32 bytes que selecciona una bóveda no predeterminada del propietario (opcional)
  contractId?: string;             // ID de contrato (opcional, usa el configurado por defecto)
}
\`\`\`

### Valor de retorno

- \`Promise<string[]>\`: array de IDs de credenciales  

### Ejemplo

\`\`\`ts
import { useVaultRead } from "@acta-team/credentials";

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
  userSalt?: string;               // Salt de 32 bytes que selecciona una bóveda no predeterminada del propietario (opcional)
  contractId?: string;             // ID de contrato (opcional, usa el configurado por defecto)
}
\`\`\`

### Valor de retorno

- \`Promise<unknown | null>\`: datos de la credencial o \`null\` si no existe  

### Ejemplo

\`\`\`ts
import { useVaultRead } from "@acta-team/credentials";

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

## verifyVc

Verifica el estado de una credencial en la bóveda.

### Argumentos

\`\`\`ts
{
  owner: string;                   // Clave pública Stellar del propietario
  vcId: string;                    // Identificador único de la credencial
  userSalt?: string;               // Salt de 32 bytes que selecciona una bóveda no predeterminada del propietario (opcional)
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
import { useVaultRead } from "@acta-team/credentials";

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

## Notas

- Todas estas operaciones son **solo lectura** y no requieren firmar transacciones
- Los métodos manejan automáticamente distintos formatos de respuesta de la API
- \`getVc\` devuelve \`null\` si la credencial no existe en la bóveda
- Pasa \`userSalt\` para leer de una bóveda no predeterminada del propietario
- \`verifyVc\` siempre devuelve el estado actual de la credencial
    `,
};
