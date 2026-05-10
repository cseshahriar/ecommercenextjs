import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata = {
  title: "My E-commerce Store",
  description: "Buy products at best prices from our e-commerce store.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col font-sans bg-gray-50 text-gray-900">
          <Navbar />

          <main className="flex-grow container max-auto px-4 py-6">
            {children}
          </main>
      </body>
    </html>
  );
}
