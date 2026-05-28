import {useLoaderData, Link} from 'react-router';
import type {Route} from './+types/_index';
import {Hero} from '~/components/Hero';
import {Marquee} from '~/components/Marquee';
import {Testimonials} from '~/components/Testimonials';
import {Newsletter} from '~/components/Newsletter';
import {ProductCard} from '~/components/ProductCard';
import {Reveal, RevealGroup} from '~/components/Reveal';
import {PRODUCT_CARD_FRAGMENT} from '~/lib/fragments';

export const meta: Route.MetaFunction = () => {
  return [
    {title: 'One Up Supplements — Outwork Yesterday'},
    {
      name: 'description',
      content:
        'Clinically dosed creatine, beetroot, mullein and postbiotics. Performance supplements engineered for athletes. No filler, ever.',
    },
  ];
};

export async function loader({context}: Route.LoaderArgs) {
  const data = await context.storefront
    .query(HOMEPAGE_QUERY)
    .catch((error: Error) => {
      console.error('Homepage query failed:', error);
      return null;
    });

  return {
    products: data?.products?.nodes ?? [],
    collections: data?.collections?.nodes ?? [],
  };
}

export default function Homepage() {
  const {products, collections} = useLoaderData<typeof loader>();

  return (
    <div>
      <Hero />
      <Marquee />

      {/* Featured products */}
      <section className="container-x py-24">
        <Reveal className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="eyebrow mb-4">The lineup</p>
            <h2 className="text-balance text-4xl sm:text-5xl">
              Built to be stacked.
            </h2>
          </div>
          <Link to="/collections/all" prefetch="intent" className="btn-ghost shrink-0">
            View all
          </Link>
        </Reveal>

        {products.length ? (
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
            {products.slice(0, 8).map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                index={i % 4}
                loading={i < 4 ? 'eager' : 'lazy'}
              />
            ))}
          </div>
        ) : (
          <EmptyStorefrontNotice />
        )}
      </section>

      {/* Mission statement */}
      <section id="mission" className="relative overflow-hidden py-28">
        <div className="absolute inset-0 bg-grid-faint bg-[size:64px_64px] opacity-50" />
        <div className="container-x relative">
          <Reveal className="mx-auto max-w-4xl text-center">
            <p className="eyebrow mb-6">Our mission</p>
            <p className="text-balance font-display text-3xl font-bold leading-tight tracking-tightest sm:text-5xl">
              We make supplements for people who{' '}
              <span className="text-volt">refuse to settle</span> — clinical
              doses, transparent labels, and zero junk. Every scoop is built to
              help you beat the version of you that showed up yesterday.
            </p>
            <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4">
              {[
                {stat: '100%', label: 'Transparent labels'},
                {stat: '0g', label: 'Artificial fillers'},
                {stat: '3rd', label: 'Party tested'},
                {stat: '50k+', label: 'Athletes fueled'},
              ].map((item) => (
                <div key={item.label}>
                  <p className="font-display text-4xl font-extrabold text-volt sm:text-5xl">
                    {item.stat}
                  </p>
                  <p className="mt-2 text-sm text-fog">{item.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Shop by category */}
      {collections.length ? (
        <section className="container-x py-12">
          <Reveal className="mb-10">
            <p className="eyebrow mb-4">Find your formula</p>
            <h2 className="text-4xl sm:text-5xl">Shop by goal.</h2>
          </Reveal>
          <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {collections.slice(0, 6).map((collection) => (
              <Reveal
                as="article"
                key={collection.id}
                className="group relative overflow-hidden rounded-2xl border border-ash/60 bg-charcoal"
              >
                <Link
                  to={`/collections/${collection.handle}`}
                  prefetch="intent"
                  className="block p-8"
                >
                  <h3 className="font-display text-2xl tracking-tightest transition-colors group-hover:text-volt">
                    {collection.title}
                  </h3>
                  {collection.description ? (
                    <p className="mt-2 line-clamp-2 text-sm text-fog">
                      {collection.description}
                    </p>
                  ) : null}
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-volt">
                    Explore
                    <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2 6h8M6.5 2.5L10 6l-3.5 3.5"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </Link>
              </Reveal>
            ))}
          </RevealGroup>
        </section>
      ) : null}

      <Testimonials />
      <Newsletter />
    </div>
  );
}

function EmptyStorefrontNotice() {
  return (
    <div className="card-surface flex flex-col items-center gap-4 p-12 text-center">
      <h3 className="font-display text-2xl">No products yet</h3>
      <p className="max-w-md text-sm text-fog">
        Connect your Shopify store in <code className="text-volt">.env</code> (or
        keep <code className="text-volt">mock.shop</code> for demo data) and your
        products will appear here automatically.
      </p>
    </div>
  );
}

const HOMEPAGE_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query Homepage($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 8, sortKey: BEST_SELLING) {
      nodes {
        ...ProductCard
      }
    }
    collections(first: 6, sortKey: UPDATED_AT) {
      nodes {
        id
        title
        handle
        description
      }
    }
  }
` as const;
