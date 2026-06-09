import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MedAI Platform \u2014 Patient Intake & Clinical Notes Automation",
  description:
    "HIPAA-compliant demo showcasing AI-powered patient intake, clinical note generation, appointment scheduling, and prescription tracking for modern healthcare.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
