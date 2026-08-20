"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowUpRight, Check, X } from "lucide-react";
import { WHATSAPP, linkWhatsApp } from "@/lib/contato";
import "./modal.css";

const SEGMENTOS = [
  "Comércio",
  "Serviço",
  "Saúde",
  "Alimentação",
  "Indústria",
  "Outro",
];

const OBJETIVOS = [
  "Refazer a identidade visual",
  "Manter as redes ativas",
  "Vender mais com anúncio",
  "Ainda não sei, quero conversar",
];

const vazio = {
  nome: "",
  telefone: "",
  empresa: "",
  segmento: "",
  objetivo: "",
  mensagem: "",
};

type Campos = typeof vazio;
type Erros = Partial<Record<keyof Campos, string>>;

/**
 * Formulário de contato.
 *
 * Não existe backend ainda, então em vez de fingir um "enviado com sucesso" que
 * não aconteceu, ele monta a mensagem e abre o WhatsApp da Íntegra com tudo
 * preenchido. A pessoa vê exatamente o que está mandando.
 */
export default function ModalContato({
  aberto,
  aoFechar,
}: {
  aberto: boolean;
  aoFechar: () => void;
}) {
  const [dados, setDados] = useState<Campos>(vazio);
  const [erros, setErros] = useState<Erros>({});
  const [enviado, setEnviado] = useState(false);
  const painel = useRef<HTMLDivElement>(null);
  const raiz = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      tl.current = gsap
        .timeline({ paused: true, defaults: { ease: "power4.out" } })
        .fromTo(".mc__veu", { opacity: 0 }, { opacity: 1, duration: 0.3 })
        .fromTo(
          ".mc__painel",
          { opacity: 0, y: 32, scale: 0.985 },
          { opacity: 1, y: 0, scale: 1, duration: 0.48 },
          "-=0.2",
        )
        .fromTo(
          ".mc__campo, .mc__acoes",
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.03 },
          "-=0.28",
        );
    }, raiz);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!tl.current) return;
    if (aberto) {
      tl.current.play();
      const t = setTimeout(
        () =>
          painel.current
            ?.querySelector("input")
            ?.focus({ preventScroll: true }),
        360,
      );
      return () => clearTimeout(t);
    }
    tl.current.reverse();
  }, [aberto]);

  useEffect(() => {
    if (!aberto) return;
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") aoFechar();
      if (e.key !== "Tab") return;
      // Trava de foco: sem isto o Tab sai do modal e vai passear pela página
      // que está atrás, o que confunde teclado e leitor de tela.
      const focaveis = painel.current!.querySelectorAll<HTMLElement>(
        "input, select, textarea, button, a[href]",
      );
      if (!focaveis.length) return;
      const primeiro = focaveis[0];
      const ultimo = focaveis[focaveis.length - 1];
      if (e.shiftKey && document.activeElement === primeiro) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primeiro.focus();
      }
    };
    addEventListener("keydown", tecla);
    return () => removeEventListener("keydown", tecla);
  }, [aberto, aoFechar]);

  const setar =
    (campo: keyof Campos) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => {
      setDados((d) => ({ ...d, [campo]: e.target.value }));
      setErros((x) => ({ ...x, [campo]: undefined }));
    };

  function validar(): Erros {
    const e: Erros = {};
    if (dados.nome.trim().length < 2) e.nome = "Escreva seu nome";
    const digitos = dados.telefone.replace(/\D/g, "");
    if (digitos.length < 10 || digitos.length > 13)
      e.telefone = "Telefone com DDD, só números";
    return e;
  }

  function enviar(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validar();
    setErros(e);
    if (Object.keys(e).length) {
      // Levar o foco ao primeiro campo com erro é trabalho do sistema, não de
      // quem preencheu.
      painel.current
        ?.querySelector<HTMLElement>(`[name="${Object.keys(e)[0]}"]`)
        ?.focus({ preventScroll: true });
      return;
    }

    const linhas = [
      "Olá, vim pelo site da Íntegra.",
      "",
      `Nome: ${dados.nome}`,
      `Telefone: ${dados.telefone}`,
      dados.empresa && `Empresa: ${dados.empresa}`,
      dados.segmento && `Segmento: ${dados.segmento}`,
      dados.objetivo && `Objetivo: ${dados.objetivo}`,
      dados.mensagem && `\n${dados.mensagem}`,
    ].filter(Boolean) as string[];

    setEnviado(true);
    window.open(linkWhatsApp(linhas.join("\n")), "_blank", "noopener");
  }

  function fechar() {
    aoFechar();
    // Limpa só depois da saída, senão o formulário se esvazia na frente da
    // pessoa enquanto o painel ainda está visível.
    setTimeout(() => {
      setEnviado(false);
      setDados(vazio);
      setErros({});
    }, 500);
  }

  return (
    <div
      ref={raiz}
      className={`mc ${aberto ? "mc--aberto" : ""}`}
      aria-hidden={!aberto}
      inert={!aberto}
    >
      <div className="mc__veu" onClick={fechar} />

      <div
        className="mc__painel"
        ref={painel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mc-titulo"
      >
        <button className="mc__fechar" onClick={fechar} aria-label="Fechar">
          <X size={18} />
        </button>

        <div className="mc__conteudo">
          {enviado ? (
            <div className="mc__ok">
              <span className="mc__okIcone">
                <Check size={24} />
              </span>
              <h3>Abrimos o WhatsApp para você</h3>
              <p>
                A mensagem já foi montada com o que você preencheu. Se a janela
                não abriu, o bloqueador de pop-up barrou.{" "}
                <a
                  href={`https://api.whatsapp.com/send?phone=${WHATSAPP}`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Abrir manualmente
                </a>
                .
              </p>
              <button className="botao-fantasma" onClick={fechar}>
                Fechar
              </button>
            </div>
          ) : (
            <form onSubmit={enviar} noValidate>
              <h3 id="mc-titulo">
                Conte onde a empresa
                <br />
                <em>está hoje.</em>
              </h3>
              <p className="mc__sub">
                A resposta sai no mesmo dia útil, com diagnóstico e proposta.
              </p>

              <div className="mc__grade">
                <Campo
                  nome="nome"
                  rotulo="Seu nome"
                  valor={dados.nome}
                  aoMudar={setar("nome")}
                  erro={erros.nome}
                  autoComplete="name"
                />
                <Campo
                  nome="telefone"
                  tipo="tel"
                  rotulo="WhatsApp com DDD"
                  valor={dados.telefone}
                  aoMudar={setar("telefone")}
                  erro={erros.telefone}
                  autoComplete="tel"
                />
                <Campo
                  nome="empresa"
                  rotulo="Empresa"
                  valor={dados.empresa}
                  aoMudar={setar("empresa")}
                  opcional
                />

                <label className="mc__campo">
                  <span className="mc__rotulo">Segmento</span>
                  <select
                    name="segmento"
                    value={dados.segmento}
                    onChange={setar("segmento")}
                  >
                    <option value="">Selecione</option>
                    {SEGMENTOS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="mc__campo mc__campo--largo">
                  <span className="mc__rotulo">O que você precisa agora</span>
                  <select
                    name="objetivo"
                    value={dados.objetivo}
                    onChange={setar("objetivo")}
                  >
                    <option value="">Selecione</option>
                    {OBJETIVOS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="mc__campo mc__campo--largo">
                  <span className="mc__rotulo">
                    Mensagem <em>opcional</em>
                  </span>
                  <textarea
                    rows={3}
                    name="mensagem"
                    value={dados.mensagem}
                    onChange={setar("mensagem")}
                    placeholder="Escreva o que está travando hoje"
                  />
                </label>
              </div>

              <div className="mc__acoes">
                <button type="submit" className="botao">
                  <span>Continuar no WhatsApp</span>
                  <ArrowUpRight size={18} />
                </button>
                <p className="mc__aviso">
                  Seus dados vão só para a nossa conversa. Nada de lista de
                  disparo.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Campo({
  nome,
  rotulo,
  valor,
  aoMudar,
  erro,
  tipo = "text",
  opcional,
  ...resto
}: {
  nome: string;
  rotulo: string;
  valor: string;
  aoMudar: (e: React.ChangeEvent<HTMLInputElement>) => void;
  erro?: string;
  tipo?: string;
  opcional?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`mc__campo ${erro ? "mc__campo--erro" : ""}`}>
      <span className="mc__rotulo">
        {rotulo} {opcional && <em>opcional</em>}
      </span>
      <input
        type={tipo}
        name={nome}
        value={valor}
        onChange={aoMudar}
        aria-invalid={!!erro}
        aria-describedby={erro ? `${nome}-erro` : undefined}
        {...resto}
      />
      {erro && (
        <span className="mc__erro" id={`${nome}-erro`} role="alert">
          {erro}
        </span>
      )}
    </label>
  );
}
