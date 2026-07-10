"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useI18n } from "@/lib/i18n";

export function FaqsSection() {
  const { t, locale } = useI18n();
  const questions =
    locale === "es" ? questionsEs : locale === "fr" ? questionsFr : questionsEn;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-10 px-4 py-8 md:px-10 md:py-10 xl:max-w-5xl">
      <div className="max-w-xl space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          {t.faq}
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {t.faqDescription}
        </p>
      </div>
      <Accordion
        className="rounded-xl border border-border/60 bg-card/80 px-0 shadow-none backdrop-blur-sm"
        collapsible
        type="single"
      >
        {questions.map(item => (
          <AccordionItem
            key={item.id}
            value={item.id}
            className="border-border/50 px-4"
          >
            <AccordionTrigger className="py-4 text-sm font-medium hover:no-underline focus-visible:ring-0">
              {item.title}
            </AccordionTrigger>
            <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

const questionsEn = [
  {
    id: "item-1",
    title: "What is ACTA and what problem does it solve?",
    content:
      "ACTA is a verifiable credentials infrastructure built on Stellar. It solves digital trust and identity challenges by allowing issuers to publish verifiable credentials and verifiers to validate them cryptographically.",
  },
  {
    id: "item-2",
    title: "How do I integrate ACTA with my application?",
    content:
      "You can integrate ACTA via `npm install @acta-team/credentials` hooks on the frontend or REST API endpoints on the backend for issuance, verification, and vault flows.",
  },
  {
    id: "item-3",
    title: "What are verifiable credentials and how do they work?",
    content:
      "Credentials are issued and signed by trusted issuers, anchored on-chain, encrypted in user vaults, and then verified by checking signatures and contract state.",
  },
  {
    id: "item-4",
    title: "How does the vault system work?",
    content:
      "Each user has a secure vault with owner-controlled access. Vaults store encrypted credential payloads and support read/write flows depending on permissions.",
  },
  {
    id: "item-5",
    title: "What blockchain does ACTA use?",
    content:
      "ACTA is built on Stellar and Soroban smart contracts, offering low fees, fast finality, and scalable credential operations.",
  },
  {
    id: "item-6",
    title: "How do I get started with @acta-team/credentials?",
    content:
      "Run `npm install @acta-team/credentials`, wrap your app with `ActaConfig` (pick `mainNet` or `testNet`), then use hooks like `useCredential` / `useVault`. Follow Getting Started and the Credentials SDK overview for wiring details.",
  },
];

const questionsEs = [
  {
    id: "item-1",
    title: "Que es ACTA y que problema resuelve?",
    content:
      "ACTA es una infraestructura de credenciales verificables sobre Stellar. Resuelve problemas de confianza e identidad digital permitiendo emitir y validar credenciales con pruebas criptograficas.",
  },
  {
    id: "item-2",
    title: "Como integro ACTA con mi aplicacion?",
    content:
      "Puedes usar `npm install @acta-team/credentials` y los hooks React en frontend, o los endpoints REST en backend para emitir, verificar y gestionar vaults.",
  },
  {
    id: "item-3",
    title: "Que son las credenciales verificables y como funcionan?",
    content:
      "Las credenciales se emiten y firman por emisores confiables, se anclan on-chain, se cifran en vaults y luego se verifican validando firmas y estado del contrato.",
  },
  {
    id: "item-4",
    title: "Como funciona el sistema de vault?",
    content:
      "Cada usuario tiene un vault seguro con control de acceso del propietario. El vault guarda payloads cifrados y permite flujos de lectura/escritura segun permisos.",
  },
  {
    id: "item-5",
    title: "Que blockchain usa ACTA?",
    content:
      "ACTA usa Stellar con contratos Soroban, ofreciendo comisiones bajas, finalizacion rapida y operaciones de credenciales escalables.",
  },
  {
    id: "item-6",
    title: "¿Cómo empiezo con @acta-team/credentials?",
    content:
      "Ejecuta `npm install @acta-team/credentials`, envuelve tu app con `ActaConfig` (`mainNet`/`testNet`) y usa hooks como useCredential/useVault. Revisa Primeros pasos y el resumen del SDK de credenciales.",
  },
];

const questionsFr = [
  {
    id: "item-1",
    title: "Qu'est-ce qu'ACTA et quel problème résout-il ?",
    content:
      "ACTA est une infrastructure de credentials vérifiables construite sur Stellar. Elle résout les défis de confiance et d'identité numérique en permettant aux émetteurs de publier des credentials vérifiables et aux vérificateurs de les valider cryptographiquement.",
  },
  {
    id: "item-2",
    title: "Comment intégrer ACTA à mon application ?",
    content:
      "Vous pouvez intégrer ACTA via `npm install @acta-team/credentials` et les hooks React côté frontend, ou via les endpoints REST côté backend pour l'émission, la vérification et les flux de coffre.",
  },
  {
    id: "item-3",
    title: "Que sont les credentials vérifiables et comment fonctionnent-ils ?",
    content:
      "Les credentials sont émis et signés par des émetteurs de confiance, ancrés on-chain, chiffrés dans les coffres des utilisateurs, puis vérifiés en validant les signatures et l'état du contrat.",
  },
  {
    id: "item-4",
    title: "Comment fonctionne le système de coffre ?",
    content:
      "Chaque utilisateur dispose d'un coffre sécurisé contrôlé par son propriétaire. Les coffres stockent des payloads chiffrés et prennent en charge les flux de lecture/écriture selon les permissions.",
  },
  {
    id: "item-5",
    title: "Quelle blockchain ACTA utilise-t-il ?",
    content:
      "ACTA est construit sur Stellar et les contrats intelligents Soroban : frais réduits, finalité rapide et opérations de credentials évolutives.",
  },
  {
    id: "item-6",
    title: "Comment démarrer avec @acta-team/credentials ?",
    content:
      "Exécutez `npm install @acta-team/credentials`, enveloppez votre app avec `ActaConfig` (`mainNet` ou `testNet`), puis utilisez les hooks comme `useCredential` / `useVault`. Consultez Premiers Pas et l'aperçu du Credentials SDK.",
  },
];
