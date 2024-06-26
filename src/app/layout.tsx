import "@/styles/globals.css";

import { Inter } from "next/font/google";

import { Toaster } from "sonner";
import { TRPCReactProvider } from "@/trpc/react";
import NextAuthProvider from "./providers/next-auth-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <NextAuthProvider>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </NextAuthProvider>
        <Toaster richColors />
      </body>
    </html>
  );
};

export default RootLayout;
