"use client";

import { Check } from "lucide-react";
import "./sections.css";

const PLANOS = [
  {
    nome: "Essencial",
    valor: "650",
    resumo: "Para quem precisa organizar a marca e manter o feed vivo.",
    itens: [
      "Identidade visual ou revisão da atual",
      "12 publicações por mês, arte e legenda",
      "Calendário aprovado por você",
      "Relatório mensal de alcance",
    ],
    destaque: false,
  },
  {
    nome: "Completo",
    valor: "1.150",
    resumo: "Para quem já quer o telefone tocando todo mês.",
    itens: [
      "Tudo do Essencial",
      "Tráfego pago no Meta e no Google",
      "Uma diária de captação de foto e vídeo por mês",
      "Acompanhamento de verba e de resultado",
    ],
    destaque: true,
  },
];

export default function Planos({
  aoAbrirContato,
}: {
  aoAbrirContato: () => void;
}) {
  return (
    <section className="secao planos" id="planos">
      <div className="planos__cabeca">
        <p className="rotulo planos__rotulo">
          <i />
          Planos mensais
        </p>
        <h2 className="titulo-secao entra">
          Valor fechado.
          <br />
          Escopo no papel.
        </h2>
      </div>

      <div className="planos__grade">
        {PLANOS.map((p) => (
          <article
            key={p.nome}
            className={`plano ${p.destaque ? "plano--destaque" : ""}`}
          >
            <h3>{p.nome}</h3>
            <p className="plano__resumo">{p.resumo}</p>
            <p className="plano__valor">
              <span>R$</span>
              {p.valor}
              <small>por mês</small>
            </p>
            <ul className="plano__itens">
              {p.itens.map((i) => (
                <li key={i}>
                  <Check size={16} aria-hidden />
                  {i}
                </li>
              ))}
            </ul>
            <button type="button" className="botao" onClick={aoAbrirContato}>
              Falar com a Íntegra
            </button>
          </article>
        ))}

        <article className="plano plano--medida">
          <h3>Projeto sob medida</h3>
          <p className="plano__resumo">
            Marca nova, lançamento ou um time interno que precisa de direção.
            A gente monta o escopo depois do diagnóstico.
          </p>
          <button
            type="button"
            className="botao-fantasma"
            onClick={aoAbrirContato}
          >
            Falar com a Íntegra
          </button>
        </article>
      </div>
    </section>
  );
}
