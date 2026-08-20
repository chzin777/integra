"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "./portfolio.css";

const PECAS = [
  { img: "/images/marca.png", rotulo: "Marca", meta: "Identidade e aplicação" },
  { img: "/images/logo.png", rotulo: "Logo", meta: "Desenho e variações" },
  { img: "/images/embalagem.png", rotulo: "Embalagem", meta: "Rótulo e caixa" },
  { img: "/images/outdoor.png", rotulo: "Mídia", meta: "Fachada e outdoor" },
  { img: "/images/filme.png", rotulo: "Filme", meta: "Captação e edição" },
];

const PROPORCAO_ABERTA = 0.5;

/**
 * Galeria em sanfona: as faixas fecham e a que está sob o cursor abre. Mostra
 * cinco frentes de trabalho no espaço de uma, sem virar carrossel.
 */
export default function Portfolio() {
  const [ativo, setAtivo] = useState(1);
  const faixas = useRef<(HTMLButtonElement | null)[]>([]);
  const fotos = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => {
    const cresce =
      (PROPORCAO_ABERTA * (PECAS.length - 1)) / (1 - PROPORCAO_ABERTA);
    faixas.current.forEach((faixa, i) => {
      if (!faixa) return;
      gsap.to(faixa, {
        flexGrow: i === ativo ? cresce : 1,
        duration: 0.6,
        ease: "power3.out",
      });
      gsap.to(fotos.current[i], {
        scale: i === ativo ? 1 : 1.12,
        filter:
          i === ativo
            ? "grayscale(0) brightness(1)"
            : "grayscale(1) brightness(0.5)",
        duration: 0.6,
      });
    });
  }, [ativo]);

  return (
    <section className="secao portfolio" id="portfolio">
      <h2 className="titulo-secao entra">
        Trabalho que já<br />
        <em>está na rua.</em>
      </h2>

      <div className="portfolio__sanfona">
        {PECAS.map((p, i) => (
          <button
            key={p.img}
            type="button"
            ref={(el) => {
              faixas.current[i] = el;
            }}
            className={`faixa ${i === ativo ? "faixa--aberta" : ""}`}
            onMouseEnter={() => setAtivo(i)}
            onFocus={() => setAtivo(i)}
            onClick={() => setAtivo(i)}
            aria-label={`${p.rotulo}, ${p.meta}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={(el) => {
                fotos.current[i] = el;
              }}
              src={p.img}
              alt=""
            />
            <span className="faixa__rot">
              {p.rotulo}
              <small>{p.meta}</small>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
