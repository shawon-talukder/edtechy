import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import ConfettiProvider from "@/components/providers/confetti-provider";
import ToasterProvider from "@/components/providers/toaster-provider";
import { ClerkProvider } from "@clerk/nextjs";

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";

import { ourFileRouter } from "@/app/api/uploadthing/core";
import { extractRouterConfig } from "uploadthing/server";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "edtechy",
  description: "edtech platform made by using nextjs, clerk, prisma, and mysql",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ToasterProvider />
          <ConfettiProvider />
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
