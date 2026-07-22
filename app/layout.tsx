import type { Metadata } from "next";
import { Geist, Space_Grotesk, JetBrains_Mono, Sora, Syne } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const carre = localFont({
  src: "../public/Font/Carre-G6Vq.otf",
  variable: "--font-carre",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AGOUA | Al-Samaa Co. — Immersive VR, AR & Digital Experiences",
  description:
    "AGOUA delivers world-class Virtual Reality, Augmented Reality, and architectural visualization solutions that transform ambitious visions into exceptional digital experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${sora.variable} ${syne.variable} ${carre.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
