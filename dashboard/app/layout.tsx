import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Site Generator Dashboard",
  description: "Generate tradie websites with one click",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
