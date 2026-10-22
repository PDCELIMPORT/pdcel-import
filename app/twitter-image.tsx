import { ImageResponse } from 'next/og';
export const runtime = 'edge';
export const alt = 'PDcel Import - Celulares e eletrônicos importados';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function OG() {
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', gap: 60, padding: 80, background: 'radial-gradient(circle at 80% 20%, #4a2208 0%, #141414 60%)', color: '#fff', fontFamily: 'sans-serif' }}>
      <div style={{ width: 300, height: 300, borderRadius: 64, background: '#141414', border: '12px solid #f97316', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 130, fontWeight: 900, display: 'flex' }}>PD</div>
        <div style={{ width: 100, height: 14, borderRadius: 7, background: '#f97316', display: 'flex' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, flex: 1 }}>
        <div style={{ fontSize: 84, fontWeight: 900, display: 'flex' }}>PDcel <span style={{ color: '#f97316', marginLeft: 20 }}>Import</span></div>
        <div style={{ fontSize: 40, opacity: 0.85, display: 'flex' }}>Celulares e eletrônicos importados</div>
        <div style={{ fontSize: 32, color: '#f97316', display: 'flex' }}>⚡ Pronta entrega 24h • 💳 Parcelamento</div>
        <div style={{ marginTop: 10, fontSize: 30, background: '#25d366', padding: '12px 26px', borderRadius: 40, display: 'flex', alignSelf: 'flex-start' }}>Fale com o Pedro no WhatsApp</div>
      </div>
    </div>, size);
}
