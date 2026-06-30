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

El dApp de ACTA es una aplicación web que proporciona una interfaz para emitir, gestionar y compartir credenciales verificables. Construido con Next.js 16, React 19 y el SDK de ACTA, ofrece una interfaz de gestión de credenciales sin requerir conocimientos de programación.

## Qué es el dApp de ACTA

El dApp de ACTA es una aplicación descentralizada que te permite:

- **Emitir credenciales** a usuarios (emitir requiere un \`did:stellar\` registrado - ver **Mi DID**)
- **Mantener una bóveda mono-inquilino** de credenciales con búsqueda, compartición y revocación
- **Compartir credenciales** con divulgación selectiva de campos
- **Gestionar el acceso de emisores** bloqueando y desbloqueando emisores (la emisión es abierta por defecto)
- **Verificar credenciales** on-chain
- **Gestionar API keys** para acceso programático

Cada propietario tiene su **propia** bóveda, desplegada de forma determinista por el \`vc-vault-factory\`. Las operaciones se realizan a través de infraestructura Stellar/Soroban usando contratos y APIs de ACTA.

## Características principales

### Gestión de Credenciales

- Crear y emitir credenciales verificables
- Almacenar credenciales en tu bóveda personal mono-inquilino
- Buscar y filtrar credenciales
- Compartir credenciales con divulgación selectiva de campos
- Revocar credenciales cuando sea necesario

### Acceso de Emisores (lista de bloqueo)

- **La emisión es abierta por defecto** - cualquiera con un \`did:stellar\` registrado puede emitir a una bóveda salvo que esté bloqueado
- **Bloquea** un emisor para impedir que escriba en tu bóveda
- **Desbloquea** un emisor previamente bloqueado para restaurar el acceso
- Revisa tu lista de emisores bloqueados

### Mi DID

- Emitir credenciales requiere un \`did:stellar\` registrado y resoluble
- El dApp te ayuda a crear y gestionar tu DID de emisor

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
3. **Crea tu bóveda** - Inicializa tu bóveda personal mono-inquilino de credenciales
4. **Registra tu DID** - Configura tu \`did:stellar\` para emitir credenciales
5. **Comienza a emitir** - Crea y gestiona tus credenciales (bloquea emisores solo si es necesario)

Consulta la [Guía de Primeros Pasos](#dapp-getting-started) para instrucciones detalladas.

## Acceder al dApp

El dApp de ACTA está disponible en el enlace de abajo. **No se requiere instalación** - ábrelo en tu navegador web y conecta tu wallet Stellar para comenzar.

:::dapp-open-cta:::
    `,
};
