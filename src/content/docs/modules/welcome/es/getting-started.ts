import type { DocPage } from "@/@types/docs";

export const gettingStarted: DocPage = {
  slug: "getting-started",
  title: "Primeros Pasos",
  section: "Bienvenida",
  tocItems: [
    "Integración API",
    "Integración SDK de credenciales",
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

Para URLs base y el mapa completo de endpoints, abre **[Resumen de API](doc:api-overview)**. Para comprobar que el servicio responde, usa **[Salud y Estado](doc:api-health-status)** (incluye un **GET /health** en vivo desde el navegador).

## Integración SDK de credenciales

Para aplicaciones React / Next.js:

1. **Instalar**:

\`\`\`bash
npm install @acta-team/credentials
\`\`\`

2. **Provider**: Envuelve tu árbol con **\`ActaConfig\`** (\`baseURL\`, \`apiKey\` opcional; ver Resumen del SDK de credenciales).
3. **Hooks**: \`useCredential\`, \`useVault\`, \`useVaultRead\`, y **\`useActaClient\`** si necesitas el cliente HTTP directamente.

Consulta **[Resumen del SDK de credenciales](doc:sdk-overview)** y las páginas de cada hook.

## Integración de wallet

Conecta wallets de Stellar para autenticación de usuarios y firma de transacciones:

1. **UI de wallet**: integra un adaptador Stellar; la documentación oficial cubre **[Wallet Kit](https://developers.stellar.org/docs/tools/developer-tools/wallet-kit)** y herramientas relacionadas.  
2. **Conectar wallet**: el usuario conecta Freighter u otra wallet compatible.  
3. **Firmar transacciones**: usa los endpoints de preparación de ACTA en **[Operaciones de Bóveda (Escritura)](doc:api-vault-write)** y **[Operaciones de Credenciales](doc:api-credentials)**; tu callback \`signTransaction\` firma el XDR sin firmar que devuelve la API.

## Configuración Testnet

Antes de desplegar a mainnet:

1. **Obtener XLM de testnet**: usa **[Friendbot en Stellar Lab](https://lab.stellar.org/friendbot)** o los recursos de **[testnet](https://developers.stellar.org/docs/fundamentals-and-concepts/testnet-and-pubnet)** de Stellar.  
2. **Probar operaciones**: emite, almacena y verifica credenciales de prueba contra testnet (ver **[Resumen de API](doc:api-overview)**).  
3. **Verificar contratos**: los IDs de testnet vienen preconfigurados con la URL base de testnet de la API.

## Siguientes pasos

- **[Resumen de API](doc:api-overview)** - todos los endpoints públicos  
- **[Operaciones de Credenciales](doc:api-credentials)** y **[Operaciones de Bóveda (Lectura)](doc:api-vault-read)** - payloads y ejemplos  
- **[Errores de contrato](doc:contract-errors)** - códigos on-chain  
- **[Preguntas frecuentes](doc:faq)** - dudas habituales  
    `,
};
