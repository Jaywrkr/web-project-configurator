export function Progress({ current, total }: { current: number; total: number }) {
  return <div className="progress-wrap" aria-label={`Paso ${current} de ${total}`}>
    <div className="progress-meta"><span>PASO {String(current).padStart(2, "0")} / {String(total).padStart(2, "0")}</span><span>{Math.round(current / total * 100)}%</span></div>
    <div className="progress-track"><div className="progress-fill" style={{ width: `${current / total * 100}%` }} /></div>
  </div>;
}
