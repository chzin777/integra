"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import "./nav.css";

const LINKS = [
  { rotulo: "Serviços", alvo: "#servicos" },
  { rotulo: "Método", alvo: "#metodo" },
  { rotulo: "Portfólio", alvo: "#portfolio" },
  { rotulo: "Planos", alvo: "#planos" },
];

type Props = {
  aoIr: (alvo: string) => void;
  aoAbrirContato: () => void;
};

/**
 * Barra de navegação.
 *
 * Uma linha só no desktop, com a seção em que a pessoa está marcada pelo grifo.
 * No celular vira um painel curto, aberto pelo botão. A barra ganha fundo
 * sólido assim que a página sai do topo, senão os links somem sobre a foto.
 */
export default function Nav({ aoIr, aoAbrirContato }: Props) {
  const [aberto, setAberto] = useState(false);
  const [rolou, setRolou] = useState(false);
  const [ativo, setAtivo] = useState("");

  // IntersectionObserver em vez de listener de scroll: o navegador avisa, não
  // precisamos recalcular a cada quadro.
  useEffect(() => {
    const secoes = LINKS.map((l) => document.querySelector(l.alvo)).filter(
      Boolean,
    ) as Element[];

    const observador = new IntersectionObserver(
      (entradas) => {
        const visivel = entradas
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visivel) setAtivo(`#${visivel.target.id}`);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.2, 0.6] },
    );
    secoes.forEach((s) => observador.observe(s));

    const topo = document.querySelector("#inicio");
    const sentinela = new IntersectionObserver(
      ([e]) => setRolou(!e.isIntersecting),
      { rootMargin: "-72px 0px 0px 0px" },
    );
    if (topo) sentinela.observe(topo);

    return () => {
      observador.disconnect();
      sentinela.disconnect();
    };
  }, []);

  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAberto(false);
    };
    addEventListener("keydown", tecla);
    return () => removeEventListener("keydown", tecla);
  }, []);

  const ir = (alvo: string) => {
    setAberto(false);
    aoIr(alvo);
  };

  return (
    <header className={`nav ${rolou ? "nav--solida" : ""}`}>
      <div className="nav__interno">
        <button
          className="nav__marca"
          onClick={() => ir("#inicio")}
          aria-label="Íntegra, início"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/integra-logo.png" alt="" aria-hidden />
          <span>ÍNTEGRA</span>
        </button>

        <nav className="nav__links" aria-label="Seções">
          {LINKS.map((l) => (
            <button
              key={l.alvo}
              className={`nav__link ${ativo === l.alvo ? "esta-aqui" : ""}`}
              onClick={() => ir(l.alvo)}
              aria-current={ativo === l.alvo ? "true" : undefined}
            >
              {l.rotulo}
            </button>
          ))}
        </nav>

        <div className="nav__acoes">
          <button type="button" className="botao nav__cta" onClick={aoAbrirContato}>
            Falar com a Íntegra
          </button>
          <button
            className="nav__hamburguer"
            onClick={() => setAberto((v) => !v)}
            aria-expanded={aberto}
            aria-controls="nav-painel"
            aria-label={aberto ? "Fechar menu" : "Abrir menu"}
          >
            {aberto ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div
        className={`nav__painel ${aberto ? "nav__painel--aberto" : ""}`}
        id="nav-painel"
        inert={!aberto}
      >
        {LINKS.map((l) => (
          <button key={l.alvo} onClick={() => ir(l.alvo)}>
            {l.rotulo}
          </button>
        ))}
        <button
          type="button"
          className="botao"
          onClick={() => {
            setAberto(false);
            aoAbrirContato();
          }}
        >
          Falar com a Íntegra
        </button>
      </div>
    </header>
  );
}
