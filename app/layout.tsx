import "./globals.css";

export const metadata = {
  title: "ParseVerse",
  description: "Multi skill learning platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
