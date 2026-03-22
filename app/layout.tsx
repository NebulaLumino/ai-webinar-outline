import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Webinar Outline Generator",
  description: "Generate complete webinar outlines with timing, polls, and CTAs",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
