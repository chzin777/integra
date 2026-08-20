"use client";

import "./sections.css";

/**
 * O método é uma sequência real: cada etapa só existe depois da anterior. Por
 * isso ela é numerada, e por isso é uma lista simples em vez de uma pilha
 * animada. A ordem já é a informação.
 */
const ETAPAS = [
  {
    prazo: "Semana 1",
    nome: "Diagnóstico",
    texto:
      "Uma conversa e um pente-fino no que já existe: marca, redes, anúncios e o que o concorrente anda fazendo.",
  },
  {
    prazo: "Semanas 2 e 3",
    nome: "Identidade",
    texto:
      "Definimos como a marca fala e aparece. Sai um manual de uso, não um arquivo solto no WhatsApp.",
  },
  {
    prazo: "Mês 1 em diante",
    nome: "Conteúdo",
    texto:
      "Calendário, produção e publicação. Você aprova por aqui e a gente executa sem ficar cobrando material.",
  },
  {
    prazo: "Contínuo",
    nome: "Tráfego",
    texto:
      "Campanha no ar com verba acompanhada de perto e um relatório mensal que dá para ler sem tradutor.",
  },
];

export default function Metodo() {
  return (
    <section className="secao metodo" id="metodo">
      <h2 className="titulo-secao entra">
        Como a gente entra
        <br />
        na sua <em>operação.</em>
      </h2>

      <ol className="etapas">
        {ETAPAS.map((e, i) => (
          <li className="etapa entra" key={e.nome}>
            <span className="etapa__n">{String(i + 1).padStart(2, "0")}</span>
            <div className="etapa__corpo">
              <h3>{e.nome}</h3>
              <p>{e.texto}</p>
            </div>
            <span className="etapa__prazo">{e.prazo}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
