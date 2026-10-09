import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'Comic Videos AI | Your imagination. In motion.',
  description: 'Explore Comic Videos AI: turn ideas and photos into comic-style videos with consistent characters, AI voices, music, and captions. Watch authentic product demos.',
  openGraph: { title: 'Comic Videos AI | Your imagination. In motion.', description: 'From a simple idea to a comic-style video. Explore the features and watch authentic demonstrations.', type: 'website' },
  twitter: { card: 'summary', title: 'Comic Videos AI', description: 'Your imagination. In motion.' },
  icons: { icon: '/favicon.svg' },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
