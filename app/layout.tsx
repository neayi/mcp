import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "E-phy MCP Server",
  description:
    "MCP server providing access to the French e-phy phytosanitary products catalog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
