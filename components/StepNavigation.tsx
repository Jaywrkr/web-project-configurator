type Props = { onBack: () => void; onNext: () => void; isFirst: boolean; isLast: boolean; busy?: boolean };

export function StepNavigation({ onBack, onNext, isFirst, isLast, busy }: Props) {
  return <div className="step-nav">
    <button type="button" onClick={onBack} className="text-button" disabled={isFirst || busy}>← Atrás</button>
    <button type="button" onClick={onNext} className="button button--dark" disabled={busy}>{busy ? "Enviando…" : isLast ? "Enviar solicitud ↗" : "Continuar →"}</button>
  </div>;
}
