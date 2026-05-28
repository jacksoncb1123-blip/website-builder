import {Link} from 'react-router';

export function FilterChip({
  to,
  active,
  children,
}: {
  to: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      prefetch="intent"
      className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
        active
          ? 'border-volt bg-volt text-void'
          : 'border-steel/70 text-mist hover:border-volt hover:text-volt'
      }`}
    >
      {children}
    </Link>
  );
}
