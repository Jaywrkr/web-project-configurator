import { ChoiceCard } from "./ChoiceCard";

type Props = { options: readonly string[]; value: string[]; onChange: (next: string[]) => void; exclusive?: string };

export function MultiChoice({ options, value, onChange, exclusive }: Props) {
  return <div className="choice-grid">{options.map((option) => <ChoiceCard key={option} label={option} selected={value.includes(option)} multiple onClick={() => {
    if (value.includes(option)) onChange(value.filter((item) => item !== option));
    else if (option === exclusive) onChange([option]);
    else onChange([...value.filter((item) => item !== exclusive), option]);
  }} />)}</div>;
}
