import type { DocPage } from "@/@types/docs";

export const overview: DocPage = {
  slug: "dapp-overview",
  title: "Resumen",
  section: "dApp",
  tocItems: [
    "Qué es el dApp de ACTA",
    "Características principales",
    "Primeros pasos",
    "Acceder al dApp",
  ],
  content: `
# Resumen del dApp de ACTA

El dApp de ACTA es una aplicación web que proporciona una interfaz para emitir, gestionar, compartir y autorizar credenciales verificables. Construido con Next.js 16, React 19 y el SDK de ACTA, ofrece una interfaz de gestión de credenciales sin requerir conocimientos de programación.

## Qué es el dApp de ACTA

El dApp de ACTA es una aplicación descentralizada que te permite:

- **Emitir credenciales** a usuarios y gestionar la autorización de emisores
- **Mantener una bóveda** de credenciales con búsqueda, compartición y revocación
- **Compartir credenciales** con divulgación selectiva de campos
- **Autorizar emisores** para controlar quién puede emitir credenciales a tu bóveda
- **Verificar credenciales** on-chain
- **Gestionar API keys** para acceso programático

Las operaciones se realizan a través de infraestructura Stellar/Soroban usando contratos y APIs de ACTA.

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

### Gestión de API Keys

- Crear y gestionar API keys para testnet y mainnet
- Keys con rol estándar con expiración de 6 meses
- Integración con la API de ACTA

### Onboarding Guiado

- Tutoriales interactivos para usuarios primerizos
- Guía de inicio rápido con instrucciones paso a paso
- Ayuda contextual en toda la aplicación

## Primeros pasos

Para comenzar a usar el dApp de ACTA:

1. **Conecta tu wallet** - Vincula tu wallet Stellar
2. **Elige la red** - Selecciona testnet o mainnet
3. **Crea tu bóveda** - Inicializa tu bóveda personal de credenciales
4. **Autoriza emisores** - Otorga permisos a wallets confiables
5. **Comienza a emitir** - Crea y gestiona tus credenciales

Consulta la [Guía de Primeros Pasos](#dapp-getting-started) para instrucciones detalladas.

## Acceder al dApp

El dApp de ACTA está disponible en el enlace de abajo. **No se requiere instalación** — ábrelo en tu navegador web y conecta tu wallet Stellar para comenzar.

:::dapp-open-cta:::
    `,
};
