"use client";

import { ArrowUpRight } from "lucide-react";
import "./sections.css";

const SERVICOS = [
  {
    titulo: "Identidade visual",
    texto:
      "Logo, paleta, tipografia e as regras de uso. A marca fica reconhecível antes de ficar bonita.",
    img: "/images/logo.png",
  },
  {
    titulo: "Social media",
    texto:
      "Linha editorial, roteiro e arte. A conta posta com constância porque existe um plano por trás.",
    img: "/images/papel.png",
  },
  {
    titulo: "Tráfego pago",
    texto:
      "Meta e Google com verba controlada. Você vê quanto entrou, quanto saiu e o que fez o telefone tocar.",
    img: "/images/cidade.png",
  },
  {
    titulo: "Vídeo e foto",
    texto:
      "Captação e edição para o feed e para anúncio. Material próprio, sem banco de imagem genérico.",
    img: "/images/filme.png",
  },
  {
    titulo: "Consultoria de marca",
    texto:
      "Diagnóstico e plano para quem já tem time interno e precisa de direção, não de mão de obra.",
    img: "/images/consultoria.png",
  },
];

export default function Servicos({
  aoAbrirContato,
}: {
  aoAbrirContato: () => void;
}) {
  return (
    <section className="secao servicos" id="servicos">
      <div className="servicos__cabeca entra">
        <h2 className="titulo-secao">
          O que a Íntegra
          <br />
          <em>faz por você.</em>
        </h2>
        <p className="texto-apoio">
          Cinco frentes que funcionam juntas. Dá para contratar uma, e dá para
          entregar a marca inteira na nossa mão.
        </p>
      </div>

      <div className="servicos__lista">
        {SERVICOS.map((s) => (
          <article className="servico" key={s.titulo}>
            {/* A foto só aparece no hover, dentro da própria linha: dá corpo à
                lista sem transformá-la numa grade de cartões. */}
            <span
              className="servico__foto"
              style={{ backgroundImage: `url(${s.img})` }}
              aria-hidden
            />
            <h3>{s.titulo}</h3>
            <p>{s.texto}</p>
            <button
              type="button"
              className="servico__acao"
              onClick={aoAbrirContato}
              aria-label={`Falar sobre ${s.titulo}`}
            >
              <ArrowUpRight size={20} />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
