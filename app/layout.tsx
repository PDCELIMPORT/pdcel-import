import './globals.css';
import { LOJA } from '@/data/config';
export const metadata = { title: LOJA.nome, description: LOJA.slogan };
export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#141414' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
