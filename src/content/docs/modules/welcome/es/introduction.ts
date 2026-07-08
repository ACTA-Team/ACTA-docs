import type { DocPage } from "@/@types/docs";

export const introduction: DocPage = {
  slug: "introduction",
  title: "Introducción",
  section: "Bienvenida",
  tocItems: [
    "Empieza aquí",
    "Qué puedes construir",
    "Casos de uso comunes",
    "Pruébalo ahora",
  ],
  content: `
# Bienvenida

ACTA es **infraestructura de credenciales verificables** para la **blockchain Stellar**. Construye flujos de credenciales **no custodiados** con **emisión**, verificación y almacenamiento. Los contratos corren en **Stellar (Soroban)** y tu app los controla vía API o SDK.

## Empieza aquí

| Tema | Descripción |
|-------|-------------|
| **Quickstart** | De cero a una credencial verificable, de punta a punta |
| **Arquitectura** | Componentes del sistema, contratos y flujo de datos |
| **Primeros Pasos** | Guía rápida de integración con API y SDK |
| **SDK de credenciales** | \`npm i @acta-team/credentials\` - hooks para credenciales y bóvedas |
| **Referencia API** | Documentación completa de endpoints públicos de la API |
| **did:stellar** | Identidad descentralizada para emisores y titulares |
| **Enlaces** | Enlaces oficiales, recursos y comunidad |

## Qué puedes construir

- Emitir y verificar **[Credenciales Verificables W3C 2.0](https://www.w3.org/TR/vc-data-model-2.0/)** on-chain  
- Almacenar credenciales cifradas en **bóvedas controladas por el usuario**  
- Añadir **lógica de verificación programable** a tu app  
- Soportar **revocación**, chequeo de estado y transferencia de credenciales  
- Configurar **autorización de emisores** por bóveda  
- Lanzar más rápido sin escribir contratos de credenciales desde cero  

## Casos de uso comunes

- **Identidad digital**: Emitir credenciales verificables de identidad  
- **Educación**: Certificados académicos y diplomas  
- **Profesional**: Licencias, certificaciones y membresías  
- **Salud**: Historial médico y certificados de vacunación  
- **Finanzas**: Credenciales para cumplimiento KYC/AML  
- **Control de acceso**: Membresías y tokens de autorización  

## Pruébalo ahora

:::welcome-try-cta:::
    `,
};
