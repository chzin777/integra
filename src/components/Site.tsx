"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Nav from "./Nav";
import Hero from "./Hero";
import Servicos from "./Servicos";
import Manifesto from "./Manifesto";
import Metodo from "./Metodo";
import Portfolio from "./Portfolio";
import Planos from "./Planos";
import Depoimentos from "./Depoimentos";
import CtaFinal from "./CtaFinal";
import ModalContato from "./ModalContato";
import "./sections.css";

gsap.registerPlugin(ScrollTrigger);

export default function Site() {
  const raiz = useRef<HTMLDivElement>(null);
  const [contato, setContato] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // Entrada dos blocos: hierarquia. O olho chega no título antes do texto.
      gsap.utils.toArray<HTMLElement>(".entra").forEach((el) =>
        gsap.from(el, {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 84%", once: true },
        }),
      );

      gsap.utils.toArray<HTMLElement>(".servico").forEach((el, i) =>
        gsap.from(el, {
          x: i % 2 ? 50 : -50,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        }),
      );

      // A faixa anda com a rolagem: o movimento marca a passagem de um bloco
      // para o outro, não decora.
      gsap.to(".faixa-texto__trilho", {
        xPercent: -46,
        ease: "none",
        scrollTrigger: {
          trigger: ".faixa-texto",
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      /**
       * Rede de segurança contra a armadilha número um do ScrollTrigger: ele
       * pré-calcula start e end uma vez. Fonte que carrega depois ou imagem que
       * chega e muda a altura não o avisam, e o sintoma clássico é funcionar no
       * primeiro load e errar depois.
       */
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
      const atualizar = () => ScrollTrigger.refresh();
      addEventListener("load", atualizar);
      return () => removeEventListener("load", atualizar);
    }, raiz);

    return () => ctx.revert();
  }, []);

  const ir = (alvo: string) =>
    document.querySelector(alvo)?.scrollIntoView({ behavior: "smooth" });

  const abrir = () => setContato(true);

  return (
    <div className="casca" ref={raiz}>
      <div className="grao" aria-hidden />

      <Nav aoIr={ir} aoAbrirContato={abrir} />

      <main>
        <Hero aoIr={ir} aoAbrirContato={abrir} />
        <Servicos aoAbrirContato={abrir} />

        <section className="faixa-texto" aria-hidden>
          <div className="faixa-texto__trilho">
            IDENTIDADE / CONTEÚDO / TRÁFEGO / IDENTIDADE / CONTEÚDO / TRÁFEGO /
          </div>
        </section>

        <Manifesto />
        <Metodo />
        <Portfolio />
        <Planos aoAbrirContato={abrir} />
        <Depoimentos />
        <CtaFinal aoAbrirContato={abrir} />
      </main>

      <ModalContato aberto={contato} aoFechar={() => setContato(false)} />
    </div>
  );
}
