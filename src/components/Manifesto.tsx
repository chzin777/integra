"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./manifesto.css";

gsap.registerPlugin(ScrollTrigger);

/**
 * Imagem que abre de um retângulo pequeno até a tela inteira conforme se rola.
 *
 * O pino é do ScrollTrigger, não `position: sticky`: um `overflow:hidden` em
 * qualquer ancestral transforma o ancestral em contêiner de rolagem e o sticky
 * gruda num contêiner que nunca rola. Bug silencioso e difícil de achar.
 *
 * O movimento é um `clip-path: inset()` que fecha enquanto a foto desamplia.
 * As duas coisas juntas dão a sensação de recuar a câmera.
 */
const LARGURA_INICIAL = 38;
const ALTURA_INICIAL = 54;
const ZOOM_INICIAL = 1.3;

export default function Manifesto() {
  const raiz = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const quadro = raiz.current!.querySelector(".mf__quadro");
      const media = raiz.current!.querySelector(".mf__media");
      const veu = raiz.current!.querySelector(".mf__veu");
      const titulo = raiz.current!.querySelector(".mf__titulo");
      const texto = raiz.current!.querySelector(".mf__texto");

      const recorte = (p: number) => {
        const l = LARGURA_INICIAL + (100 - LARGURA_INICIAL) * p;
        const a = ALTURA_INICIAL + (100 - ALTURA_INICIAL) * p;
        const r = 24 - 24 * p;
        return `inset(${(100 - a) / 2}% ${(100 - l) / 2}% ${(100 - a) / 2}% ${
          (100 - l) / 2
        }% round ${r}px)`;
      };

      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.set(quadro, { clipPath: recorte(0) });
      gsap.set(media, { scale: ZOOM_INICIAL });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: raiz.current,
          start: "top top",
          end: () => `+=${innerHeight * 1.15}`,
          scrub: 0.6,
          pin: ".mf__palco",
          pinSpacing: true,
          anticipatePin: 1,
          // Sem isto, os valores em px calculados na criação ficam presos e o
          // efeito sai do lugar quando a janela muda de tamanho.
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(
        quadro,
        { clipPath: recorte(0) },
        { clipPath: recorte(1), ease: "none", duration: 1 },
        0,
      )
        .to(media, { scale: 1, ease: "none", duration: 1 }, 0)
        .to(veu, { opacity: 0.62, ease: "none", duration: 1 }, 0)
        .to(
          titulo,
          { opacity: 0, y: -30, scale: 1.05, ease: "none", duration: 0.46 },
          0.4,
        )
        .fromTo(
          texto,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, ease: "none", duration: 0.32 },
          0.68,
        );
    }, raiz);

    return () => ctx.revert();
  }, []);

  return (
    <section className="mf" ref={raiz}>
      <div className="mf__palco">
        <div className="mf__quadro">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="mf__media"
            src="/images/parede.png"
            alt="Parede amarela iluminada por uma faixa de luz"
          />
          <div className="mf__veu" />
          <div className="mf__texto">
            <h2>
              Marketing barato
              <br />
              <em>sai caro duas vezes.</em>
            </h2>
            <p>
              Uma na hora de fazer. Outra na hora de refazer. A Íntegra existe
              para a sua empresa passar por isso uma vez só.
            </p>
          </div>
        </div>
        <div className="mf__titulo">Íntegra</div>
      </div>
    </section>
  );
}
