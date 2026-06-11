import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/lib/auth";
import { I18nProvider } from "@/lib/i18n";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-ar" });

export const metadata: Metadata = {
  title: "StudentCareer AI Platform",
  description:
    "AI-powered career development & employability assessment platform for students and graduates.",
  authors: [{ name: "Abdulaziz AlAmawi" }],
  keywords: [
    "career",
    "resume",
    "AI",
    "interview",
    "students",
    "employability",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" translate="no" suppressHydrationWarning>
      <head>
        <meta name="google" content="notranslate" />
      </head>
      <body className={`${inter.variable} ${cairo.variable} font-sans notranslate`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider>
            <AuthProvider>{children}</AuthProvider>
            <Toaster richColors position="top-center" />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
