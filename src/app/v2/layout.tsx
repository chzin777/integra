import { Fraunces, Manrope } from "next/font/google";

// Serifa macia e quente (Fraunces), com personalidade editorial que casa com o
// dourado. Sans humanista discreto no corpo e nos rótulos.
// Sem `weight` = eixo variável completo: permite animar 'wght' via
// font-variation-settings (usado no hover dos links do nav).
const display = Fraunces({
  variable: "--v2-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const corpo = Manrope({
  variable: "--v2-corpo",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export default function V2Layout({ children }: LayoutProps<"/v2">) {
  return (
    <div className={`${display.variable} ${corpo.variable}`}>{children}</div>
  );
}
