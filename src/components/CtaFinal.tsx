"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { EMAIL, INSTAGRAM } from "@/lib/contato";
import "./cta.css";

gsap.registerPlugin(ScrollTrigger);

/**
 * Fechamento da página. Faz o papel do rodapé, mas subordinado à chamada:
 * a última coisa que a pessoa vê é o convite, não um bloco cinza de links.
 */
export default function CtaFinal({
  aoAbrirContato,
}: {
  aoAbrirContato: () => void;
}) {
  const raiz = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.fromTo(
        ".cta__foto",
        { scale: 1.14, yPercent: -4 },
        {
          scale: 1,
          yPercent: 4,
          ease: "none",
          scrollTrigger: {
            trigger: raiz.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );

      gsap.from(".cta__entra", {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: raiz.current, start: "top 68%", once: true },
      });

      // O halo segue o cursor dentro do cartão. `quickTo` porque pointermove
      // dispara muito e um tween por evento seria desperdício.
      const cartao = raiz.current!.querySelector(".cta__cartao")!;
      const halo = raiz.current!.querySelector(".cta__halo")!;
      const paraX = gsap.quickTo(halo, "x", { duration: 0.7, ease: "power3" });
      const paraY = gsap.quickTo(halo, "y", { duration: 0.7, ease: "power3" });

      const mover = (e: PointerEvent) => {
        const r = cartao.getBoundingClientRect();
        paraX(e.clientX - r.left - r.width / 2);
        paraY(e.clientY - r.top - r.height / 2);
      };
      const entrar = () => gsap.to(halo, { opacity: 1, duration: 0.4 });
      const sair = () => gsap.to(halo, { opacity: 0, duration: 0.5 });

      const mm = matchMedia("(hover: hover) and (pointer: fine)");
      if (mm.matches) {
        cartao.addEventListener("pointermove", mover as EventListener);
        cartao.addEventListener("pointerenter", entrar);
        cartao.addEventListener("pointerleave", sair);
      }
      return () => {
        cartao.removeEventListener("pointermove", mover as EventListener);
        cartao.removeEventListener("pointerenter", entrar);
        cartao.removeEventListener("pointerleave", sair);
      };
    }, raiz);

    return () => ctx.revert();
  }, []);

  return (
    <section className="cta" id="contato" ref={raiz}>
      <div className="cta__fundo" aria-hidden>
        <div className="cta__foto" />
        <div className="cta__veu" />
      </div>

      <div className="cta__cartao">
        <div className="cta__halo" aria-hidden />

        <p className="rotulo cta__entra">
          <i />
          Próximo passo
        </p>

        <h2 className="cta__entra">
          Vamos deixar sua marca
          <br />
          <em>do tamanho do seu trabalho?</em>
        </h2>

        <p className="cta__linha cta__entra">
          Conte onde a empresa está hoje. Você recebe um diagnóstico e uma
          proposta com escopo e valor fechados.
        </p>

        <div className="cta__acoes cta__entra">
          <button
            type="button"
            className="botao cta__pulso"
            onClick={aoAbrirContato}
          >
            <span>Falar com a Íntegra</span>
            <ArrowUpRight size={18} />
          </button>
        </div>

        <div className="cta__base cta__entra">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="cta__marca"
            src="/integra-lockup.png"
            alt="Íntegra Consultoria de Marketing"
          />

          <p className="cta__meta">
            Consultoria de marketing.
            <br />
            Identidade visual, conteúdo e tráfego pago.
          </p>

          <div className="cta__links">
            <a href={INSTAGRAM} target="_blank" rel="noreferrer noopener">
              Instagram
            </a>
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <span>© {new Date().getFullYear()} Íntegra</span>
          </div>
        </div>
      </div>
    </section>
  );
}
