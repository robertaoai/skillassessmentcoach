import './globals.css';
import type { Metadata } from 'next';
import { Orbitron, Exo } from 'next/font/google';

const orbitron = Orbitron({ 
  subsets: ['latin'],
  variable: '--font-orbitron',
});

const exo = Exo({ 
  subsets: ['latin'],
  variable: '--font-exo',
});

export const metadata: Metadata = {
  title: 'AI Skills Coach - Neural Assessment',
  description: 'Personalized AI readiness evaluation through 9 quantum questions',
  keywords: 'no-code, app builder, conversation-driven development, AI assessment, skills evaluation, ChatAndBuild',
  openGraph: {
    title: 'AI Skills Coach - Built with ChatAndBuild',
    description: 'Personalized AI readiness evaluation through 9 quantum questions',
    images: ['https://cdn.chatandbuild.com/images/preview.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Skills Coach - Built with ChatAndBuild',
    description: 'Personalized AI readiness evaluation through 9 quantum questions',
    images: ['https://cdn.chatandbuild.com/images/preview.png'],
    site: '@chatandbuild',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${orbitron.variable} ${exo.variable}`}>
      <body className={exo.className}>{children}</body>
    </html>
  );
}
