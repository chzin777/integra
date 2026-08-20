"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown } from "lucide-react";
import "./hero.css";

gsap.registerPlugin(ScrollTrigger);

/**
 * Hero em camadas.
 *
 * O título não fica na frente da foto, fica ENTRE as camadas: existe algo atrás
 * dele e algo na frente. É o que dá profundidade de verdade. Cada camada tem
 * uma velocidade própria, e quanto mais perto do observador mais rápido ela
 * sobe. A camada `acima` anda junto do título, mas no topo da pilha, para que
 * os botões nunca fiquem atrás da névoa.
 */
const CAMADAS = [
  { classe: "ceu", velocidade: 0.06 },
  { classe: "foto", velocidade: 0.18 },
  { classe: "brilho", velocidade: 0.3 },
  { classe: "conteudo", velocidade: 0.55 },
  { classe: "frente", velocidade: 0.92 },
  { classe: "acima", velocidade: 0.55 },
];

type Props = {
  aoIr: (alvo: string) => void;
  aoAbrirContato: () => void;
};

export default function Hero({ aoIr, aoAbrirContato }: Props) {
  const raiz = useRef<HTMLElement>(null);
  const camadaAcima = useRef<HTMLDivElement>(null);

  /**
   * O rodapé saiu do fluxo do título e vive noutra camada. Sem devolver a
   * altura real dele como padding, o título desce por cima. Medida, não
   * chutada: o bloco muda de altura conforme a fonte carrega.
   */
  useEffect(() => {
    const alvo = camadaAcima.current?.firstElementChild;
    if (!alvo) return;
    const ro = new ResizeObserver(([entrada]) => {
      raiz.current?.style.setProperty(
        "--hero-rodape",
        `${entrada.contentRect.height}px`,
      );
    });
    ro.observe(alvo);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // `ease:'none'` é obrigatório com scrub: qualquer curva por cima faz a
      // camada descolar do dedo de quem rola.
      CAMADAS.forEach(({ classe, velocidade }) => {
        gsap.to(`.hero__${classe}`, {
          yPercent: velocidade * 40,
          ease: "none",
          scrollTrigger: {
            trigger: raiz.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      });

      gsap.to([".hero__conteudo", ".hero__acima"], {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: raiz.current,
          start: "center top",
          end: "bottom top",
          scrub: true,
        },
      });

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.from(".hero__rotulo", { y: 18, opacity: 0, duration: 0.6 })
        .from(
          ".hero__linha span",
          { yPercent: 118, duration: 1, stagger: 0.08 },
          "-=0.3",
        )
        .from(
          ".hero__rodape > *",
          { y: 16, opacity: 0, duration: 0.6, stagger: 0.08 },
          "-=0.45",
        )
        // `opacity` e `scale`, nunca `yPercent`: o parallax de scroll já é dono
        // do yPercent desta camada, e duas tweens na mesma propriedade brigam.
        .from(".hero__frente", { opacity: 0, scale: 1.05, duration: 1.3 }, "-=1");

      // Parallax de mouse: `quickTo` reusa o mesmo tween, então cada evento de
      // ponteiro custa quase nada.
      const alvos = CAMADAS.map(({ classe, velocidade }) => ({
        x: gsap.quickTo(`.hero__${classe}`, "x", {
          duration: 0.9,
          ease: "power3",
        }),
        y: gsap.quickTo(`.hero__${classe}`, "y", {
          duration: 0.9,
          ease: "power3",
        }),
        v: velocidade,
      }));

      const mover = (e: PointerEvent) => {
        const px = e.clientX / innerWidth - 0.5;
        const py = e.clientY / innerHeight - 0.5;
        alvos.forEach(({ x, y, v }) => {
          x(px * -32 * v);
          y(py * -16 * v);
        });
      };

      const mm = matchMedia("(hover: hover) and (pointer: fine)");
      const ligar = () => {
        if (mm.matches) addEventListener("pointermove", mover);
        else removeEventListener("pointermove", mover);
      };
      ligar();
      mm.addEventListener("change", ligar);

      return () => {
        removeEventListener("pointermove", mover);
        mm.removeEventListener("change", ligar);
      };
    }, raiz);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" id="inicio" ref={raiz}>
      <div className="hero__ceu" aria-hidden />
      <div className="hero__foto" aria-hidden />
      <div className="hero__brilho" aria-hidden />
      <div className="hero__grade" aria-hidden />

      <div className="hero__conteudo">
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
      </div>

      <div className="hero__frente" aria-hidden />
      <div className="hero__vinheta" aria-hidden />

      <div className="hero__acima" ref={camadaAcima}>
        <div className="hero__rodape">
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
              onClick={() => aoIr("#servicos")}
            >
              Ver o que fazemos
              <ArrowDown size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
