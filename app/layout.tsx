import './globals.css';
import type { Metadata } from 'next';
import { LOJA } from '@/data/config';
const url = 'https://pdcel-import.vercel.app';
const title = `${LOJA.nome} | Celulares e eletrônicos importados`;
const description = `${LOJA.slogan}. Pronta entrega em até 24h, parcelamento e atendimento direto com o ${LOJA.vendedor} no WhatsApp.`;
export const metadata: Metadata = {
  metadataBase: new URL(url), title, description,
  openGraph: { type: 'website', locale: 'pt_BR', url, siteName: LOJA.nome, title, description },
  twitter: { card: 'summary_large_image', title, description },
};
export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#141414' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
