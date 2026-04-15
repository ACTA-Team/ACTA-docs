import type { DocPage } from "@/@types/docs";

export const overview: DocPage = {
  slug: "zk-overview",
  title: "Resumen",
  section: "Pruebas de Conocimiento Cero",
  tocItems: [
    "¿Qué son las Pruebas de Conocimiento Cero?",
    "Cómo Funcionan las Pruebas ZK en ACTA",
    "Beneficios Clave",
    "Arquitectura",
  ],
  content: `
# Resumen de Pruebas de Conocimiento Cero

ACTA soporta pruebas de conocimiento cero (ZK) que te permiten probar predicados de credenciales sin revelar datos privados. Esto permite compartir y verificar credenciales preservando la privacidad.

## ¿Qué son las Pruebas de Conocimiento Cero?

Las pruebas de conocimiento cero son protocolos criptográficos que permiten que una parte (el probador) pruebe a otra parte (el verificador) que una declaración es verdadera sin revelar ninguna información más allá de la validez de la declaración misma.

En el contexto de ACTA:
- **Probador**: El titular de la credencial que quiere probar algo sobre su credencial
- **Verificador**: La parte que necesita verificar la prueba (ej: un servicio que requiere verificación de edad)
- **Declaración**: Un predicado sobre la credencial (ej: "edad ≥ 18", "no expirado", "estado es válido")

## Cómo Funcionan las Pruebas ZK en ACTA

1. **Titular de la Credencial** selecciona qué campos revelar y elige un predicado a probar
2. **Generación de Prueba** ocurre del lado del cliente usando circuitos Noir y bb.js
3. **Enlace de Compartir** se crea conteniendo los campos revelados y la prueba ZK
4. **Verificación** ocurre on-chain vía contratos inteligentes de Soroban (Protocolo 25)

### Generación vs Verificación

- **Generación**: Del lado del cliente en el navegador usando Noir y bb.js
- **Verificación**: On-chain vía contrato verificador ZK de Soroban
- **Protección contra Reutilización**: Usa nullifiers para prevenir reutilización de pruebas

## Beneficios Clave

### Privacidad

- Solo los campos seleccionados se revelan a los verificadores
- Los datos privados (como edad exacta o fecha de expiración) permanecen ocultos
- La divulgación selectiva te da control sobre qué información compartir

### Seguridad

- Las pruebas criptográficas son matemáticamente verificables
- No es necesario confiar en un tercero
- La verificación on-chain asegura la integridad de la prueba
- Los nullifiers previenen ataques de reutilización

### Flexibilidad

- Múltiples tipos de predicados disponibles
- Se puede combinar con divulgación selectiva de campos
- Funciona con cualquier estructura de credencial

## Arquitectura

### Componentes

1. **Circuitos Noir** - Definen la lógica para cada predicado
   - Escritos en lenguaje Noir
   - Compilados a ACIR (Abstract Circuit Intermediate Representation)
   - Servidos como archivos JSON desde el dApp

2. **Generación de Prueba** - Del lado del cliente usando:
   - \`@noir-lang/noir_js\` - Bindings de JavaScript para Noir
   - \`@aztec/bb.js\` - Backend de Barretenberg para generación de pruebas

3. **Verificación de Prueba** - On-chain vía:
   - Contrato verificador ZK de Soroban
   - Soporte del Protocolo 25 para verificación ZK
   - Claves de verificación (vk) almacenadas en el contrato

### Flujo

\`\`\`
Titular de Credencial → Seleccionar Campos → Elegir Predicado → Generar Prueba (Cliente) → Enlace de Compartir
                                                                                                      ↓
Verificador ← Verificar Prueba (On-chain) ← Recibir Enlace de Compartir ← Titular de Credencial
\`\`\`

Consulta la sección [Circuitos](#zk-circuits) para información detallada sobre los predicados disponibles y su implementación.
    `,
};
