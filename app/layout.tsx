// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './../styles/globals.css';
 
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DaisyUI Library - Modern UI Components',
  description: 'A clean, scalable, and developer-friendly UI library built with Next.js and DaisyUI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
           <main className="flex-1">
            {children}
          </main>
         </div>
      </body>
    </html>
  );
}