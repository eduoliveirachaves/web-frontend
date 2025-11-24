import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import {CartProvider} from '@/app/context/CartContext';
import {AuthProvider} from '@/app/context/AuthContext';
import {WishlistProvider} from "@/app/context/WishlistContext";
import { ToastProvider } from '@/app/context/ToastContext';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'E-commerce Next.js',
	description: 'Projeto de E-commerce integrado com NestJS',
};

export default function RootLayout({
	                                   children,
                                   }: Readonly<{
	children: React.ReactNode;
}>) {
	return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ToastProvider>
          <AuthProvider>
            <WishlistProvider>
              <CartProvider>{children}</CartProvider>
            </WishlistProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
