'use client';
import { useEffect, useState } from 'react';
import { supabase, Produto, STATUS_LABEL, Status, Tamanho } from '@/data/supabase';
import Logo from '../Logo';

type Form = { id?: string; nome: string; preco: string; foto: string | null; specs: string; pagamento: string; status: Status; tamanho: Tamanho };
const vazio: Form = { nome: '', preco: '', foto: null, specs: '', pagamento: '', status: 'disponivel', tamanho: 'medio' };

export default function Admin() {
  const [sess, setSess] = useState<any>(undefined);
  const [email, setEmail] = useState(''); const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [lista, setLista] = useState<Produto[]>([]);
  const [padrao, setPadrao] = useState('');
  const [f, setF] = useState<Form>(vazio);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [ns1, setNs1] = useState(''); const [ns2, setNs2] = useState(''); const [nsMsg, setNsMsg] = useState<{ ok: boolean; t: string } | null>(null);
  async function trocarSenha(e: React.FormEvent) {
    e.preventDefault(); setNsMsg(null);
    if (ns1.length < 8) return setNsMsg({ ok: false, t: 'A senha precisa ter pelo menos 8 caracteres.' });
    if (ns1 !== ns2) return setNsMsg({ ok: false, t: 'As senhas não conferem.' });
    const { error } = await supabase.auth.updateUser({ password: ns1 });
    if (error) setNsMsg({ ok: false, t: 'Erro ao alterar senha: ' + error.message });
    else { setNsMsg({ ok: true, t: 'Senha alterada com sucesso!' }); setNs1(''); setNs2(''); }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSess(data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSess(s));
    return () => data.subscription.unsubscribe();
  }, []);
  useEffect(() => { if (sess) carregar(); }, [sess]);

  async function carregar() {
    const { data } = await supabase.from('produtos').select('*').order('ordem');
    setLista((data || []) as Produto[]);
    const { data: s } = await supabase.from('settings').select('pagamento_padrao').eq('id', 1).maybeSingle();
    setPadrao(s?.pagamento_padrao || '');
  }
  async function entrar(e: React.FormEvent) {
    e.preventDefault(); setErro('');
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    if (error) setErro('Email ou senha inválidos');
  }
  async function salvar(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setErro('');
    try {
      let foto = f.foto;
      if (arquivo) {
        const path = `${Date.now()}-${arquivo.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const up = await supabase.storage.from('produtos').upload(path, arquivo);
        if (up.error) throw up.error;
        foto = supabase.storage.from('produtos').getPublicUrl(path).data.publicUrl;
      }
      const row: any = { nome: f.nome, preco: Number(f.preco.replace(',', '.')) || 0, foto,
        especificacoes: f.specs.split('\n').map((s) => s.trim()).filter(Boolean),
        pagamento: f.pagamento.trim() || null, status: f.status, tamanho: f.tamanho };
      const r = f.id ? await supabase.from('produtos').update(row).eq('id', f.id)
        : await supabase.from('produtos').insert({ ...row, ordem: (lista.at(-1)?.ordem || 0) + 1 });
      if (r.error) throw r.error;
      setF(vazio); setArquivo(null); await carregar();
    } catch (err: any) { setErro(err.message || 'Erro ao salvar'); }
    setBusy(false);
  }
  function editar(p: Produto) {
    setF({ id: p.id, nome: p.nome, preco: String(p.preco), foto: p.foto, specs: (p.especificacoes || []).join('\n'),
      pagamento: p.pagamento || '', status: p.status, tamanho: p.tamanho });
    setArquivo(null); window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  async function apagar(p: Produto) {
    if (!confirm(`Apagar "${p.nome}"?`)) return;
    await supabase.from('produtos').delete().eq('id', p.id); carregar();
  }
  async function mover(i: number, d: number) {
    const j = i + d; if (j < 0 || j >= lista.length) return;
    const n = [...lista]; [n[i], n[j]] = [n[j], n[i]]; setLista(n);
    await Promise.all(n.map((p, k) => supabase.from('produtos').update({ ordem: k + 1 }).eq('id', p.id)));
  }
  async function rapido(p: Produto, campo: 'status' | 'tamanho', v: string) {
    await supabase.from('produtos').update({ [campo]: v }).eq('id', p.id); carregar();
  }
  async function salvarPadrao() {
    const { error } = await supabase.from('settings').upsert({ id: 1, pagamento_padrao: padrao });
    alert(error ? 'Erro: ' + error.message : 'Pagamento padrão salvo!');
  }

  if (sess === undefined) return <main className="adm"><p>Carregando…</p></main>;
  if (!sess) return (
    <main className="adm" style={{ maxWidth: 380, marginTop: 40 }}>
      <Logo size={72} />
      <form className="box" onSubmit={entrar}>
        <h2>Admin PDcel Import</h2>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} required />
        {erro && <p className="err">{erro}</p>}
        <button>Entrar</button>
      </form>
    </main>
  );

  return (
    <main className="adm">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <Logo size={44} nome={false} /><h2 style={{ flex: 1 }}>Admin PDcel Import</h2>
        <a href="/" target="_blank" style={{ color: '#f97316' }}>Ver loja</a>
        <button className="sec" onClick={() => supabase.auth.signOut()}>Sair</button>
      </div>

      <form className="box" onSubmit={salvar}>
        <h3>{f.id ? 'Editar produto' : 'Novo produto'}</h3>
        <input placeholder="Nome" value={f.nome} onChange={(e) => setF({ ...f, nome: e.target.value })} required />
        <input placeholder="Preço (ex: 2899,90)" inputMode="decimal" value={f.preco} onChange={(e) => setF({ ...f, preco: e.target.value })} required />
        <label>Foto {f.foto && <img src={f.foto} alt="" style={{ width: 60, verticalAlign: 'middle' }} />}
          <input type="file" accept="image/*" onChange={(e) => setArquivo(e.target.files?.[0] || null)} /></label>
        <textarea rows={4} placeholder="Especificações (uma por linha)" value={f.specs} onChange={(e) => setF({ ...f, specs: e.target.value })} />
        <textarea rows={2} placeholder={`Condições de pagamento (vazio = padrão: ${padrao})`} value={f.pagamento} onChange={(e) => setF({ ...f, pagamento: e.target.value })} />
        <div className="row">
          <select value={f.status} onChange={(e) => setF({ ...f, status: e.target.value as Status })} style={{ flex: 1 }}>
            {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <select value={f.tamanho} onChange={(e) => setF({ ...f, tamanho: e.target.value as Tamanho })} style={{ flex: 1 }}>
            <option value="pequeno">Card pequeno</option><option value="medio">Card médio</option><option value="grande">Card grande</option>
          </select>
        </div>
        {erro && <p className="err">{erro}</p>}
        <div className="row"><button disabled={busy}>{busy ? 'Salvando…' : 'Salvar'}</button>
          {f.id && <button type="button" className="sec" onClick={() => setF(vazio)}>Cancelar</button>}</div>
      </form>

      <div className="box">
        <h3>Pagamento padrão da loja</h3>
        <textarea rows={2} value={padrao} onChange={(e) => setPadrao(e.target.value)} />
        <button type="button" onClick={salvarPadrao}>Salvar padrão</button>
      </div>

      <form className="box" onSubmit={trocarSenha}>
        <h3>Alterar senha</h3>
        <input type="password" placeholder="Nova senha (mín. 8 caracteres)" autoComplete="new-password" value={ns1} onChange={(e) => setNs1(e.target.value)} required />
        <input type="password" placeholder="Confirmar nova senha" autoComplete="new-password" value={ns2} onChange={(e) => setNs2(e.target.value)} required />
        {nsMsg && <p className={nsMsg.ok ? '' : 'err'} style={nsMsg.ok ? { color: '#4ade80' } : undefined}>{nsMsg.t}</p>}
        <button>Alterar senha</button>
      </form>

      <h3>Produtos ({lista.length})</h3>
      {lista.map((p, i) => (
        <div className="item" key={p.id}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <button className="sec" onClick={() => mover(i, -1)}>▲</button>
            <button className="sec" onClick={() => mover(i, 1)}>▼</button>
          </div>
          {p.foto ? <img src={p.foto} alt="" /> : <span>📦</span>}
          <div className="n"><b>{p.nome}</b><br />R$ {Number(p.preco).toFixed(2).replace('.', ',')}
            <div className="row" style={{ marginTop: 6 }}>
              <select value={p.status} onChange={(e) => rapido(p, 'status', e.target.value)} style={{ width: 'auto' }}>
                {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <select value={p.tamanho} onChange={(e) => rapido(p, 'tamanho', e.target.value)} style={{ width: 'auto' }}>
                <option value="pequeno">Pequeno</option><option value="medio">Médio</option><option value="grande">Grande</option>
              </select>
            </div>
          </div>
          <button className="sec" onClick={() => editar(p)}>Editar</button>
          <button className="del" onClick={() => apagar(p)}>Apagar</button>
        </div>
      ))}
    </main>
  );
}
