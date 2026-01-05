import "~/styles/globals.css";

import { type Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { ThemeProvider } from "~/components/theme-provider";
import { Navigation } from "~/components/navigation";

export const metadata: Metadata = {
  title: "TableTopicker - Practice Impromptu Speaking",
  description:
    "Improve your impromptu speaking skills with timed practice sessions, AI-generated topics, and progress tracking. Start speaking with confidence today.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`} suppressHydrationWarning>
      <SessionProvider>
        <body className="flex min-h-screen flex-col">
          <TRPCReactProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Navigation />
              <main className="flex-1">{children}</main>
            </ThemeProvider>
          </TRPCReactProvider>
        </body>
      </SessionProvider>
    </html>
  );
}
