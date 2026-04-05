
export const SectionHeader = ({ title, subtitle, number }: { title: string; subtitle?: string; number: string }) => (
  <div className="mb-12 border-l-2 border-zinc-800 pl-6">
    <div className="flex items-center gap-4 mb-2">
      <span className="font-mono text-xs text-zinc-500 tracking-widest">{number}</span>
      <div className="h-[1px] w-12 bg-zinc-800"></div>
      <span className="font-mono text-xs text-blue-500 uppercase tracking-widest">{subtitle}</span>
    </div>
    <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-gradient">{title}</h2>
  </div>
);