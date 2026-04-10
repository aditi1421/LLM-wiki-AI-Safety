import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="en" className="dark">
      <body className="bg-zinc-950 text-zinc-100 min-h-screen antialiased">
        <nav className="border-b border-zinc-800 px-6 py-4">
          <div className="max-w-5xl mx-auto flex items-center gap-6">
            <a href="/" className="font-mono text-lg font-bold tracking-tight">AI Safety Wiki</a>
            <div className="flex gap-4 text-sm text-zinc-400">
              <a href="/graph" className="hover:text-zinc-100 transition-colors">Graph</a>
              <a href="/index-page" className="hover:text-zinc-100 transition-colors">Index</a>
              <a href="/search" className="hover:text-zinc-100 transition-colors">Search</a>
            </div>
            <div className="ml-auto">
              <a href="https://github.com/aditi1421/LLM-wiki-AI-Safety" target="_blank" rel="noopener" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">GitHub</a>
            </div>
          </div>
        </nav>
        <main className="max-w-5xl mx-auto px-6 py-8">
          {children}
        </main>
        <footer className="border-t border-zinc-800 px-6 py-6 mt-16">
          <div className="max-w-5xl mx-auto text-center text-sm text-zinc-600">
            Built with the <a href="https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f" className="underline hover:text-zinc-400">LLM Wiki</a> pattern
          </div>
        </footer>
      </body>
    </html>
  );
}
