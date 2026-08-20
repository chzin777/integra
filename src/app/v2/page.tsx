"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { ArrowUpRight, ArrowRight, Sun, Moon } from "lucide-react";
import { EMAIL, INSTAGRAM, linkWhatsApp } from "@/lib/contato";
import { createAnimation } from "@/components/ui/skiper-ui/skiper26";
import { Link001 } from "@/components/ui/skiper-ui/skiper40";
import { VariableFontHover } from "@/components/ui/variable-font-hover";
import "./v2.css";

gsap.registerPlugin(ScrollTrigger);

const SERVICOS = [
  { n: "01", t: "Identidade visual", d: "Marca, logo e um sistema visual que acompanha a empresa crescer." },
  { n: "02", t: "Conteúdo", d: "Linha editorial, captação e edição com constância e cuidado." },
  { n: "03", t: "Tráfego pago", d: "Campanhas guiadas por resultado, medidas de perto." },
  { n: "04", t: "Consultoria", d: "Diagnóstico honesto e um plano com escopo e valor fechados." },
];

const PECAS = [
  { img: "/images/marca.png", t: "Marca", m: "Identidade e aplicação" },
  { img: "/images/embalagem.png", t: "Embalagem", m: "Rótulo e caixa" },
  { img: "/images/outdoor.png", t: "Mídia externa", m: "Fachada e outdoor" },
  { img: "/images/filme.png", t: "Filme", m: "Captação e edição" },
  { img: "/images/estudio.png", t: "Estúdio", m: "Produção e set" },
  { img: "/images/papel.png", t: "Papelaria", m: "Sistema impresso" },
];

const FALAS = [
  { q: "Paramos de parecer amadores da noite para o dia. A marca ficou do tamanho do trabalho.", a: "Marina Alves", c: "Clínica Corpo & Mente" },
  { q: "Constância que a gente nunca tinha tido. O conteúdo passou a trabalhar sozinho.", a: "Rafael Lima", c: "Ateliê Lima" },
  { q: "Tráfego pago que finalmente fez sentido: com número e não com achismo.", a: "Bianca Souza", c: "Souza Odontologia" },
];

// Parede de fotos estilo skiper30: 4 colunas, cada uma correndo numa
// velocidade (múltiplo da altura da tela), com offset inicial próprio.
const WALL = [
  { top: "-45%", mult: 2.0, imgs: ["/images/marca.png", "/images/filme.png", "/images/embalagem.png"] },
  { top: "-95%", mult: 3.3, imgs: ["/images/outdoor.png", "/images/estudio.png", "/images/papel.png"] },
  { top: "-45%", mult: 1.25, imgs: ["/images/consultoria.png", "/images/parede.png", "/images/cidade.png"] },
  { top: "-75%", mult: 3.0, imgs: ["/images/estudio.png", "/images/outdoor.png", "/images/filme.png"] },
];

// Título com letras que se espalham e convergem no scroll (skiper31),
// dirigido por gsap ScrollTrigger.
function Kinetic({ text, className }: { text: string; className?: string }) {
  const chars = Array.from(text);
  const c = (chars.length - 1) / 2;
  return (
    <h2 className={`v2ktitle ${className || ""}`} aria-label={text}>
      {chars.map((ch, i) => (
        <span className="v2kchar" data-d={i - c} key={i} aria-hidden>
          {ch === " " ? " " : ch}
        </span>
      ))}
    </h2>
  );
}

export default function V2() {
  const [scrolled, setScrolled] = useState(false);
  const [claro, setClaro] = useState(true);
  const raiz = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const on = () => setScrolled(scrollY > 30);
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);

  // Toda a coreografia de scroll e entrada vive no GSAP + ScrollTrigger.
  useEffect(() => {
    const reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Smooth scroll (lenis) integrado ao ScrollTrigger — pré-requisito do
    // skiper30 e do parallax ficar sedoso.
    let lenis: Lenis | null = null;
    if (!reduz) {
      lenis = new Lenis({ lerp: 0.1 });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t) => lenis!.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    const ctx = gsap.context(() => {
      // 1) Cortina de entrada.
      const introTl = gsap.timeline();
      if (!reduz) {
        introTl
          .from(".v2intro span", { yPercent: 40, opacity: 0, duration: 0.7, ease: "power3.out" })
          .to(".v2intro span", { yPercent: -10, opacity: 0, duration: 0.4, delay: 0.4, ease: "power2.in" })
          .to(".v2intro", { yPercent: -100, duration: 0.8, ease: "power4.inOut" }, "-=0.1")
          .set(".v2intro", { display: "none" });
      } else {
        introTl.set(".v2intro", { display: "none" });
      }

      // 2) Entrada do hero, depois da cortina.
      if (!reduz) {
        gsap.timeline({ delay: 1.35, defaults: { ease: "power4.out" } })
          .from(".v2h__linha > span", { yPercent: 120, duration: 1, stagger: 0.09 })
          .from(".v2h__enter", { y: 24, opacity: 0, duration: 0.7, stagger: 0.1 }, "-=0.5")
          .from(".v2h__foto", { y: 46, opacity: 0, scale: 0.94, duration: 1, stagger: 0.14 }, "-=0.9");

        // Profundidade tipo câmera 3D: cada plano num Z diferente.
        gsap.set(".v2h__foto--a", { rotate: -3, z: -60 });
        gsap.set(".v2h__foto--b", { rotate: 4, z: 60 });
        gsap.set(".v2h__selo", { z: 100 });

        // 3) Parallax das fotos do hero conforme rola (scrub).
        gsap.to(".v2h__foto--a", {
          yPercent: -12, ease: "none",
          scrollTrigger: { trigger: ".v2h", start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to(".v2h__foto--b", {
          yPercent: 16, ease: "none",
          scrollTrigger: { trigger: ".v2h", start: "top top", end: "bottom top", scrub: true },
        });

        // 3d) Parallax de ponteiro: a cena inclina como uma câmera 3D e os
        // planos andam quantidades diferentes → profundidade real.
        const hero = raiz.current!.querySelector<HTMLElement>(".v2h");
        const mid = raiz.current!.querySelector<HTMLElement>(".v2h__mid");
        const mm = matchMedia("(hover: hover) and (pointer: fine)");
        if (hero && mid && mm.matches) {
          const q = (t: gsap.TweenTarget, p: string) =>
            gsap.quickTo(t, p, { duration: 0.9, ease: "power3" });
          const midY = q(mid, "rotateY"), midX = q(mid, "rotateX");
          const aX = q(".v2h__foto--a", "x"), aY = q(".v2h__foto--a", "y");
          const bX = q(".v2h__foto--b", "x"), bY = q(".v2h__foto--b", "y");
          const seloX = q(".v2h__selo", "x"), seloY = q(".v2h__selo", "y");
          const auraX = q(".v2h__texto", "x");
          const mover = (e: PointerEvent) => {
            const r = hero.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            midY(px * 12); midX(py * -10);
            aX(px * -20); aY(py * -20);
            bX(px * -40); bY(py * -40);
            seloX(px * -55); seloY(py * -55);
            auraX(px * 14);
          };
          const sair = () => {
            midY(0); midX(0); aX(0); aY(0); bX(0); bY(0); seloX(0); seloY(0); auraX(0);
          };
          hero.addEventListener("pointermove", mover);
          hero.addEventListener("pointerleave", sair);
        }

        // 3b) Títulos cinéticos (skiper31): letras convergem no scroll.
        gsap.utils.toArray<HTMLElement>(".v2ktitle").forEach((t) => {
          const chars = gsap.utils.toArray<HTMLElement>(t.querySelectorAll(".v2kchar"));
          chars.forEach((ch) => {
            const d = parseFloat(ch.dataset.d || "0");
            gsap.fromTo(ch,
              { x: d * 42, rotateX: d * 40, opacity: 0.25 },
              {
                x: 0, rotateX: 0, opacity: 1, ease: "none",
                scrollTrigger: { trigger: t, start: "top 90%", end: "top 45%", scrub: true },
              });
          });
        });

        // 4) Reveal das seções.
        gsap.utils.toArray<HTMLElement>(".v2-reveal").forEach((el) =>
          gsap.from(el, {
            y: 40, opacity: 0, duration: 0.9, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          }),
        );

        // 5) Parede de fotos skiper30: cada coluna corre múltiplos da altura
        // da tela, em velocidades diferentes (scrub).
        const H = () => window.innerHeight;
        gsap.utils.toArray<HTMLElement>(".v2wall__col").forEach((col) => {
          const mult = parseFloat(col.dataset.mult || "1");
          gsap.fromTo(col, { y: 0 }, {
            y: () => H() * mult, ease: "none",
            scrollTrigger: {
              trigger: ".v2wall", start: "top bottom", end: "bottom top",
              scrub: true, invalidateOnRefresh: true,
            },
          });
        });

        // 6) Footer: aura dourada deriva no scroll + segue o ponteiro; título
        // sobe em parallax. Dá vida e profundidade ao rodapé.
        gsap.fromTo(".v2ft__aura", { yPercent: -18 }, {
          yPercent: 22, ease: "none",
          scrollTrigger: { trigger: ".v2ft", start: "top bottom", end: "bottom bottom", scrub: true },
        });
        // Conteúdo do footer surge conforme ele é revelado (não mais "duro").
        gsap.from(".v2ft__anim", {
          y: 44, opacity: 0, filter: "blur(8px)",
          duration: 1, ease: "power3.out", stagger: 0.14,
          scrollTrigger: { trigger: ".v2ft", start: "top 78%", once: true },
        });
        gsap.from(".v2ft__t", {
          y: 40, ease: "none",
          scrollTrigger: { trigger: ".v2ft", start: "top bottom", end: "top 55%", scrub: true },
        });
        const ft = raiz.current!.querySelector<HTMLElement>(".v2ft");
        if (ft && mm.matches) {
          const auraX = gsap.quickTo(".v2ft__aura", "x", { duration: 1, ease: "power3" });
          const auraY = gsap.quickTo(".v2ft__aura", "y", { duration: 1, ease: "power3" });
          const onMove = (e: PointerEvent) => {
            const r = ft.getBoundingClientRect();
            auraX(((e.clientX - r.left) / r.width - 0.5) * 80);
            auraY(((e.clientY - r.top) / r.height - 0.5) * 60);
          };
          ft.addEventListener("pointermove", onMove);
        }
      }

      document.fonts?.ready.then(() => ScrollTrigger.refresh());
    }, raiz);

    return () => {
      ctx.revert();
      lenis?.destroy();
    };
  }, []);

  const ir = (a: string) => document.querySelector(a)?.scrollIntoView({ behavior: "smooth" });
  const contato = () => open(`mailto:${EMAIL}`);

  // Troca de tema com o efeito do skiper26 (View Transitions API).
  const trocarTema = () => {
    const anim = createAnimation("circle", "top-right");
    let style = document.getElementById("v2-tema-anim");
    if (!style) {
      style = document.createElement("style");
      style.id = "v2-tema-anim";
      document.head.appendChild(style);
    }
    style.textContent =
      ":root{--expo-out:cubic-bezier(0.16,1,0.3,1);--expo-in:cubic-bezier(0.7,0,0.84,0);}" + anim.css;

    const doc = document as Document & { startViewTransition?: (cb: () => void) => void };
    const reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!doc.startViewTransition || reduz) {
      setClaro((c) => !c);
      return;
    }
    doc.startViewTransition(() => flushSync(() => setClaro((c) => !c)));
  };

  return (
    <div className={`v2 ${claro ? "v2--claro" : ""}`} ref={raiz}>
      <div className="v2__grao" aria-hidden />

      {/* CTA flutuante do WhatsApp. */}
      <a
        className="v2zap"
        href={linkWhatsApp("Olá! Vim pelo site e quero falar sobre um projeto.")}
        target="_blank"
        rel="noreferrer noopener"
        aria-label="Falar no WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.002-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
        <span className="v2zap__balao">Fale no WhatsApp</span>
      </a>

      <div className="v2intro" ref={introRef}><span>Íntegra</span></div>

      <nav className={`v2nav ${scrolled ? "v2nav--on" : ""}`}>
        <button className="v2nav__marca" onClick={() => ir("#topo")}>Íntegra</button>
        <div className="v2nav__links">
          {[["Sobre", "#sobre"], ["Serviços", "#servicos"], ["Portfólio", "#portfolio"], ["Depoimentos", "#depoimentos"], ["Contato", "#contato"]].map(([t, a]) => (
            <button key={a} onClick={() => ir(a)} aria-label={t}>
              <VariableFontHover
                label={t}
                fromFontVariationSettings="'wght' 500 'opsz' 14"
                toFontVariationSettings="'wght' 700 'opsz' 14"
                staggerFrom="center"
                staggerDuration={0.02}
              />
            </button>
          ))}
        </div>
        <div className="v2nav__acoes">
          <button className="v2tema" onClick={trocarTema}
            aria-label={claro ? "Ativar tema escuro" : "Ativar tema claro"} aria-pressed={claro}>
            {claro ? <Moon size={17} /> : <Sun size={17} />}
          </button>
          <button className="v2btn v2btn--sm" onClick={contato}>Fale conosco</button>
        </div>
      </nav>

      {/* ---------- HERO claro (split editorial) ---------- */}
      <header className="v2h" id="topo">
        <div className="v2h__texto">
          <p className="v2rot v2h__enter">Consultoria de marketing · desde 2019</p>
          <h1 className="v2h__t">
            <span className="v2h__linha"><span>Presença de marca</span></span>
            <span className="v2h__linha"><span>feita com <em>alma</em></span></span>
            <span className="v2h__linha"><span>e resultado.</span></span>
          </h1>
          <p className="v2h__sub v2h__enter">
            Identidade visual, conteúdo e tráfego pago para marcas que precisam
            parar de parecer amadoras, sem perder o que têm de humano.
          </p>
          <div className="v2h__acoes v2h__enter">
            <button className="v2btn" onClick={contato}>Começar um projeto <ArrowRight size={17} /></button>
            <button className="v2ghost" onClick={() => ir("#portfolio")}>Ver o portfólio</button>
          </div>
        </div>

        <div className="v2h__mid">
          <figure className="v2h__foto v2h__foto--a">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/estudio.png" alt="" aria-hidden />
          </figure>
          <figure className="v2h__foto v2h__foto--b">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/filme.png" alt="" aria-hidden />
          </figure>
          <div className="v2h__selo v2h__enter"><span aria-hidden>✳</span> Referência em<br />Identidade Visual</div>
        </div>
      </header>

      {/* ---------- SOBRE ---------- */}
      <section className="v2sec v2sobre" id="sobre">
        <p className="v2rot v2-reveal">Quem faz</p>
        <h2 className="v2big v2-reveal">
          A gente cuida da sua marca <em>como se fosse nossa.</em> Resultado
          sem afeto não sustenta.
        </h2>
        <div className="v2sobre__grade">
          {[["+120", "marcas atendidas"], ["6 anos", "de estrada"], ["3 frentes", "marca, conteúdo e mídia"]].map(([k, v]) => (
            <div className="v2stat v2-reveal" key={k}><strong>{k}</strong><span>{v}</span></div>
          ))}
        </div>
      </section>

      {/* ---------- SERVIÇOS ---------- */}
      <section className="v2sec v2serv" id="servicos">
        <div className="v2serv__cabeca">
          <p className="v2rot v2-reveal">O que fazemos</p>
          <h2 className="v2big v2-reveal">Uma marca inteira,<br />cuidada de <em>ponta a ponta.</em></h2>
        </div>
        <div className="v2serv__grade">
          {SERVICOS.map((s) => (
            <article className="v2serv__card v2-reveal" key={s.n}>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
              <ArrowUpRight className="v2serv__seta" size={20} />
            </article>
          ))}
        </div>
      </section>

      {/* ---------- PORTFÓLIO — parede parallax (skiper30) ---------- */}
      <section className="v2port" id="portfolio">
        <div className="v2port__cabeca">
          <p className="v2rot v2-reveal">Repertório</p>
          <h2 className="v2big v2-reveal">Trabalho que já <em>está na rua.</em></h2>
        </div>
        <div className="v2wall">
          {WALL.map((col, ci) => (
            <div className="v2wall__col" key={ci} data-mult={col.mult} style={{ top: col.top }}>
              {col.imgs.map((src, i) => (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img key={src + i} src={src} alt="" aria-hidden loading="lazy" />
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ---------- DEPOIMENTOS ---------- */}
      <section className="v2sec v2dep" id="depoimentos">
        <p className="v2rot v2-reveal">Quem confiou</p>
        <h2 className="v2big v2-reveal">Feedbacks de quem<br />já passou por aqui.</h2>
        <div className="v2dep__grade">
          {FALAS.map((f) => (
            <figure className="v2fala v2-reveal" key={f.a}>
              <span className="v2fala__aspas" aria-hidden>“</span>
              <blockquote>{f.q}</blockquote>
              <figcaption><strong>{f.a}</strong><span>{f.c}</span></figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ---------- CONTATO / RODAPÉ ---------- */}
      <footer className="v2ft" id="contato">
       <div className="v2ft__fix">
        <div className="v2ft__sticky">
         <div className="v2ft__panel">
        <span className="v2ft__aura" aria-hidden />
        <div className="v2ft__topo">
          <div className="v2ft__cta v2ft__anim">
            <p className="v2rot">Próximo passo</p>
            <h2 className="v2ft__t">Vamos deixar sua marca <em>do tamanho do seu trabalho?</em></h2>
            <button className="v2btn v2ft__botao" onClick={contato}>Falar com a Íntegra <ArrowUpRight size={18} /></button>
          </div>
          <div className="v2ft__cols v2ft__anim">
            <div className="v2ft__col">
              <span className="v2ft__rot">Contato</span>
              <Link001 href={`mailto:${EMAIL}`} className="v2ft__link">{EMAIL}</Link001>
              <Link001 href={INSTAGRAM} className="v2ft__link">Instagram</Link001>
            </div>
            <div className="v2ft__col">
              <span className="v2ft__rot">Navegar</span>
              <button className="v2ft__link" onClick={() => ir("#servicos")}>Serviços</button>
              <button className="v2ft__link" onClick={() => ir("#portfolio")}>Portfólio</button>
              <button className="v2ft__link" onClick={() => ir("#depoimentos")}>Depoimentos</button>
            </div>
          </div>
        </div>

        <div className="v2ft__base v2ft__anim">
          <span>© {new Date().getFullYear()} Íntegra Consultoria de Marketing</span>
          <span>Identidade · Conteúdo · Tráfego</span>
        </div>
         </div>
        </div>
       </div>
      </footer>
    </div>
  );
}
