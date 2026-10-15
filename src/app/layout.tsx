import type { Metadata } from "next";
import "@/src/styles/globals.css";
import Providers from "./providers";
import { defaultMetadata } from "@/src/lib/seo/metadata";
import { montserrat, cormorant } from "@/src/lib/fonts";

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      
      <body className={`${montserrat.variable} ${cormorant.variable} font-inter`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
