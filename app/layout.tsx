import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

export const metadata = {
  title: "ParseVerse",
  description: "Multi skill learning platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
