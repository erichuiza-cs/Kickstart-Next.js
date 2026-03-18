import HealioChrome from "../components/news/HealioChrome";

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <HealioChrome>{children}</HealioChrome>;
}
