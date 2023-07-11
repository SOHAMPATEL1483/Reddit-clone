import Navbar from "@/components/Navbar";
import "./globals.css";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import Providers from "@/components/Providers";

const poppins = Poppins({ weight: "400", subsets: ["latin"] });

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
      <body
        className={cn(poppins.className, "bg-white text-zinc-900 antialiased")}
      >
        <Providers>
          <Navbar />
          <div className="pt-14">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
