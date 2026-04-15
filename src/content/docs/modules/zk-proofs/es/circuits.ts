import type { DocPage } from "@/@types/docs";

export const circuits: DocPage = {
  slug: "zk-circuits",
  title: "Circuitos",
  section: "Pruebas de Conocimiento Cero",
  tocItems: [
    "Edad ≥ 18 (isAdult)",
    "No Expirado (notExpired)",
    "Estado es Válido (isValid)",
    "Estructura del Circuito",
    "Artefactos ACIR",
  ],
  content: `
# Circuitos ZK

ACTA usa circuitos Noir para definir predicados de pruebas ZK. Cada circuito se compila a ACIR (Abstract Circuit Intermediate Representation) y se usa para generación y verificación de pruebas.

## Edad ≥ 18 (isAdult)

Prueba que una persona tiene al menos 18 años sin revelar su edad exacta.

### Código del Circuito

\`\`\`rust
fn main(age: u8) {
    assert(age > 18);
}
\`\`\`

### Entradas

- **Entrada Privada**: \`age: u8\` - La edad de la persona (no revelada)

### Salida

- **Salida Pública**: \`bool\` → \`true\` si \`age >= 18\`, de lo contrario el circuito falla

### Cómo Funciona

1. Extraer fecha de nacimiento de la credencial
2. Calcular edad desde fecha de nacimiento hasta fecha actual
3. Pasar edad al circuito como entrada privada
4. El circuito asevera \`age > 18\`
5. Generar prueba sin revelar el valor real de la edad

### Casos de Uso

- Verificación de edad para servicios con restricción de edad
- Cumplimiento con requisitos legales de edad
- Verificaciones de edad que preservan la privacidad

### Artefacto ACIR

\`\`\`
noir_workshop.json
\`\`\`

## No Expirado (notExpired)

Prueba que una credencial no ha expirado sin revelar la fecha de expiración.

### Código del Circuito

\`\`\`rust
fn main(expiry_ts: u64, now_ts: u64) {
    assert(expiry_ts > now_ts);
}
\`\`\`

### Entradas

- **Entradas Privadas**: 
  - \`expiry_ts: u64\` - Timestamp de expiración en milisegundos (no revelado)
  - \`now_ts: u64\` - Timestamp actual en milisegundos (calculado off-chain)

### Salida

- **Salida Pública**: \`bool\` → \`true\` si \`expiry_ts > now_ts\`, de lo contrario el circuito falla

### Cómo Funciona

1. Extraer fecha de expiración de la credencial
2. Obtener timestamp actual (calculado off-chain)
3. Pasar ambos timestamps al circuito como entradas privadas
4. El circuito asevera \`expiry_ts > now_ts\`
5. Generar prueba sin revelar la fecha de expiración real

### Casos de Uso

- Verificar que la credencial sigue siendo válida
- Verificar si la credencial no ha expirado
- Control de acceso basado en tiempo

### Artefacto ACIR

\`\`\`
noir_not_expired.json
\`\`\`

## Estado es Válido (isValid)

Prueba que una credencial tiene un estado válido sin revelar otros detalles de estado.

### Código del Circuito

\`\`\`rust
fn main(valid: Field) {
    assert(valid == 1);
}
\`\`\`

### Entradas

- **Entrada Privada**: \`valid: Field\` - Bandera de estado (1 para válido, 0 para inválido)

### Salida

- **Salida Pública**: \`bool\` → \`true\` si \`valid == 1\`, de lo contrario el circuito falla

### Cómo Funciona

1. Extraer estado de la credencial
2. Convertir estado a bandera: \`status === 'valid' ? 1 : 0\`
3. Pasar bandera al circuito como entrada privada
4. El circuito asevera \`valid == 1\`
5. Generar prueba sin revelar otra información de estado

### Casos de Uso

- Verificar que la credencial no está revocada
- Verificar estado de la credencial
- Autorización basada en estado

### Artefacto ACIR

\`\`\`
noir_valid_status.json
\`\`\`

## Estructura del Circuito

Todos los circuitos siguen una estructura similar:

1. **Definición de Entradas** - Entradas privadas que no se revelarán
2. **Lógica de Aseveración** - La condición a probar
3. **Compilación** - Compilado a formato JSON ACIR
4. **Despliegue** - Archivos ACIR servidos desde directorio \`public/zk/\`

### Compilación

Los circuitos se compilan usando \`nargo\`:

\`\`\`bash
nargo compile
\`\`\`

Esto genera el archivo JSON ACIR en el directorio \`target/\`.

## Artefactos ACIR

Los archivos ACIR (Abstract Circuit Intermediate Representation) son los circuitos compilados:

- \`noir_workshop.json\` - Circuito de edad ≥ 18
- \`noir_not_expired.json\` - Circuito de no expirado
- \`noir_valid_status.json\` - Circuito de estado válido

Estos archivos son:
- Cargados por el dApp desde el directorio \`public/zk/\`
- Usados para generación de pruebas en el navegador
- Referenciados por el contrato verificador on-chain

### Publicar Circuitos

Para publicar un circuito para uso en el dApp:

1. Compilar el circuito: \`nargo compile\`
2. Copiar JSON ACIR a \`dApp-ACTA/public/zk/\`
3. El dApp lo cargará automáticamente

Consulta el [repositorio zk-test](https://github.com/ACTA-Team/zk-test) para el código fuente de los circuitos e instrucciones de compilación.
    `,
};
