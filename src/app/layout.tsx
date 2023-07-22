import Navbar from "@/components/Navbar";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";

export const metadata = {
  title: "Reddit clone",
  description: "reddit clone created with nextjs,tailwind and prisma",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-700 font-poppins text-zinc-900">
        <Providers>
          <Navbar />
          <Toaster />
          <div className="mx-auto max-w-7xl pt-14">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
