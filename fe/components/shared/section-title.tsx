interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}

export function SectionTitle({ eyebrow, title, subtitle }: SectionTitleProps) {
  return (
    <div className="space-y-3">
      {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#0b6e4f]">{eyebrow}</p> : null}
      <h2 className="text-2xl font-semibold text-[#083b2d] md:text-4xl">{title}</h2>
      {subtitle ? <p className="max-w-2xl text-sm text-[#2d5246] md:text-base">{subtitle}</p> : null}
    </div>
  );
}
