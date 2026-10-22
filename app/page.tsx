import { LOJA } from '@/data/config';
import { produtos } from '@/data/produtos';

const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const zap = (msg: string) => `https://wa.me/${LOJA.whatsapp}?text=${encodeURIComponent(msg)}`;

export default function Home() {
  return (
    <main>
      <header className="topo">
        <h1>{LOJA.nome}</h1>
        <p>{LOJA.slogan}</p>
      </header>
      <section className="grade">
        {produtos.map((p) => {
          const ok = p.disponivel !== false;
          return (
            <article key={p.id} className="card">
              <img src={p.foto} alt={p.nome} loading="lazy" />
              <div className="info">
                <h2>{p.nome}</h2>
                <div className="preco">{brl(p.preco)}</div>
                <ul>{p.especificacoes.map((e) => <li key={e}>{e}</li>)}</ul>
                <p className="pag">💳 {p.pagamento}</p>
                {ok ? (
                  <a className="btn" target="_blank" rel="noopener"
                    href={zap(`Olá, Pedro! Tenho interesse no produto: ${p.nome} (${brl(p.preco)}). Ainda está disponível?`)}>
                    Quero este! Falar com o Pedro
                  </a>
                ) : <span className="btn off">Esgotado</span>}
              </div>
            </article>
          );
        })}
      </section>
      <a className="flutuante" target="_blank" rel="noopener" href={zap(`Olá, Pedro! Vi a página da ${LOJA.nome} e quero mais informações.`)}>💬</a>
      <footer>© {LOJA.nome}</footer>
    </main>
  );
}
