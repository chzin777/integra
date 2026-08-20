import type { Metadata } from "next";
import { Bricolage_Grotesque, Manrope } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({
  variable: "--fonte-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const corpo = Manrope({
  variable: "--fonte-corpo",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Íntegra Consultoria de Marketing",
  description:
    "Identidade visual, conteúdo e tráfego pago para marcas que precisam parar de parecer amadoras.",
  openGraph: {
    title: "Íntegra Consultoria de Marketing",
    description:
      "Identidade visual, conteúdo e tráfego pago para marcas que precisam parar de parecer amadoras.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${corpo.variable}`}>
      <body>{children}</body>
    </html>
  );
}
