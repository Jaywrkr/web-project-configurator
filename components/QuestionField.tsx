import { ChoiceCard } from "./ChoiceCard";
import { MultiChoice } from "./MultiChoice";

export function Field({ label, value, onChange, type = "text", optional = false, placeholder, maxLength }: { label: string; value: string; onChange: (value: string) => void; type?: string; optional?: boolean; placeholder?: string; maxLength?: number }) {
  return <label className="field"><span className="field__label">{label}{optional && <small> Opcional</small>}</span><input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} maxLength={maxLength} /></label>;
}
export function LongField({ label, value, onChange, placeholder, maxLength = 3000 }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; maxLength?: number }) {
  return <label className="field"><span className="field__label">{label}</span><textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} maxLength={maxLength} rows={5} /></label>;
}
export function SingleQuestion({ title, options, value, onChange }: { title: string; options: readonly string[]; value: string; onChange: (value: string) => void }) {
  return <section className="question"><h2>{title}</h2><div className="choice-grid">{options.map((option) => <ChoiceCard key={option} label={option} selected={value === option} onClick={() => onChange(option)} />)}</div></section>;
}
export function MultiQuestion({ title, options, value, onChange, exclusive }: { title: string; options: readonly string[]; value: string[]; onChange: (value: string[]) => void; exclusive?: string }) {
  return <section className="question"><h2>{title}</h2><p className="question__hint">Puedes elegir varias opciones.</p><MultiChoice options={options} value={value} onChange={onChange} exclusive={exclusive} /></section>;
}
