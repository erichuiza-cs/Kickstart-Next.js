import Link from "next/link";

export default function HealioChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-6">
            <Link
              href="/news"
              className="text-xl font-bold tracking-tight text-teal-700 no-underline hover:text-teal-800"
            >
              Clinical News
            </Link>
            <nav className="hidden gap-4 text-sm font-medium text-slate-600 sm:flex">
              <Link href="/news" className="no-underline hover:text-teal-700">
                News
              </Link>
              <span className="text-slate-400">|</span>
              <span className="text-slate-500">Demo</span>
            </nav>
          </div>
          <Link
            href="/"
            className="text-sm text-teal-600 no-underline hover:underline"
          >
            CMS pages
          </Link>
        </div>
      </header>
      {children}
      <footer className="mt-12 border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-500">
        <p>
          Healio-inspired layout for demo purposes. Not affiliated with Healio.
        </p>
      </footer>
    </div>
  );
}
