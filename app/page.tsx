import { LOJA } from '@/data/config';
import { supabase, Produto, STATUS_LABEL } from '@/data/supabase';
import Logo from './Logo';
export const revalidate = 30;
const brl = (v: number) => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const zap = (msg: string) => `https://wa.me/${LOJA.whatsapp}?text=${encodeURIComponent(msg)}`;

export default async function Home() {
  const [{ data: prods }, { data: st }] = await Promise.all([
    supabase.from('produtos').select('*').order('ordem'),
    supabase.from('settings').select('pagamento_padrao').eq('id', 1).maybeSingle(),
  ]);
  const padrao = st?.pagamento_padrao || '';
  const produtos = (prods || []) as Produto[];
  return (
    <main>
      <header className="topo">
        <Logo size={64} />
        <h1>{LOJA.nome}</h1>
        <p>{LOJA.slogan}</p>
      </header>
      <section className="grade">
        {produtos.length === 0 && <p className="vazio">Em breve novos produtos!</p>}
        {produtos.map((p) => {
          const ok = p.status !== 'esgotado';
          const pag = p.pagamento?.trim() || padrao;
          return (
            <article key={p.id} className={`card t-${p.tamanho}`}>
              <div className="foto">
                {p.foto ? <img src={p.foto} alt={p.nome} loading="lazy" /> : <div className="semfoto">📦</div>}
                <span className={`badge s-${p.status}`}>{STATUS_LABEL[p.status]}</span>
              </div>
              <div className="info">
                <h2>{p.nome}</h2>
                <div className="preco">{brl(p.preco)}</div>
                {p.especificacoes?.length > 0 && <ul>{p.especificacoes.map((e) => <li key={e}>{e}</li>)}</ul>}
                {pag && <p className="pag">💳 {pag}</p>}
                {ok ? (
                  <a className="btn" target="_blank" rel="noopener"
                    href={zap(`Olá, ${LOJA.vendedor}! Tenho interesse no produto: ${p.nome} (${brl(p.preco)}). Ainda está disponível?`)}>
                    Quero este! Falar com o {LOJA.vendedor}
                  </a>
                ) : <span className="btn off">Esgotado</span>}
              </div>
            </article>
          );
        })}
      </section>
      <a className="flutuante" target="_blank" rel="noopener" href={zap(`Olá, ${LOJA.vendedor}! Vi a página da ${LOJA.nome} e quero mais informações.`)}>💬</a>
      <footer>© {LOJA.nome}</footer>
    </main>
  );
}
