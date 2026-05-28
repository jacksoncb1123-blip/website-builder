const DEFAULT_ITEMS = [
  'Third-Party Tested',
  'Clinically Dosed',
  'No Artificial Fillers',
  'Vegan Friendly',
  'Made in the USA',
  'Banned-Substance Free',
];

export function Marquee({items = DEFAULT_ITEMS}: {items?: string[]}) {
  const loop = [...items, ...items];
  return (
    <div className="border-y border-ash/60 bg-charcoal py-5">
      <div className="mask-fade-r flex overflow-hidden">
        <ul className="flex shrink-0 animate-marquee items-center gap-10 pr-10">
          {loop.map((item, i) => (
            <li
              key={`${item}-${i}`}
              className="flex shrink-0 items-center gap-10 text-sm font-semibold uppercase tracking-ultrawide text-mist"
            >
              {item}
              <span className="h-1.5 w-1.5 rounded-full bg-volt" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
