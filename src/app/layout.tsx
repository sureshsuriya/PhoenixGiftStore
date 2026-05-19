import type { Metadata } from "next";
import "./globals.css";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Pheonix Gifts | Turn Your Memories into Beautiful Gifts",
  description: "Customized gifts made with love — perfect for every special moment. Personalized posters, banners, pencil art, polaroids and more.",
  keywords: "customized gifts India, personalized gifts online, birthday gift ideas, polaroid prints India, pencil art portrait custom, unique gift shop online",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
