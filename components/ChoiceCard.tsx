type Props = { label: string; selected: boolean; onClick: () => void; multiple?: boolean };

export function ChoiceCard({ label, selected, onClick, multiple = false }: Props) {
  return <button type="button" aria-pressed={selected} onClick={onClick} className={`choice ${selected ? "choice--selected" : ""}`}>
    <span>{label}</span><span className={`choice__mark ${multiple ? "choice__mark--square" : ""}`} aria-hidden="true">{selected ? "✓" : ""}</span>
  </button>;
}
