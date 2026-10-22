export default function Logo({ size = 48, nome = true }: { size?: number; nome?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <svg width={size} height={size} viewBox="0 0 64 64" aria-label="PD CEL">
        <rect x="2" y="2" width="60" height="60" rx="14" fill="#141414" stroke="#f97316" strokeWidth="3" />
        <text x="32" y="38" textAnchor="middle" fontFamily="Arial,Helvetica,sans-serif" fontWeight="800" fontSize="24" fill="#fff">PD</text>
        <rect x="22" y="45" width="20" height="3" rx="1.5" fill="#f97316" />
      </svg>
      {nome && <span style={{ fontWeight: 800, letterSpacing: 3, fontSize: size * 0.3 }}>PD CEL</span>}
    </div>
  );
}
