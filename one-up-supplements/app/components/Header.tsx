import {Suspense, useEffect, useState} from 'react';
import {Await, Link, NavLink, useAsyncValue} from 'react-router';
import {motion} from 'framer-motion';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';

interface HeaderProps {
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
}

export const NAV_LINKS = [
  {title: 'Shop All', to: '/collections/all'},
  {title: 'Collections', to: '/collections'},
  {title: 'About', to: '/about'},
];

export function Logo({className = ''}: {className?: string}) {
  return (
    <Link
      to="/"
      prefetch="intent"
      aria-label="One Up Supplements home"
      className={`group inline-flex items-baseline gap-1.5 font-display text-xl font-extrabold tracking-tightest ${className}`}
    >
      <span className="text-bone transition-colors group-hover:text-volt">
        ONE
      </span>
      <span className="text-volt">UP</span>
    </Link>
  );
}

export function Header({isLoggedIn, cart}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const {open} = useAside();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{y: -80}}
      animate={{y: 0}}
      transition={{duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1}}
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled
          ? 'border-b border-ash/60 bg-void/80 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="container-x flex h-[var(--header-h)] items-center justify-between gap-6">
        <Logo />

        <nav className="hidden items-center gap-9 md:flex" aria-label="Primary">
          {NAV_LINKS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              prefetch="intent"
              className={({isActive}) =>
                `text-sm font-medium tracking-wide transition-colors hover:text-volt ${
                  isActive ? 'text-volt' : 'text-mist'
                }`
              }
            >
              {item.title}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => open('search')}
            aria-label="Search"
            className="hidden h-10 w-10 place-items-center rounded-full border border-steel/70 text-bone transition-colors hover:border-volt hover:text-volt sm:grid"
          >
            <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
              <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M12.5 12.5L16 16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <NavLink
            to="/account"
            prefetch="intent"
            aria-label="Account"
            className="hidden h-10 w-10 place-items-center rounded-full border border-steel/70 text-bone transition-colors hover:border-volt hover:text-volt sm:grid"
          >
            <Suspense
              fallback={<AccountIcon />}
            >
              <Await resolve={isLoggedIn} errorElement={<AccountIcon />}>
                {() => <AccountIcon />}
              </Await>
            </Suspense>
          </NavLink>

          <CartToggle cart={cart} />

          <button
            className="grid h-10 w-10 place-items-center rounded-full border border-steel/70 text-bone transition-colors hover:border-volt hover:text-volt md:hidden"
            aria-label="Open menu"
            onClick={() => open('mobile')}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M2 5h14M2 9h14M2 13h14"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </motion.header>
  );
}

function AccountIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M3.5 15.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CartToggle({cart}: {cart: HeaderProps['cart']}) {
  return (
    <Suspense fallback={<CartButton count={0} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartButton count={cart?.totalQuantity ?? 0} />;
}

function CartButton({count}: {count: number}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <button
      onClick={() => {
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
      aria-label="Open cart"
      className="group relative inline-flex items-center gap-2 rounded-full border border-steel/70 px-4 py-2 text-sm font-medium text-bone transition-colors hover:border-volt hover:text-volt"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          d="M2 2h2l1.5 9.5a1 1 0 001 .8h6.8a1 1 0 001-.8L16 5H5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="7" cy="15.5" r="1.1" fill="currentColor" />
        <circle cx="14" cy="15.5" r="1.1" fill="currentColor" />
      </svg>
      <span className="hidden sm:inline">Cart</span>
      <span
        className={`grid h-5 min-w-5 place-items-center rounded-full px-1 text-[11px] font-bold transition-colors ${
          count > 0
            ? 'bg-volt text-void'
            : 'bg-graphite text-fog group-hover:text-volt'
        }`}
      >
        {count}
      </span>
    </button>
  );
}
