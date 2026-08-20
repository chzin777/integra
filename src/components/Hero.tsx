"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown } from "lucide-react";
import "./hero.css";

gsap.registerPlugin(ScrollTrigger);

const FOTOS = [
  { src: "/images/estudio.png", alt: "Sala escura cortada por uma faixa de luz" },
  { src: "/images/marca.png", alt: "Cartões de marca sobre concreto" },
  { src: "/images/consultoria.png", alt: "Duas pessoas revisando resultados" },
  { src: "/images/filme.png", alt: "Câmera montada em um set de gravação" },
  { src: "/images/outdoor.png", alt: "Fachada com painel amarelo ao anoitecer" },
];

const INTERVALO = 4500;

type Props = {
  aoIr: (alvo: string) => void;
  aoAbrirContato: () => void;
};

/**
 * Capa: título à esquerda, carrossel à direita.
 *
 * O carrossel passa sozinho porque o trabalho é o argumento: quem chega vê
 * cinco peças antes de rolar. Ele para no hover e com o ponteiro dentro, para
 * a pessoa conseguir olhar uma foto sem correr atrás dela.
 */
export default function Hero({ aoIr, aoAbrirContato }: Props) {
  const raiz = useRef<HTMLElement>(null);
  const [atual, setAtual] = useState(0);
  const [parado, setParado] = useState(false);

  useEffect(() => {
    if (parado) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(
      () => setAtual((i) => (i + 1) % FOTOS.length),
      INTERVALO,
    );
    return () => clearInterval(t);
  }, [parado]);

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
        // A moldura abre: começa recortada por dentro e cresce até o tamanho
        // cheio enquanto a foto desamplia. Dá a sensação de recuar a câmera.
        .fromTo(
          ".hero__palco",
          { clipPath: "inset(14% 16% 14% 16% round 22px)", opacity: 0 },
          {
            clipPath: "inset(0% 0% 0% 0% round 22px)",
            opacity: 1,
            duration: 1.4,
          },
          "-=1.05",
        )
        .from(".hero__palco img", { scale: 1.22, duration: 1.6 }, "<");

      // `ease:'none'` com scrub: qualquer curva por cima descola a imagem do
      // dedo de quem rola.
      gsap.fromTo(
        ".hero__palco",
        { yPercent: -3 },
        {
          yPercent: 3,
          ease: "none",
          scrollTrigger: {
            trigger: raiz.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        },
      );

      // Parallax de ponteiro. `quickTo` reusa o mesmo tween: pointermove
      // dispara dezenas de vezes por segundo e um tween por evento seria
      // desperdício. A foto anda mais que a moldura, então o quadro parece uma
      // janela e não um adesivo.
      const palco = raiz.current!.querySelector<HTMLElement>(".hero__palco")!;
      const giroX = gsap.quickTo(palco, "rotateY", {
        duration: 0.8,
        ease: "power3",
      });
      const giroY = gsap.quickTo(palco, "rotateX", {
        duration: 0.8,
        ease: "power3",
      });
      const fotoX = gsap.quickTo(".hero__palco img", "xPercent", {
        duration: 0.9,
        ease: "power3",
      });
      const fotoY = gsap.quickTo(".hero__palco img", "yPercent", {
        duration: 0.9,
        ease: "power3",
      });

      const mover = (e: PointerEvent) => {
        const r = palco.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        giroX(px * 7);
        giroY(py * -5);
        fotoX(px * -3.5);
        fotoY(py * -3.5);
      };
      const sair = () => {
        giroX(0);
        giroY(0);
        fotoX(0);
        fotoY(0);
      };

      const mm = matchMedia("(hover: hover) and (pointer: fine)");
      const ligar = () => {
        if (mm.matches) {
          palco.addEventListener("pointermove", mover);
          palco.addEventListener("pointerleave", sair);
        } else {
          palco.removeEventListener("pointermove", mover);
          palco.removeEventListener("pointerleave", sair);
        }
      };
      ligar();
      mm.addEventListener("change", ligar);

      return () => {
        palco.removeEventListener("pointermove", mover);
        palco.removeEventListener("pointerleave", sair);
        mm.removeEventListener("change", ligar);
      };
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

      <div
        className="hero__palco"
        onMouseEnter={() => setParado(true)}
        onMouseLeave={() => setParado(false)}
      >
        {/* Pilha de imagens em vez de trocar o `src`: trocar dá flash branco. */}
        {FOTOS.map((f, i) => (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={f.src}
            src={f.src}
            alt={i === atual ? f.alt : ""}
            aria-hidden={i !== atual}
            className={i === atual ? "ativa" : ""}
          />
        ))}

        <div className="hero__marcadores" role="tablist" aria-label="Fotos">
          {FOTOS.map((f, i) => (
            <button
              key={f.src}
              role="tab"
              aria-selected={i === atual}
              aria-label={`Foto ${i + 1} de ${FOTOS.length}`}
              className={i === atual ? "ativo" : ""}
              onClick={() => setAtual(i)}
            >
              <i style={{ animationDuration: `${INTERVALO}ms` }} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
