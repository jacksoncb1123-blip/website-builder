import {Link} from 'react-router';
import {Logo} from '~/components/Header';

const COLUMNS = [
  {
    heading: 'Shop',
    links: [
      {label: 'Shop All', to: '/collections/all'},
      {label: 'Collections', to: '/collections'},
      {label: 'Search', to: '/search'},
    ],
  },
  {
    heading: 'Company',
    links: [
      {label: 'Our Story', to: '/about'},
      {label: 'Mission', to: '/about#mission'},
      {label: 'Contact', to: '/about#contact'},
    ],
  },
  {
    heading: 'Support',
    links: [
      {label: 'Shipping', to: '/about#shipping'},
      {label: 'Returns', to: '/about#returns'},
      {label: 'FAQ', to: '/about#faq'},
    ],
  },
];

const SOCIALS = [
  {label: 'Instagram', href: 'https://instagram.com'},
  {label: 'TikTok', href: 'https://tiktok.com'},
  {label: 'YouTube', href: 'https://youtube.com'},
];

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-ash/60 bg-carbon">
      <div className="container-x grid gap-12 py-16 lg:grid-cols-[1.4fr_2fr]">
        <div>
          <Logo className="text-2xl" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-fog">
            High-performance supplements engineered for people who refuse to
            settle. Clinical doses. Clean labels. No filler — ever.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-steel/70 px-4 py-2 text-xs font-medium text-mist transition-colors hover:border-volt hover:text-volt"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-ultrawide text-fog">
                {col.heading}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      prefetch="intent"
                      className="text-sm text-mist transition-colors hover:text-volt"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-ash/60">
        <div className="container-x flex flex-col items-center justify-between gap-4 py-6 text-xs text-fog sm:flex-row">
          <p>
            © {new Date().getFullYear()} One Up Supplements. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link to="/policies/privacy-policy" className="hover:text-volt">
              Privacy
            </Link>
            <Link to="/policies/terms-of-service" className="hover:text-volt">
              Terms
            </Link>
            <p className="text-steel">
              These statements have not been evaluated by the FDA.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
