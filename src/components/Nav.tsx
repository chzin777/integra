"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Menu, X } from "lucide-react";
import "./nav.css";

const LINKS = [
  {
    rotulo: "Serviços",
    alvo: "#servicos",
    nota: "Identidade, conteúdo e tráfego",
    img: "/images/marca.png",
  },
  {
    rotulo: "Método",
    alvo: "#metodo",
    nota: "Como a gente entra na sua operação",
    img: "/images/consultoria.png",
  },
  {
    rotulo: "Portfólio",
    alvo: "#portfolio",
    nota: "Marcas que já passaram por aqui",
    img: "/images/outdoor.png",
  },
  {
    rotulo: "Planos",
    alvo: "#planos",
    nota: "Valor fechado, escopo no papel",
    img: "/images/papel.png",
  },
  {
    rotulo: "Contato",
    alvo: "#contato",
    nota: "Resposta no mesmo dia útil",
    img: "/images/estudio.png",
  },
];

type Props = {
  aoIr: (alvo: string) => void;
  aoAbrirContato: () => void;
};

/**
 * Topo com marca e botão. Os links moram numa cortina de tela cheia, então o
 * hero começa limpo e a navegação não rouba a primeira linha do título.
 */
export default function Nav({ aoIr, aoAbrirContato }: Props) {
  const [aberto, setAberto] = useState(false);
  const [sobre, setSobre] = useState(0);
  const cortina = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  // A timeline nasce uma vez e depois só toca para frente ou para trás.
  // Recriar a cada abertura perderia o estado do meio e travaria a animação.
  useEffect(() => {
    const ctx = gsap.context(() => {
      tl.current = gsap
        .timeline({ paused: true, defaults: { ease: "power4.out" } })
        .fromTo(
          ".cortina__item",
          { y: 70, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.65, stagger: 0.055 },
          0.16,
        )
        .fromTo(
          ".cortina__pe",
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.45 },
          0.36,
        );
    }, cortina);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (aberto) {
      tl.current?.play();
      document.body.style.touchAction = "none";
    } else {
      tl.current?.reverse();
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.touchAction = "";
    };
  }, [aberto]);

  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape" && aberto) setAberto(false);
    };
    addEventListener("keydown", tecla);
    return () => removeEventListener("keydown", tecla);
  }, [aberto]);

  const ir = (alvo: string) => {
    setAberto(false);
    // Espera a cortina subir. Rolar antes deixa a página se mexendo por trás
    // de um painel que ainda está fechando.
    setTimeout(() => aoIr(alvo), 420);
  };

  return (
    <>
      <header className="topo">
        <button
          className="topo__marca"
          onClick={() => aoIr("#inicio")}
          aria-label="Íntegra, início"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/integra-logo.png" alt="" aria-hidden />
          <span className="topo__marcaTexto">ÍNTEGRA</span>
        </button>

        <button
          className="topo__menu"
          onClick={() => setAberto((v) => !v)}
          aria-expanded={aberto}
          aria-controls="cortina-menu"
        >
          <span>{aberto ? "Fechar" : "Menu"}</span>
          {aberto ? <X size={17} /> : <Menu size={17} />}
        </button>
      </header>

      <div
        className={`cortina ${aberto ? "cortina--aberta" : ""}`}
        id="cortina-menu"
        ref={cortina}
        role="dialog"
        aria-modal="true"
        aria-label="Navegação"
        aria-hidden={!aberto}
        inert={!aberto}
      >
        <div className="cortina__corpo">
          <nav className="cortina__lista">
            {LINKS.map((l, i) => (
              <div className="cortina__slot" key={l.alvo}>
                <button
                  className={`cortina__item ${sobre === i ? "esta-sobre" : ""}`}
                  onClick={() => ir(l.alvo)}
                  onMouseEnter={() => setSobre(i)}
                  onFocus={() => setSobre(i)}
                >
                  <span className="cortina__rot">{l.rotulo}</span>
                  <span className="cortina__nota">{l.nota}</span>
                </button>
              </div>
            ))}
          </nav>

          {/* Prévia que troca com o item sob o cursor: adianta o que a pessoa
              vai encontrar lá embaixo e dá corpo ao painel. */}
          <div className="cortina__previa" aria-hidden>
            {LINKS.map((l, i) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={l.alvo}
                src={l.img}
                alt=""
                className={sobre === i ? "ativa" : ""}
              />
            ))}
          </div>
        </div>

        <div className="cortina__pe">
          <button
            className="botao"
            onClick={() => {
              setAberto(false);
              setTimeout(aoAbrirContato, 420);
            }}
          >
            Falar com a Íntegra
          </button>
          <a
            className="cortina__insta"
            href="https://www.instagram.com/integra.marketing"
            target="_blank"
            rel="noreferrer noopener"
          >
            @integra.marketing
          </a>
        </div>
      </div>
    </>
  );
}
