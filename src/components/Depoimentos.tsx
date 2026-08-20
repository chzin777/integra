"use client";

import "./sections.css";

/**
 * Depoimentos de exemplo. Trocar pelos prints reais de feedback que já existem
 * no destaque do Instagram antes de publicar.
 */
const FALAS = [
  {
    texto:
      "A gente vendia bem e parecia pequeno. Depois da marca nova, cliente novo chega achando que a loja é maior do que é.",
    nome: "Marina Ferrarezi",
    papel: "Sócia, Casa Ferrarezi Móveis",
  },
  {
    texto:
      "Primeiro mês de anúncio já pagou o plano. O que mudou foi ter alguém olhando a verba todo dia.",
    nome: "Rodrigo Bianchi",
    papel: "Proprietário, Bianchi Climatização",
  },
  {
    texto:
      "Eu não precisava mais de post bonito, precisava de constância. É o que eu tenho hoje sem cobrar ninguém.",
    nome: "Aline Tavares",
    papel: "Cirurgiã-dentista",
  },
];

export default function Depoimentos() {
  return (
    <section className="secao depoimentos">
      <h2 className="titulo-secao entra">
        Quem já <em>saiu do amadorismo.</em>
      </h2>

      <div className="depoimentos__grade">
        {FALAS.map((f) => (
          <figure className="fala entra" key={f.nome}>
            <blockquote>{f.texto}</blockquote>
            <figcaption>
              <strong>{f.nome}</strong>
              <span>{f.papel}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
