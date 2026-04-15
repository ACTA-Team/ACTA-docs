import type { DocPage } from "@/@types/docs";

export const generation: DocPage = {
  slug: "zk-generation",
  title: "Generación de Pruebas",
  section: "Pruebas de Conocimiento Cero",
  tocItems: [
    "Resumen",
    "Proceso de Generación",
    "Preparación de Entradas",
    "Ejecución del Circuito",
    "Artefactos de Prueba",
    "Integración en dApp",
  ],
  content: `
# Generación de Pruebas ZK

Las pruebas ZK en ACTA se generan del lado del cliente en el navegador usando circuitos Noir y backend bb.js.

## Resumen

La generación de pruebas ocurre completamente en el navegador del usuario:
- No se envían datos a servidores durante la generación
- Las entradas privadas permanecen privadas
- Las pruebas se generan usando bibliotecas criptográficas

### Tecnologías

- **Noir** - Lenguaje de circuitos y bindings de JavaScript (\`@noir-lang/noir_js\`)
- **bb.js** - Backend de Barretenberg (\`@aztec/bb.js\`) para generación de pruebas
- **ACIR** - Representación de circuito compilado cargada desde archivos JSON

## Proceso de Generación

### Paso 1: Seleccionar Campos y Predicado

Al compartir una credencial en el dApp:

1. **Seleccionar Campos a Revelar**
   - Elige qué campos de la credencial deben ser visibles
   - Otros campos permanecen privados

2. **Elegir Predicado ZK**
   - Selecciona de los predicados disponibles:
     - \`isAdult\` - Edad ≥ 18
     - \`notExpired\` - Credencial no expirada
     - \`isValid\` - Estado es válido

### Paso 2: Preparación de Entradas

El dApp extrae y prepara entradas basándose en el predicado seleccionado:

#### Para \`isAdult\`:

\`\`\`typescript
// Extraer fecha de nacimiento de la credencial
const dob = credential.birthDate;
const ageYears = calculateAge(dob);

// Entrada: { age: ageYears }
\`\`\`

#### Para \`notExpired\`:

\`\`\`typescript
// Extraer timestamp de expiración y actual
const expiry_ts = Date.parse(credential.expirationDate);
const now_ts = Date.now();

// Entrada: { expiry_ts, now_ts }
\`\`\`

#### Para \`isValid\`:

\`\`\`typescript
// Convertir estado a bandera
const valid = credential.status === 'valid' ? '1' : '0';

// Entrada: { valid }
\`\`\`

### Paso 3: Ejecución del Circuito

1. **Cargar ACIR** - Obtener el JSON del circuito desde \`public/zk/\`
2. **Inicializar Noir** - Crear instancia de Noir con ACIR
3. **Inicializar Backend** - Crear backend bb.js
4. **Ejecutar Circuito** - Ejecutar circuito con entradas privadas
5. **Generar Witness** - Crear witness desde resultado de ejecución

\`\`\`typescript
const { Noir } = await import('@noir-lang/noir_js');
const { UltraHonkBackend } = await import('@aztec/bb.js');

// Cargar ACIR
const acir = await fetch('/zk/noir_workshop.json').then(r => r.json());

// Inicializar
const noir = new Noir(acir);
const backend = new UltraHonkBackend(acir.bytecode);

// Ejecutar
const execRes = await noir.execute({ age: ageYears });

// Generar prueba
const proofData = await backend.generateProof(execRes.witness);
\`\`\`

### Paso 4: Artefactos de Prueba

La generación produce:

- **Prueba** - La prueba criptográfica (codificada en base64)
- **Entradas Públicas** - Señales públicas que son parte de la prueba
- **Declaración** - Metadatos sobre el predicado y campos revelados

\`\`\`typescript
{
  proof: string,           // Prueba codificada en base64
  publicInputs: string[],  // Señales públicas
  statement: {
    kind: 'isAdult' | 'notExpired' | 'isValid',
    selectedKeys: string[],
    // ... parámetros específicos del predicado
  }
}
\`\`\`

## Artefactos de Prueba

### Estructura de la Prueba

La prueba es un objeto JSON que contiene:

\`\`\`json
{
  "publicInputs": ["..."],
  "proof": "base64_encoded_proof_bytes"
}
\`\`\`

### Entradas Públicas

Las entradas públicas son valores que son parte de la prueba pero no revelan datos privados:
- Para \`isAdult\`: Vacío (la edad es privada)
- Para \`notExpired\`: Vacío (los timestamps son privados)
- Para \`isValid\`: Vacío (la bandera de estado es privada)

### Metadatos de la Declaración

La declaración contiene:
- \`kind\` - Tipo de predicado
- \`selectedKeys\` - Campos que fueron revelados
- Parámetros específicos del predicado (para referencia, no parte de la prueba)

## Integración en dApp

La generación de pruebas está integrada en el flujo de compartir del dApp:

1. Usuario selecciona credencial a compartir
2. Elige campos a revelar
3. Selecciona predicado ZK
4. Haz clic en **Generate ZK Proof**
5. La prueba se genera del lado del cliente
6. Se crea enlace de compartir con la prueba incluida

### Ubicación del Código

- Lógica de generación: \`dApp-ACTA/src/lib/zk/generate.ts\`
- Integración: \`dApp-ACTA/src/components/modules/credentials/hooks/useShareCredential.ts\`

### Notas de Seguridad

- Toda la generación ocurre del lado del cliente
- Las entradas privadas nunca salen del navegador
- Las pruebas son criptográficamente seguras
- No se requiere procesamiento del lado del servidor
    `,
};
