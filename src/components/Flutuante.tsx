"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MessageCircle } from "lucide-react";
import { linkWhatsApp } from "@/lib/contato";
import "./flutuante.css";

gsap.registerPlugin(ScrollTrigger);

const MENSAGEM = "Olá, vim pelo site da Íntegra.";

/**
 * Barra de leitura e atalho de WhatsApp.
 *
 * A barra existe para dar noção de quanto falta numa página de rolagem longa.
 * O atalho só aparece depois da capa: enquanto o botão do hero está à vista,
 * dois convites iguais na tela seria ruído.
 */
export default function Flutuante() {
  const barra = useRef<HTMLDivElement>(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const capa = document.querySelector("#inicio");
      if (capa) {
        ScrollTrigger.create({
          trigger: capa,
          start: "bottom 40%",
          onEnter: () => setVisivel(true),
          onLeaveBack: () => setVisivel(false),
        });
      }

      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // Progresso pelo ScrollTrigger, não por listener de scroll: o cálculo
      // acontece no mesmo laço de quadro do resto da página.
      gsap.fromTo(
        barra.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.3,
          },
        },
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div className="progresso" aria-hidden>
        <div className="progresso__barra" ref={barra} />
      </div>

      <a
        className={`zap ${visivel ? "zap--visivel" : ""}`}
        href={linkWhatsApp(MENSAGEM)}
        target="_blank"
        rel="noreferrer noopener"
        aria-label="Falar com a Íntegra no WhatsApp"
        tabIndex={visivel ? 0 : -1}
      >
        <MessageCircle size={20} />
        <span>WhatsApp</span>
      </a>
    </>
  );
}
