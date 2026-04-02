interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}

export function SectionTitle({ eyebrow, title, subtitle }: SectionTitleProps) {
  return (
    <div className="space-y-3">
      {eyebrow ? <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#0b6e4f]">{eyebrow}</p> : null}
      <h2 className="text-3xl font-semibold text-[#083b2d] md:text-5xl">{title}</h2>
      {subtitle ? <p className="max-w-2xl text-base text-[#2d5246] md:text-lg">{subtitle}</p> : null}
    </div>
  );
}
