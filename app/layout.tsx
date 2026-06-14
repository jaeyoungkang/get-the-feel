import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "get-the-feel",
  description: "English native-layer sense training for Korean learners.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
