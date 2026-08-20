"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./sections.css";

gsap.registerPlugin(ScrollTrigger);

/**
 * O método é uma sequência real: cada etapa só existe depois da anterior. Por
 * isso as etapas empilham de verdade (pin + escala) em vez de aparecerem uma
 * embaixo da outra: a ordem é a informação.
 */
const ETAPAS = [
  {
    nome: "Diagnóstico",
    texto:
      "Uma conversa e um pente-fino no que já existe: marca, redes, anúncios e o que o concorrente anda fazendo.",
    prazo: "Semana 1",
  },
  {
    nome: "Identidade",
    texto:
      "Definimos como a marca fala e aparece. Sai um manual de uso, não um arquivo solto no WhatsApp.",
    prazo: "Semanas 2 e 3",
  },
  {
    nome: "Conteúdo",
    texto:
      "Calendário, produção e publicação. Você aprova por aqui e a gente executa sem ficar cobrando material.",
    prazo: "Mês 1 em diante",
  },
  {
    nome: "Tráfego",
    texto:
      "Campanha no ar com verba acompanhada de perto e um relatório mensal que dá para ler sem tradutor.",
    prazo: "Contínuo",
  },
];

export default function Metodo() {
  const raiz = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      // Empilhar cartão em tela pequena vira rolagem travada sem ganho nenhum.
      if (!matchMedia("(min-width: 900px)").matches) return;

      const cartoes = gsap.utils.toArray<HTMLElement>(".etapa");
      cartoes.forEach((cartao, i) => {
        if (i === cartoes.length - 1) return;
        ScrollTrigger.create({
          trigger: cartao,
          start: "top top",
          endTrigger: cartoes[cartoes.length - 1],
          end: "top top",
          pin: true,
          pinSpacing: false,
        });
        // O encolhimento é dirigido pelo cartão SEGUINTE: é a chegada dele que
        // empurra o anterior para o fundo da pilha.
        //
        // Sem mexer na opacidade: cartão translúcido deixa o de baixo aparecer
        // através do de cima e os dois textos se misturam. Quem manda no
        // "está atrás" é a escala e o recuo, não a transparência.
        gsap.to(cartao, {
          scale: 0.93,
          y: -26,
          ease: "none",
          scrollTrigger: {
            trigger: cartoes[i + 1],
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        });
      });
    }, raiz);

    return () => ctx.revert();
  }, []);

  return (
    <section className="metodo" id="metodo" ref={raiz}>
      <div className="metodo__cabeca secao">
        <h2 className="titulo-secao entra">
          Como a gente
          <br />
          <em>entra na sua operação.</em>
        </h2>
      </div>

      <div className="metodo__pilha">
        {ETAPAS.map((e) => (
          <div className="etapa" key={e.nome}>
            <div className="etapa__cartao">
              <span className="etapa__prazo">{e.prazo}</span>
              <h3>{e.nome}</h3>
              <p>{e.texto}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
