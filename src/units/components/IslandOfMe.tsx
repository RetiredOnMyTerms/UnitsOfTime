export function IslandOfMe({ mePct, meLine }: { mePct: number | null; meLine: string }) {
  return (
    <div className="scard">
      <span className="stitle">Island of me</span>
      <div className="bigpct">{mePct === null ? '—' : mePct + '%'}</div>
      <p className="mline">{meLine}</p>
      <div className="mebar"><div className="mefill" style={{ width: (mePct ?? 0) + '%' }} /></div>
    </div>
  );
}
