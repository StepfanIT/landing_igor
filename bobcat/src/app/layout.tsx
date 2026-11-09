import type { ReactNode } from "react";
import { Montserrat, Oswald, Tektur } from "next/font/google";
import { buildMetadata, buildViewport } from "@landing/ui/server";
import { site } from "@/site.config";
import "./globals.css";

// Шрифти з макета Figma
const tektur = Tektur({ weight: ["400", "600"], subsets: ["latin", "cyrillic"], variable: "--font-tektur", display: "swap" });
const oswald = Oswald({ weight: "700", subsets: ["latin", "cyrillic"], variable: "--font-oswald-var", display: "swap" });
const montserrat = Montserrat({ weight: "400", subsets: ["latin", "cyrillic"], variable: "--font-montserrat", display: "swap" });

export const metadata = buildMetadata(site);
export const viewport = buildViewport("#131313");

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uk" className={`${tektur.variable} ${oswald.variable} ${montserrat.variable}`}>
      <body>{children}</body>
    </html>
  );
}
