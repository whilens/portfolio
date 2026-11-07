import type { Metadata } from "next";
import { JetBrains_Mono, Manrope, Unbounded } from "next/font/google";
import { AmbientField } from "@/components/AmbientField";
import { WebGLFluidOverlay } from "@/components/WebGLFluidOverlay";
import "./globals.css";

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600", "800"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Портфолио — сайты и приложения",
  description:
    "Студия разработки сайтов и приложений. Уникальный дизайн, быстрая работа на любом устройстве и поддержка после запуска.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${unbounded.variable} ${manrope.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="relative min-h-full w-full max-w-full overflow-x-clip bg-ink text-white">
        <AmbientField />
        <WebGLFluidOverlay />
        {children}
      </body>
    </html>
  );
}
