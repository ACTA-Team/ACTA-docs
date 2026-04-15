import type { DocPage } from "@/@types/docs";

export const overview: DocPage = {
  slug: "dapp-overview",
  title: "Resumen",
  section: "dApp",
  tocItems: [
    "¿Qué es el dApp de ACTA?",
    "Características principales",
    "Primeros pasos",
    "Acceder al dApp",
  ],
  content: `
# Resumen del dApp de ACTA

El dApp de ACTA es una aplicación web moderna que proporciona una interfaz amigable para emitir, gestionar, compartir y autorizar credenciales verificables. Construido con Next.js 16, React 19 y el SDK de ACTA, ofrece una solución completa de gestión de credenciales sin requerir conocimientos de programación.

## ¿Qué es el dApp de ACTA?

El dApp de ACTA es una aplicación descentralizada que te permite:

- **Emitir credenciales** a usuarios y gestionar la autorización de emisores
- **Mantener una bóveda** de credenciales con búsqueda, compartición y revocación
- **Compartir credenciales** con pruebas de conocimiento cero para privacidad
- **Autorizar emisores** para controlar quién puede emitir credenciales a tu bóveda
- **Verificar credenciales** on-chain y verificar pruebas ZK
- **Gestionar API keys** para acceso programático

Todas las operaciones se realizan directamente en la blockchain Stellar a través de contratos inteligentes Soroban, garantizando una gestión de credenciales no custodiada.

## Características principales

### Gestión de Credenciales

- Crear y emitir credenciales verificables
- Almacenar credenciales en tu bóveda personal
- Buscar y filtrar credenciales
- Compartir credenciales con divulgación selectiva de campos
- Revocar credenciales cuando sea necesario

### Autorización de Emisores

- Autorizar wallets específicas para emitir credenciales a tu bóveda
- Gestionar la lista de emisores autorizados
- Controlar quién puede crear credenciales para ti

### Pruebas de Conocimiento Cero

- Generar pruebas ZK para predicados de credenciales
- Compartir credenciales con pruebas que preservan la privacidad
- Verificar pruebas sin revelar datos privados
- Soporte para múltiples tipos de predicados (verificación de edad, expiración, estado)

### Gestión de API Keys

- Crear y gestionar API keys para testnet y mainnet
- Keys con rol estándar con expiración de 6 meses
- Integración fácil con la API de ACTA

### Onboarding Guiado

- Tutoriales interactivos para usuarios primerizos
- Guía de inicio rápido con instrucciones paso a paso
- Ayuda contextual en toda la aplicación

## Primeros pasos

Para comenzar a usar el dApp de ACTA:

1. **Conecta tu wallet** - Vincula tu wallet Stellar (Freighter, etc.)
2. **Elige la red** - Selecciona testnet (para pruebas) o mainnet
3. **Crea tu bóveda** - Inicializa tu bóveda personal de credenciales
4. **Autoriza emisores** - Otorga permisos a wallets confiables
5. **Comienza a emitir** - Crea y gestiona tus credenciales

Consulta la [Guía de Primeros Pasos](#dapp-getting-started) para instrucciones detalladas.

## Acceder al dApp

El dApp de ACTA está disponible en:

\`\`\`
https://dapp.acta.build
\`\`\`

No se requiere instalación - simplemente visita la URL en tu navegador web y conecta tu wallet Stellar para comenzar.
    `,
};
