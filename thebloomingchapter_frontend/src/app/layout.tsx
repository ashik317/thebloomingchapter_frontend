import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: { default: "The Blooming Chapter — Books · Coffee · Flowers", template: "%s · The Blooming Chapter" },
  description: "Read books online, buy printed books and PDFs, order coffee and tea, and send fresh flowers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
