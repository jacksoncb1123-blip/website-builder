import {Await, Link, NavLink} from 'react-router';
import {Suspense, useId} from 'react';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {Aside, useAside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Header, NAV_LINKS} from '~/components/Header';
import {CartMain} from '~/components/CartMain';
import {
  SEARCH_ENDPOINT,
  SearchFormPredictive,
} from '~/components/SearchFormPredictive';
import {SearchResultsPredictive} from '~/components/SearchResultsPredictive';

interface PageLayoutProps {
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  children?: React.ReactNode;
}

export function PageLayout({cart, isLoggedIn, children = null}: PageLayoutProps) {
  return (
    <Aside.Provider>
      <CartAside cart={cart} />
      <SearchAside />
      <MobileMenuAside />
      <Header cart={cart} isLoggedIn={isLoggedIn} />
      <main id="main" className="min-h-[60vh] pt-[var(--header-h)]">
        {children}
      </main>
      <Footer />
    </Aside.Provider>
  );
}

function CartAside({cart}: {cart: PageLayoutProps['cart']}) {
  return (
    <Aside type="cart" heading="Your Cart">
      <Suspense fallback={<CartLoading />}>
        <Await resolve={cart}>
          {(resolved) => <CartMain cart={resolved} layout="aside" />}
        </Await>
      </Suspense>
    </Aside>
  );
}

function CartLoading() {
  return (
    <div className="space-y-4 p-6">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex gap-4">
          <div className="h-[110px] w-[88px] animate-pulse rounded-xl bg-graphite" />
          <div className="flex-1 space-y-3 py-2">
            <div className="h-4 w-3/4 animate-pulse rounded bg-graphite" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-graphite" />
            <div className="h-8 w-28 animate-pulse rounded-full bg-graphite" />
          </div>
        </div>
      ))}
    </div>
  );
}

function MobileMenuAside() {
  const {close} = useAside();
  return (
    <Aside type="mobile" heading="Menu" side="left">
      <nav className="flex flex-col px-6 py-4" aria-label="Mobile">
        {NAV_LINKS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            prefetch="intent"
            onClick={close}
            className={({isActive}) =>
              `border-b border-ash/50 py-5 font-display text-2xl tracking-tightest transition-colors hover:text-volt ${
                isActive ? 'text-volt' : 'text-bone'
              }`
            }
          >
            {item.title}
          </NavLink>
        ))}
        <NavLink
          to="/account"
          prefetch="intent"
          onClick={close}
          className="border-b border-ash/50 py-5 font-display text-2xl tracking-tightest text-bone transition-colors hover:text-volt"
        >
          Account
        </NavLink>
      </nav>
    </Aside>
  );
}

function SearchAside() {
  const queriesDatalistId = useId();
  return (
    <Aside type="search" heading="Search">
      <div className="p-6">
        <SearchFormPredictive>
          {({fetchResults, goToSearch, inputRef}) => (
            <div className="flex gap-2">
              <input
                name="q"
                onChange={fetchResults}
                onFocus={fetchResults}
                placeholder="Search supplements…"
                ref={inputRef}
                type="search"
                list={queriesDatalistId}
                className="min-w-0 flex-1 rounded-full border border-steel/70 bg-charcoal px-5 py-3 text-sm text-bone placeholder:text-fog focus:border-volt focus:outline-none"
              />
              <button onClick={goToSearch} className="btn-ghost px-5 py-3">
                Search
              </button>
            </div>
          )}
        </SearchFormPredictive>

        <div className="mt-6 text-sm text-mist [&_a]:text-bone [&_a:hover]:text-volt">
          <SearchResultsPredictive>
            {({items, total, term, state, closeSearch}) => {
              const {articles, collections, pages, products, queries} = items;

              if (state === 'loading' && term.current) {
                return <div className="text-fog">Searching…</div>;
              }

              if (!total) {
                return <SearchResultsPredictive.Empty term={term} />;
              }

              return (
                <>
                  <SearchResultsPredictive.Queries
                    queries={queries}
                    queriesDatalistId={queriesDatalistId}
                  />
                  <SearchResultsPredictive.Products
                    products={products}
                    closeSearch={closeSearch}
                    term={term}
                  />
                  <SearchResultsPredictive.Collections
                    collections={collections}
                    closeSearch={closeSearch}
                    term={term}
                  />
                  <SearchResultsPredictive.Pages
                    pages={pages}
                    closeSearch={closeSearch}
                    term={term}
                  />
                  <SearchResultsPredictive.Articles
                    articles={articles}
                    closeSearch={closeSearch}
                    term={term}
                  />
                  {term.current && total ? (
                    <Link
                      onClick={closeSearch}
                      to={`${SEARCH_ENDPOINT}?q=${term.current}`}
                      className="mt-4 inline-block font-semibold text-volt"
                    >
                      View all results for “{term.current}” →
                    </Link>
                  ) : null}
                </>
              );
            }}
          </SearchResultsPredictive>
        </div>
      </div>
    </Aside>
  );
}
