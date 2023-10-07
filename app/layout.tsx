import type { Metadata } from "next";
import { Inter } from "next/font/google";

import ToasterProvider from "@/components/providers/toaster-provider";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

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
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
