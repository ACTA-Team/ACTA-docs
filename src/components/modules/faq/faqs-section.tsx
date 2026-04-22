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
  const questions = locale === "es" ? questionsEs : questionsEn;

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
        {questions.map((item) => (
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
      "You can integrate ACTA through React SDK hooks on the frontend or by using REST API endpoints on the backend for credential issuance, verification, and vault operations.",
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
    title: "How do I get started with the React SDK?",
    content:
      "Install the SDK package, initialize the provider, and use hooks like useCredential/useVault. Follow Getting Started and SDK Overview docs for full flow implementation.",
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
      "Puedes integrar ACTA con hooks del React SDK en frontend o con endpoints REST en backend para emision, verificacion y operaciones de vault.",
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
    title: "Como empiezo con el React SDK?",
    content:
      "Instala el paquete SDK, inicializa el provider y usa hooks como useCredential/useVault. Sigue las guias de Getting Started y SDK Overview para el flujo completo.",
  },
];
