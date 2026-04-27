import { SiteConfig } from "./types";
import siteConfig from "@/site-config.json";

export const config: SiteConfig = siteConfig as SiteConfig;

export function getPrimaryColor(): string {
  return config.primaryColor || "#0A84FF";
}

export function getCssVariables(): Record<string, string> {
  const primary = getPrimaryColor();
  return {
    "--primary-color": primary,
    "--primary-dark": adjustBrightness(primary, -20),
    "--primary-light": adjustBrightness(primary, 20),
    "--font-sans": "Inter, system-ui, sans-serif",
  };
}

function adjustBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;
  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
}
