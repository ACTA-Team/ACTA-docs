import type { DocPage } from "@/@types/docs";

export const verification: DocPage = {
  slug: "zk-verification",
  title: "Verificación de Pruebas",
  section: "Pruebas de Conocimiento Cero",
  tocItems: [
    "Resumen",
    "Verificación On-Chain",
    "Proceso de Verificación",
    "Nullifiers y Protección contra Reutilización",
    "Resultado de Verificación",
    "Endpoint API",
  ],
  content: `
# Verificación de Pruebas ZK

Las pruebas ZK en ACTA se verifican on-chain vía contratos inteligentes de Soroban usando soporte de verificación ZK del Protocolo 25.

## Resumen

A diferencia de la generación de pruebas (que es del lado del cliente), la verificación ocurre on-chain:
- **Ubicación**: Contrato verificador ZK de Soroban
- **Método**: Verificación ZK del Protocolo 25
- **Seguridad**: Verificación criptográfica con protección contra reutilización
- **Confianza**: No es necesario confiar en terceros

### ¿Por Qué Verificación On-Chain?

- **Inmutabilidad** - Los resultados de verificación se registran permanentemente
- **Sin Confianza** - No es necesario confiar en servidores de verificación
- **Transparencia** - La lógica de verificación está on-chain
- **Protección contra Reutilización** - Los nullifiers previenen reutilización de pruebas

## Verificación On-Chain

La verificación es realizada por el contrato verificador ZK de Soroban:

1. **El Contrato Recibe**:
   - ID del Circuito (identifica qué circuito usar)
   - Prueba (la prueba criptográfica)
   - Entradas públicas (señales públicas)
   - Nullifier (para protección contra reutilización)

2. **El Contrato Verifica**:
   - Carga clave de verificación (vk) para el circuito
   - Verifica la prueba criptográficamente
   - Verifica que el nullifier no se ha usado antes
   - Registra resultado de verificación on-chain

3. **Resultado**:
   - Hash de transacción
   - Número de ledger
   - Estado de verificación (verificado/no verificado)

## Proceso de Verificación

### Paso 1: Preparar Payload de Verificación

Desde el enlace de credencial compartida, extraer:

\`\`\`typescript
{
  statement: {
    kind: 'isAdult' | 'notExpired' | 'isValid',
    // ... otros metadatos
  },
  proof: string,              // Prueba codificada en base64
  publicSignals: string[],    // Entradas públicas
  commitment: string,          // Compromiso de credencial
  nonce: string,              // Nonce para nullifier
  credentialId: string,       // Identificador de credencial
  verifierContractId?: string // Sobrescritura opcional de contrato
}
\`\`\`

### Paso 2: Generar Nullifier

El nullifier previene ataques de reutilización haciendo cada prueba única:

\`\`\`typescript
// Nullifier = hash(commitment + nonce + proof_hash)
const nullifier = await generateNullifier({
  commitment,
  nonce,
  proof
});
\`\`\`

### Paso 3: Llamar API de Verificación

Enviar solicitud de verificación a la API de ACTA:

\`\`\`bash
POST /contracts/zk-verifier/verify
\`\`\`

**Cuerpo de Solicitud:**

\`\`\`json
{
  "circuitId": "isAdult",
  "proof": "base64_proof",
  "publicInputs": ["..."],
  "nullifier": "hex_nullifier",
  "verifierContractId": "C..."
}
\`\`\`

### Paso 4: Verificación On-Chain

La API:
1. Invoca el contrato verificador ZK de Soroban
2. El contrato verifica la prueba usando la clave de verificación almacenada
3. Verifica que el nullifier no se ha usado
4. Registra verificación on-chain
5. Devuelve hash de transacción y resultado

### Paso 5: Resultado de Verificación

**Respuesta:**

\`\`\`json
{
  "verified": true,
  "txHash": "abc123...",
  "ledger": 12345,
  "network": "testnet"
}
\`\`\`

## Nullifiers y Protección contra Reutilización

Los nullifiers aseguran que cada prueba solo se puede verificar una vez, previniendo ataques de reutilización.

### Cómo Funcionan los Nullifiers

1. **Generar Nullifier**:
   \`\`\`
   nullifier = SHA-256(commitment + nonce + proof_hash)
   \`\`\`

2. **Verificar On-Chain**:
   - El contrato mantiene un conjunto de nullifiers usados
   - Si el nullifier existe → la prueba ya fue usada → rechazar
   - Si el nullifier no existe → agregar al conjunto → verificar prueba

3. **Unicidad**:
   - Cada instancia de prueba tiene commitment + nonce únicos
   - Incluso misma credencial + predicado = nullifier diferente
   - Previene reutilización de pruebas

### Beneficios

- **Protección contra Reutilización** - La misma prueba no se puede verificar dos veces
- **Privacidad** - El nullifier no revela contenido de la credencial
- **Eficiencia** - Verificación simple de hash on-chain

## Resultado de Verificación

### Respuesta de Éxito

\`\`\`json
{
  "verified": true,
  "txHash": "transaction_hash",
  "ledger": 12345,
  "network": "testnet",
  "result": { ... }
}
\`\`\`

### Respuesta de Falla

\`\`\`json
{
  "verified": false,
  "error": "error_message",
  "network": "testnet"
}
\`\`\`

### Errores Comunes

- \`Invalid payload\` - Faltan campos requeridos
- \`No proof to verify\` - El tipo de predicado es 'none'
- \`Missing commitment\` - No se proporcionó commitment
- \`Missing nonce\` - No se proporcionó nonce
- \`Invalid proof format\` - La estructura de la prueba es inválida
- \`Proof verification failed\` - La verificación criptográfica falló
- \`Nullifier already used\` - La prueba ya fue verificada

## Endpoint API

### POST /contracts/zk-verifier/verify

Verifica una prueba ZK on-chain vía contrato de Soroban.

**Headers:**

\`\`\`
X-ACTA-Key: tu_api_key_aqui
\`\`\`

**Cuerpo de Solicitud:**

\`\`\`json
{
  "circuitId": "isAdult",
  "proof": "base64_encoded_proof",
  "publicInputs": ["public_signal_1", "public_signal_2"],
  "nullifier": "hex_nullifier_string",
  "verifierContractId": "C..."
}
\`\`\`

**Respuesta:**

\`\`\`json
{
  "verified": true,
  "txHash": "abc123...",
  "ledger": 12345,
  "result": {},
  "network": "testnet"
}
\`\`\`

**Ejemplo:**

\`\`\`bash
curl -X POST https://acta.build/api/testnet/contracts/zk-verifier/verify \\
  -H "X-ACTA-Key: tu_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "circuitId": "isAdult",
    "proof": "...",
    "publicInputs": [],
    "nullifier": "..."
  }'
\`\`\`

### Parámetros

- **circuitId** (requerido): Identificador del circuito (\`"isAdult"\`, \`"notExpired"\`, \`"isValid"\`)
- **proof** (requerido): Prueba codificada en base64
- **publicInputs** (requerido): Array de cadenas de entrada pública
- **nullifier** (requerido): Nullifier codificado en hex para protección contra reutilización
- **verifierContractId** (opcional): Sobrescribir ID del contrato verificador
    `,
};
