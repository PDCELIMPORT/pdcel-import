'use client';
import { useEffect, useMemo, useState } from 'react';
import type { Produto, Status } from '@/data/supabase';
import { STATUS_LABEL } from '@/data/supabase';
const brl = (v: number) => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
type P = { produtos: Produto[]; padrao: string; whatsapp: string; vendedor: string; nome: string };
const FILTROS: [string, string][] = [['todos', 'Todos'], ['disponivel', 'Disponíveis'], ['pronta_entrega', '⚡ Pronta entrega'], ['esgotado', 'Esgotados']];

export default function Vitrine({ produtos, padrao, whatsapp, vendedor, nome }: P) {
  const [q, setQ] = useState(''); const [f, setF] = useState('todos');
  const [aberto, setAberto] = useState<Produto | null>(null); const [msg, setMsg] = useState('');
  const zap = (t: string) => `https://wa.me/${whatsapp}?text=${encodeURIComponent(t)}`;
  const pedir = (p: Produto) => zap(`Olá, ${vendedor}! Tenho interesse no produto: ${p.nome} (${brl(p.preco)}). Ainda está disponível?`);

  useEffect(() => {
    const id = new URLSearchParams(location.search).get('p');
    if (id) { const p = produtos.find((x) => x.id === id); if (p) setAberto(p); }
  }, [produtos]);
  useEffect(() => {
    const u = new URL(location.href);
    if (aberto) u.searchParams.set('p', aberto.id); else u.searchParams.delete('p');
    history.replaceState(null, '', u);
    document.body.style.overflow = aberto ? 'hidden' : '';
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setAberto(null);
    addEventListener('keydown', esc); return () => removeEventListener('keydown', esc);
  }, [aberto]);

  const lista = useMemo(() => {
    const t = q.trim().toLowerCase();
    return produtos.filter((p) => (f === 'todos' || p.status === f) &&
      (!t || (p.nome + ' ' + (p.especificacoes || []).join(' ')).toLowerCase().includes(t)));
  }, [produtos, q, f]);

  async function compartilhar(p: Produto) {
    const url = `${location.origin}/?p=${p.id}`;
    const data = { title: `${p.nome} - ${nome}`, text: `${p.nome} por ${brl(p.preco)} na ${nome}`, url };
    try {
      if (navigator.share) await navigator.share(data);
      else { await navigator.clipboard.writeText(url); setMsg('Link copiado!'); setTimeout(() => setMsg(''), 2000); }
    } catch {}
  }

  const cont = (s: string) => s === 'todos' ? produtos.length : produtos.filter((p) => p.status === s).length;
  return (
    <section className="vitrine" id="produtos">
      <div className="vt-head">
        <h2>Vitrine <span>{produtos.length} produtos</span></h2>
        <input className="busca" type="search" placeholder="🔎 Buscar: iPhone, 256GB, Xiaomi…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar produtos" />
        <div className="chips" role="tablist">
          {FILTROS.filter(([k]) => k === 'todos' || cont(k) > 0).map(([k, l]) => (
            <button key={k} role="tab" aria-selected={f === k} className={f === k ? 'on' : ''} onClick={() => setF(k)}>{l} <small>{cont(k)}</small></button>
          ))}
        </div>
      </div>
      <div className="grade">
        {lista.length === 0 && <p className="vazio">Nenhum produto encontrado. <a href={zap(`Olá, ${vendedor}! Vocês têm: ${q}?`)} target="_blank" rel="noopener">Pergunte ao {vendedor}</a></p>}
        {lista.map((p, i) => {
          const ok = p.status !== 'esgotado';
          const pag = p.pagamento?.trim() || padrao;
          return (
            <article key={p.id} className={`card t-${p.tamanho} ${ok ? '' : 'out'}`} style={{ animationDelay: `${Math.min(i, 10) * 60}ms` }}>
              <button className="foto" onClick={() => setAberto(p)} aria-label={`Ver detalhes de ${p.nome}`}>
                {p.foto ? <img src={p.foto} alt={p.nome} loading={i < 2 ? 'eager' : 'lazy'} decoding="async" /> : <div className="semfoto">📦</div>}
                <span className={`badge s-${p.status}`}>{STATUS_LABEL[p.status as Status]}</span>
                {!ok && <span className="carimbo">ESGOTADO</span>}
              </button>
              <div className="info">
                <h3>{p.nome}</h3>
                <div className="preco">{brl(p.preco)}</div>
                {p.especificacoes?.length > 0 && <ul>{p.especificacoes.slice(0, p.tamanho === 'pequeno' ? 3 : 6).map((e) => <li key={e}>{e}</li>)}</ul>}
                {pag && <p className="pag">💳 {pag}</p>}
                {p.status === 'pronta_entrega' && <p className="urg">⚡ Chega em até 24h — estoque limitado</p>}
                <div className="acoes">
                  {ok ? <a className="btn-zap" target="_blank" rel="noopener" href={pedir(p)}>Quero este!</a>
                    : <a className="btn-off" target="_blank" rel="noopener" href={zap(`Olá, ${vendedor}! Me avisa quando o ${p.nome} voltar?`)}>Avise-me quando chegar</a>}
                  <button className="btn-ic" onClick={() => compartilhar(p)} aria-label="Compartilhar">↗</button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      {msg && <div className="toast" role="status">{msg}</div>}
      {aberto && (
        <div className="modal" role="dialog" aria-modal="true" aria-label={aberto.nome} onClick={() => setAberto(null)}>
          <div className="modal-in" onClick={(e) => e.stopPropagation()}>
            <button className="fechar" onClick={() => setAberto(null)} aria-label="Fechar">✕</button>
            <div className="m-foto">{aberto.foto ? <img src={aberto.foto} alt={aberto.nome} /> : <div className="semfoto">📦</div>}
              <span className={`badge s-${aberto.status}`}>{STATUS_LABEL[aberto.status as Status]}</span></div>
            <div className="m-info">
              <h3>{aberto.nome}</h3>
              <div className="preco">{brl(aberto.preco)}</div>
              {aberto.especificacoes?.length > 0 && <ul>{aberto.especificacoes.map((e) => <li key={e}>{e}</li>)}</ul>}
              {(aberto.pagamento?.trim() || padrao) && <p className="pag">💳 {aberto.pagamento?.trim() || padrao}</p>}
              <div className="acoes">
                {aberto.status !== 'esgotado' ? <a className="btn-zap" target="_blank" rel="noopener" href={pedir(aberto)}>💬 Quero este! Falar com o {vendedor}</a>
                  : <a className="btn-off" target="_blank" rel="noopener" href={zap(`Olá, ${vendedor}! Me avisa quando o ${aberto.nome} voltar?`)}>Avise-me quando chegar</a>}
                <button className="btn-ic" onClick={() => compartilhar(aberto)} aria-label="Compartilhar">↗</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
