"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown } from "lucide-react";
import "./hero.css";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  aoIr: (alvo: string) => void;
  aoAbrirContato: () => void;
};

/**
 * Capa: título à esquerda, uma foto só à direita.
 *
 * Sem pilha de camadas. O movimento é o mínimo que serve para alguma coisa:
 * o título entra linha por linha (hierarquia) e a foto anda mais devagar que a
 * página enquanto se rola (profundidade). Nada além disso.
 */
export default function Hero({ aoIr, aoAbrirContato }: Props) {
  const raiz = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap
        .timeline({ defaults: { ease: "power4.out" } })
        .from(".hero__rotulo", { y: 16, opacity: 0, duration: 0.6 })
        .from(
          ".hero__linha > span",
          { yPercent: 116, duration: 0.9, stagger: 0.08 },
          "-=0.3",
        )
        .from(
          ".hero__apoio > *",
          { y: 18, opacity: 0, duration: 0.6, stagger: 0.08 },
          "-=0.5",
        )
        .from(".hero__foto", { opacity: 0, scale: 1.04, duration: 1.2 }, "-=1");

      // `ease:'none'` com scrub: qualquer curva por cima descola a imagem do
      // dedo de quem rola.
      gsap.fromTo(
        ".hero__foto img",
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: "none",
          scrollTrigger: {
            trigger: raiz.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    }, raiz);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" id="inicio" ref={raiz}>
      <div className="hero__texto">
        <p className="hero__rotulo">
          <i />
          Consultoria de marketing
        </p>

        <h1>
          <span className="hero__linha">
            <span>Sua marca não pode</span>
          </span>
          <span className="hero__linha">
            <span>
              parecer <em>amadora.</em>
            </span>
          </span>
        </h1>

        <div className="hero__apoio">
          <p>
            Identidade visual, conteúdo e tráfego pago tocados por quem responde
            pelo resultado.
          </p>
          <div className="hero__acoes">
            <button type="button" className="botao" onClick={aoAbrirContato}>
              Falar com a Íntegra
            </button>
            <button
              type="button"
              className="botao-fantasma"
              onClick={() => aoIr("#portfolio")}
            >
              Ver o repertório
              <ArrowDown size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="hero__foto">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/estudio.png"
          alt="Sala escura cortada por uma faixa de luz amarela"
        />
      </div>
    </section>
  );
}
