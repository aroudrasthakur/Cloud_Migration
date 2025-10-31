import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "MavPrep",
  description: "MavPrep: Prep. Practice. Get In.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">{children}</div>
      </body>
    </html>
  );
}
