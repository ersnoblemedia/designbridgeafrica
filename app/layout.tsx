import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '../components/AuthProvider';
import './globals.css'; 

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'DesignBridge Africa',
  description: 'Vetted creative marketplace and premium design coordination ecosystem for African talent',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'DesignBridge',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="font-sans" suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
