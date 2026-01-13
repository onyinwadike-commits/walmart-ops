import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
  display: 'swap',
});

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Walmart Store Operations Orchestrator | Market 396',
  description: 'AI-powered store operations management for Walmart Market 396 - Las Vegas Metro Area. Real-time metrics, section management, and intelligent reporting.',
  keywords: ['Walmart', 'Store Operations', 'Market 396', 'Las Vegas', 'Retail Management', 'AI'],
  authors: [{ name: 'Walmart Store Operations' }],
  creator: 'Walmart Inc.',
  publisher: 'Walmart Inc.',
  applicationName: 'Store Ops Orchestrator',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Walmart Store Operations Orchestrator',
    title: 'Walmart Store Operations Orchestrator',
    description: 'AI-powered store operations management for Market 396',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0A0E14',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-dark-bg text-dark-text min-h-screen`}
      >
        {/* Ambient Background Effects */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          {/* Gradient Orbs */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-walmart-blue/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-spark-yellow/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-0 w-72 h-72 bg-walmart-blue/5 rounded-full blur-3xl" />

          {/* Grid Pattern Overlay */}
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        {children}
      </body>
    </html>
  );
}
