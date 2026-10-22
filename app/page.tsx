import type { Metadata } from 'next';
import { LOJA } from '@/data/config';
import { supabase, Produto } from '@/data/supabase';
import Logo from './Logo';
import Vitrine from './_c/Vitrine';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
const brl = (v: number) => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const zap = (msg: string) => `https://wa.me/${LOJA.whatsapp}?text=${encodeURIComponent(msg)}`;

export async function generateMetadata({ searchParams }: { searchParams: { p?: string } }): Promise<Metadata> {
  if (!searchParams?.p) return {};
  const { data } = await supabase.from('produtos').select('*').eq('id', searchParams.p).maybeSingle();
  if (!data) return {};
  const p = data as Produto;
  const title = `${p.nome} por ${brl(p.preco)} | ${LOJA.nome}`;
  const description = [...(p.especificacoes || []).slice(0, 3), 'Fale com o Pedro no WhatsApp'].join(' • ');
  const images = p.foto ? [{ url: p.foto, alt: p.nome }] : undefined;
  return { title, description, openGraph: { title, description, ...(images ? { images } : {}) },
    twitter: { card: 'summary_large_image', title, description, ...(images ? { images: [p.foto!] } : {}) } };
}

export default async function Home() {
  const [{ data: prods }, { data: st }] = await Promise.all([
    supabase.from('produtos').select('*').order('ordem'),
    supabase.from('settings').select('pagamento_padrao').eq('id', 1).maybeSingle(),
  ]);
  const padrao = st?.pagamento_padrao || '';
  const produtos = (prods || []) as Produto[];
  const disp = produtos.filter((p) => p.status !== 'esgotado').length;
  const pronta = produtos.filter((p) => p.status === 'pronta_entrega').length;
  return (
    <main>
      <nav className="nav">
        <a href="#topo" className="nav-logo"><Logo size={36} nome={false} /><b>PD<span>CEL</span> Import</b></a>
        <a className="nav-cta" href={zap(`Olá, ${LOJA.vendedor}! Vim pela página da ${LOJA.nome}.`)} target="_blank" rel="noopener">WhatsApp</a>
      </nav>
      <header className="hero" id="topo">
        <div className="hero-glow" aria-hidden />
        <div className="hero-in">
          <Logo size={88} />
          <span className="kicker">🔥 Importados com garantia e preço justo</span>
          <h1>Seu próximo celular <em>com preço de importado</em></h1>
          <p>{LOJA.slogan}. Escolha o produto, clique e fale direto com o {LOJA.vendedor} no WhatsApp.</p>
          <div className="hero-ctas">
            <a className="btn-zap big" href={zap(`Olá, ${LOJA.vendedor}! Vi a página da ${LOJA.nome} e quero uma ajuda pra escolher.`)} target="_blank" rel="noopener">💬 Falar com o {LOJA.vendedor}</a>
            <a className="btn-ghost big" href="#produtos">Ver produtos ↓</a>
          </div>
          <div className="stats">
            <div><b>{disp}</b><span>disponíveis</span></div>
            {pronta > 0 && <div><b>{pronta}</b><span>pronta entrega 24h</span></div>}
            <div><b>Pix</b><span>ou cartão</span></div>
          </div>
        </div>
      </header>
      <section className="trust" aria-label="Vantagens">
        {[['🛡️', 'Garantia', 'Produtos conferidos'], ['⚡', 'Pronta entrega', 'Em até 24h'], ['💳', 'Parcelamento', 'Pix ou cartão'], ['🚚', 'Envio', 'Combine pelo WhatsApp']].map(([i, t, s]) => (
          <div key={t}><span className="ic">{i}</span><div><b>{t}</b><small>{s}</small></div></div>
        ))}
      </section>
      <Vitrine produtos={produtos} padrao={padrao} whatsapp={LOJA.whatsapp} vendedor={LOJA.vendedor} nome={LOJA.nome} />
      <section className="como">
        <h2>Como comprar</h2>
        <ol>
          <li><b>1</b><span>Escolha o produto na vitrine</span></li>
          <li><b>2</b><span>Toque em “Quero este” e fale com o {LOJA.vendedor}</span></li>
          <li><b>3</b><span>Combine pagamento e entrega. Pronto!</span></li>
        </ol>
      </section>
      <section className="cta-final">
        <h2>Não achou o que procura?</h2>
        <p>Chama o {LOJA.vendedor}! Ele te ajuda a encontrar o modelo que você quer.</p>
        <a className="btn-zap big" href={zap(`Olá, ${LOJA.vendedor}! Estou procurando um produto que não vi na página.`)} target="_blank" rel="noopener">💬 Fazer encomenda</a>
      </section>
      <footer>
        <Logo size={44} />
        <p>{LOJA.nome} • Atendimento: {LOJA.vendedor} — <a href={`https://wa.me/${LOJA.whatsapp}`} target="_blank" rel="noopener">(62) 99536-0125</a></p>
        <small>© {new Date().getFullYear()} {LOJA.nome}. Preços e disponibilidade sujeitos a alteração.</small>
      </footer>
      <a className="flutuante" aria-label={`Falar com o ${LOJA.vendedor} no WhatsApp`} target="_blank" rel="noopener" href={zap(`Olá, ${LOJA.vendedor}! Vi a página da ${LOJA.nome} e quero mais informações.`)}>
        <svg viewBox="0 0 24 24" width="30" height="30" fill="#fff" aria-hidden><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.9 2.3 1 2.5c.1.2 1.7 2.6 4.1 3.7 1.5.7 2.1.7 2.9.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.5-.3z"/></svg>
      </a>
    </main>
  );
}
