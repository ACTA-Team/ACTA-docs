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

El dApp de ACTA es una aplicación web que proporciona una interfaz para emitir, gestionar, compartir y controlar el acceso a credenciales verificables. Construido con Next.js 16, React 19 y el SDK de ACTA, ofrece una interfaz de gestión de credenciales sin requerir conocimientos de programación.

## Qué es el dApp de ACTA

El dApp de ACTA es una aplicación descentralizada que te permite:

- **Emitir credenciales** a usuarios (emitir requiere una identidad did:stellar registrada y cobra una tarifa on-chain pagada por el emisor)
- **Mantener una bóveda** de credenciales con búsqueda, compartición y revocación
- **Compartir credenciales** con divulgación selectiva de campos
- **Gestionar el acceso de emisores** - la emisión está abierta por defecto, así que solo bloqueas o desbloqueas emisores específicos
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

### Acceso de Emisores

- La emisión está abierta por defecto - cualquier emisor puede emitir a tu bóveda a menos que lo bloquees
- Bloquear emisores específicos para impedir que emitan hacia ti
- Desbloquear emisores para restaurar su acceso

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
3. **Crea tu bóveda** - Inicializa tu bóveda de credenciales dedicada de un solo inquilino
4. **Gestiona el acceso de emisores** - La emisión está abierta por defecto; bloquea a un emisor solo si quieres detenerlo
5. **Comienza a emitir** - Crea y gestiona credenciales (requiere un did:stellar registrado; el emisor paga una tarifa on-chain por credencial)

Consulta la [Guía de Primeros Pasos](#dapp-getting-started) para instrucciones detalladas.

## Acceder al dApp

El dApp de ACTA está disponible en el enlace de abajo. **No se requiere instalación** - ábrelo en tu navegador web y conecta tu wallet Stellar para comenzar.

:::dapp-open-cta:::
    `,
};
