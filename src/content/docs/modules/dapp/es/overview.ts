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

El dApp de ACTA es una aplicación web que proporciona una interfaz para emitir, gestionar, compartir y controlar el acceso a credenciales verificables. Construido con Next.js 16 y React 19 sobre la API REST de ACTA, ofrece una interfaz de gestión de credenciales sin requerir conocimientos de programación.

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

- Crear y emitir credenciales verificables desde **plantillas** (plantillas integradas como certificados de curso, membresías o recibos de pago, más un constructor de plantillas personalizadas)
- Almacenar credenciales en tu bóveda personal
- Buscar y filtrar credenciales
- Compartir credenciales con divulgación selectiva de campos, un código QR y una página pública de verificación
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

- Tour guiado interactivo en la primera visita
- Guía de inicio rápido con instrucciones paso a paso
- Ayuda contextual en toda la aplicación

### Más

- **Notificaciones**: notificaciones dentro de la aplicación (por ejemplo, cuando tu bóveda recibe una credencial)
- **Idiomas**: inglés, español y francés
- **Cambio de red**: cambia entre testnet y mainnet en cualquier momento desde Configuración

## Primeros pasos

Para comenzar a usar el dApp de ACTA:

1. **Conecta tu wallet y elige la red** - Freighter, Albedo o WalletConnect; testnet o mainnet
2. **Crea tu API key** - requerida para operaciones de bóveda y credenciales
3. **Registra tu DID de emisor** - una identidad did:stellar (necesaria para emitir credenciales)
4. **Crea tu bóveda** - Inicializa tu bóveda de credenciales dedicada de un solo inquilino
5. **Comienza a emitir** - Crea y gestiona credenciales (el emisor paga una tarifa on-chain por credencial)

Consulta la [Guía de Primeros Pasos](#dapp-getting-started) para instrucciones detalladas.

## Acceder al dApp

El dApp de ACTA está disponible en el enlace de abajo. **No se requiere instalación** - ábrelo en tu navegador web y conecta tu wallet Stellar para comenzar.

:::dapp-open-cta:::
    `,
};
