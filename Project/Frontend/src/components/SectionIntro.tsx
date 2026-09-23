export default function SectionIntro({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div>
      <div className="inline-flex items-center gap-2 text-[#1f5f88] text-[0.72rem] font-bold tracking-[0.12em] uppercase">
        <span className="w-[22px] h-px bg-current opacity-70" />
        {eyebrow}
      </div>

      <h2>{title}</h2>

      <p>{text}</p>
    </div>
  );
}