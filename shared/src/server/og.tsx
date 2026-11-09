import fs from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import type { SiteConfig } from "../types";

export const ogSize = { width: 1200, height: 630 };

async function font(file: string) {
  // шрифти з кирилицею лежать у shared/assets/fonts (satori не підтримує woff2)
  return fs.readFile(path.join(process.cwd(), "..", "shared", "assets", "fonts", file));
}

/** Генерує OG-картинку (прев'ю для Telegram/Viber/Facebook) під час білду */
export async function renderOgImage(c: SiteConfig, colors: { brand: string; onBrand: string }) {
  const [displayLat, displayCyr, bodyLat, bodyCyr] = await Promise.all([
    font("russo-one-latin-400-normal.woff"),
    font("russo-one-cyrillic-400-normal.woff"),
    font("manrope-latin-600-normal.woff"),
    font("manrope-cyrillic-600-normal.woff"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #0b0c0e 0%, #1c1e23 60%, #0b0c0e 100%)",
          color: "#fff",
          fontFamily: "Manrope, Manrope Cyr",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -300,
            top: -120,
            width: 620,
            height: 900,
            background: colors.brand,
            transform: "rotate(18deg)",
            opacity: 0.95,
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ fontFamily: "Russo One, Russo One Cyr", fontSize: 64, letterSpacing: -1 }}>{c.brand.name}</div>
          <div style={{ width: 2, height: 44, background: "rgba(255,255,255,.3)" }} />
          <div style={{ fontSize: 28, opacity: 0.8 }}>{c.company.name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 760 }}>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              background: colors.brand,
              color: colors.onBrand,
              fontFamily: "Russo One, Russo One Cyr",
              fontSize: 40,
              padding: "6px 18px",
              textTransform: "uppercase",
            }}
          >
            {c.seo.ogSubtitle}
          </div>
          <div style={{ fontFamily: "Russo One, Russo One Cyr", fontSize: 76, lineHeight: 1.05, marginTop: 18, textTransform: "uppercase" }}>
            {c.seo.ogTitle}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 30, gap: 28, opacity: 0.9 }}>
          <span>{c.company.phone}</span>
          <span style={{ opacity: 0.5 }}>•</span>
          <span>Доставка по всій Україні</span>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Russo One", data: displayLat, weight: 400, style: "normal" },
        { name: "Russo One Cyr", data: displayCyr, weight: 400, style: "normal" },
        { name: "Manrope", data: bodyLat, weight: 600, style: "normal" },
        { name: "Manrope Cyr", data: bodyCyr, weight: 600, style: "normal" },
      ],
    },
  );
}
