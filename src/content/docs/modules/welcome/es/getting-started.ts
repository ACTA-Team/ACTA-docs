import type { DocPage } from "@/@types/docs";

export const gettingStarted: DocPage = {
  slug: "getting-started",
  title: "Primeros Pasos",
  section: "Bienvenida",
  tocItems: [
    "Integración API",
    "Integración React SDK",
    "Integración de wallet",
    "Configuración Testnet",
    "Siguientes pasos",
  ],
  content: `
# Primeros Pasos

Guías rápidas para distintos escenarios de integración.

## Integración API

Comienza a usar la API de ACTA para emitir y verificar credenciales:

1. **Elegir red**: Testnet (recomendada para desarrollo) o Mainnet  
2. **Obtener acceso API**: URL base y configuración de red  
3. **Emitir credenciales**: Usa el endpoint \`POST /credentials\`  
4. **Verificar credenciales**: Usa \`GET /verify/:vc_id\` o \`POST /verify\`  

Consulta el Developer Quickstart de API para pasos detallados.

## Integración React SDK

Para aplicaciones React/Next.js:

1. **Instalar SDK**:

\`\`\`bash
npm install @acta-team/credentials
\`\`\`

2. **Configurar provider**: Envuelve tu app con \`ActaConfig\`  
3. **Usar hooks**: \`useCredential\`, \`useVault\`, \`useVaultRead\`, etc.  

Revisa la documentación del React SDK para hooks y ejemplos.

## Integración de wallet

Conecta wallets de Stellar para autenticación de usuarios y firma de transacciones:

1. **Instalar Wallet Kit**: integrar el adaptador de wallet  
2. **Conectar wallet**: el usuario conecta Freighter u otra wallet Stellar  
3. **Firmar transacciones**: usa los endpoints de preparación de transacción  

Consulta la guía de integración de Wallet Kit para más detalles.

## Configuración Testnet

Antes de desplegar a mainnet:

1. **Obtener tokens de testnet**: pide XLM en el faucet de Stellar testnet  
2. **Probar operaciones**: emitir, almacenar y verificar credenciales de prueba  
3. **Verificar contratos**: los IDs de contratos de testnet ya vienen preconfigurados  

Revisa la sección de Testnet Tokens para enlaces a faucets.

## Siguientes pasos

- Revisa la referencia de API para todos los endpoints disponibles  
- Consulta la documentación de esquemas para estructuras de datos  
- Explora los hooks del React SDK para integración con React  
- Lee la guía de troubleshooting para problemas comunes  
    `,
};
