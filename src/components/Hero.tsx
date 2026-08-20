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

const CHIPS = ["Identidade", "Conteúdo", "Tráfego pago"];
const INTERVALO = 4200;

type Props = {
  aoIr: (alvo: string) => void;
  aoAbrirContato: () => void;
};

/**
 * Capa em profundidade: título à esquerda, cena 3D à direita. Duas fotos em
 * planos de Z diferentes, uma aura amarela ao fundo e etiquetas flutuantes.
 * Tudo se move em velocidades distintas no ponteiro e na rolagem — parallax de
 * verdade, com perspectiva no pai, para dar volume em vez de só deslizar.
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

      // Entrada: rótulo, título linha a linha, apoio, e a cena que "recua".
      gsap
        .timeline({ defaults: { ease: "power4.out" } })
        .from(".hero__rotulo", { y: 16, opacity: 0, duration: 0.6 })
        .from(
          ".hero__linha > span",
          { yPercent: 118, duration: 0.95, stagger: 0.09 },
          "-=0.3",
        )
        .from(
          ".hero__apoio > *",
          { y: 18, opacity: 0, duration: 0.6, stagger: 0.08 },
          "-=0.55",
        )
        .from(
          ".hero__card",
          {
            yPercent: 12,
            opacity: 0,
            rotateY: -12,
            duration: 1.3,
            stagger: 0.14,
          },
          "-=1",
        )
        .fromTo(
          ".hero__card img",
          { scale: 1.25 },
          { scale: 1.06, duration: 1.5 },
          "<",
        )
        .from(
          ".hero__chip, .hero__selo, .hero__nota",
          { scale: 0.6, opacity: 0, duration: 0.7, stagger: 0.08 },
          "-=0.9",
        );

      const cena = raiz.current!.querySelector<HTMLElement>(".hero__cena")!;

      // Parallax de rolagem: cada plano num ritmo. `ease:'none'` + scrub para a
      // imagem não descolar do dedo de quem rola.
      const scroll = (sel: string, from: number, to: number) =>
        gsap.fromTo(
          sel,
          { yPercent: from },
          {
            yPercent: to,
            ease: "none",
            scrollTrigger: {
              trigger: raiz.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      scroll(".hero__aura", -8, 22);
      scroll(".hero__card--um", -2, 8);
      scroll(".hero__card--dois", -6, 18);
      scroll(".hero__chip", 4, -16);

      // Parallax de ponteiro. quickTo reusa o tween: pointermove dispara dezenas
      // de vezes por segundo. Cada plano anda uma quantidade diferente, então a
      // cena parece ter profundidade, não um adesivo.
      const q = (t: gsap.TweenTarget, p: string) =>
        gsap.quickTo(t, p, { duration: 0.8, ease: "power3" });
      const cenaX = q(cena, "rotateY");
      const cenaY = q(cena, "rotateX");
      const um = { x: q(".hero__card--um", "xPercent"), y: q(".hero__card--um", "yPercent") };
      const dois = { x: q(".hero__card--dois", "xPercent"), y: q(".hero__card--dois", "yPercent") };
      const aura = { x: q(".hero__aura", "xPercent"), y: q(".hero__aura", "yPercent") };

      const mover = (e: PointerEvent) => {
        const r = raiz.current!.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        cenaX(px * 10);
        cenaY(py * -8);
        um.x(px * -4);
        um.y(py * -4);
        dois.x(px * -9);
        dois.y(py * -9);
        aura.x(px * 6);
        aura.y(py * 6);
      };
      const sair = () => {
        cenaX(0); cenaY(0);
        um.x(0); um.y(0);
        dois.x(0); dois.y(0);
        aura.x(0); aura.y(0);
      };

      const mm = matchMedia("(hover: hover) and (pointer: fine)");
      const alvo = raiz.current!;
      const ligar = () => {
        if (mm.matches) {
          alvo.addEventListener("pointermove", mover);
          alvo.addEventListener("pointerleave", sair);
        } else {
          alvo.removeEventListener("pointermove", mover);
          alvo.removeEventListener("pointerleave", sair);
        }
      };
      ligar();
      mm.addEventListener("change", ligar);

      document.fonts?.ready.then(() => ScrollTrigger.refresh());

      return () => {
        alvo.removeEventListener("pointermove", mover);
        alvo.removeEventListener("pointerleave", sair);
        mm.removeEventListener("change", ligar);
      };
    }, raiz);

    return () => ctx.revert();
  }, []);

  const proxima = (atual + 1) % FOTOS.length;

  return (
    <section className="hero" id="inicio" ref={raiz}>
      <div className="hero__aura" aria-hidden />

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
        className="hero__cena"
        onMouseEnter={() => setParado(true)}
        onMouseLeave={() => setParado(false)}
      >
        {/* Carta de fundo: plano mais profundo, mostra a próxima foto. */}
        <figure className="hero__card hero__card--dois" aria-hidden>
          {FOTOS.map((f, i) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img key={f.src} src={f.src} alt="" className={i === proxima ? "ativa" : ""} />
          ))}
        </figure>

        {/* Carta da frente: foto principal em rotação. */}
        <figure className="hero__card hero__card--um">
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
        </figure>

        {/* Selo amarelo girando: assinatura da marca. */}
        <div className="hero__selo" aria-hidden>
          <svg viewBox="0 0 100 100">
            <defs>
              <path
                id="hero-circulo"
                d="M50,50 m-34,0 a34,34 0 1,1 68,0 a34,34 0 1,1 -68,0"
              />
            </defs>
            <text>
              <textPath href="#hero-circulo">
                ÍNTEGRA · CONSULTORIA DE MARKETING ·
              </textPath>
            </text>
          </svg>
          <span className="hero__selo-nucleo">✳</span>
        </div>

        {/* Etiquetas flutuantes das frentes de trabalho. */}
        {CHIPS.map((c, i) => (
          <span key={c} className={`hero__chip hero__chip--${i + 1}`} aria-hidden>
            {c}
          </span>
        ))}

        <span className="hero__nota" aria-hidden>
          Repertório vivo — {FOTOS.length} peças na rua
        </span>
      </div>

      <button
        type="button"
        className="hero__rolar"
        onClick={() => aoIr("#servicos")}
        aria-label="Rolar para os serviços"
      >
        <span>Role</span>
        <ArrowDown size={15} />
      </button>
    </section>
  );
}
