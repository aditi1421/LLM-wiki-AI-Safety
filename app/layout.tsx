import type { Metadata } from 'next';
import { Source_Serif_4, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AI Safety Wiki',
  description: 'A research wiki on AI safety, built with the LLM Wiki pattern',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sourceSerif.variable} ${jetbrainsMono.variable}`}>
      <body>
        <nav style={{ borderBottom: '1px solid var(--color-border)', padding: '1rem 1.5rem' }}>
          <div style={{ maxWidth: '72rem', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <a href="/" style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--color-text)', textDecoration: 'none' }}>
              AI Safety Wiki
            </a>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <a href="/graph" className="nav-link">Graph</a>
              <a href="/index-page" className="nav-link">Index</a>
              <a href="/search" className="nav-link">Search</a>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <a
                href="https://github.com/aditi1421/LLM-wiki-AI-Safety"
                target="_blank"
                rel="noopener"
                className="nav-link"
              >
                GitHub
              </a>
            </div>
          </div>
        </nav>
        <main>
          {children}
        </main>
        <footer style={{ borderTop: '1px solid var(--color-border)', padding: '2rem 1.5rem', marginTop: '4rem' }}>
          <div style={{ maxWidth: '72rem', margin: '0 auto', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.04em', color: 'var(--color-text-dim)' }}>
            Built with the{' '}
            <a href="https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f" style={{ color: 'var(--color-text-muted)', textDecoration: 'underline' }}>
              LLM Wiki
            </a>{' '}
            pattern by Karpathy
          </div>
        </footer>
      </body>
    </html>
  );
}
