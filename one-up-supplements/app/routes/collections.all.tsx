import type {Route} from './+types/collections.all';
import {useLoaderData, useNavigate, useSearchParams} from 'react-router';
import {getPaginationVariables, Pagination} from '@shopify/hydrogen';
import type {ProductSortKeys} from '@shopify/hydrogen/storefront-api-types';
import {ProductCard} from '~/components/ProductCard';
import {Reveal} from '~/components/Reveal';
import {FilterChip} from '~/components/FilterChip';
import {PRODUCT_CARD_FRAGMENT} from '~/lib/fragments';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Shop All | One Up Supplements'}];
};

const SORT_OPTIONS = [
  {value: 'featured', label: 'Featured'},
  {value: 'best-selling', label: 'Best selling'},
  {value: 'newest', label: 'Newest'},
  {value: 'price-low', label: 'Price: low to high'},
  {value: 'price-high', label: 'Price: high to low'},
  {value: 'title', label: 'Alphabetical'},
];

function mapSort(sort: string): {sortKey: string; reverse: boolean} {
  switch (sort) {
    case 'best-selling':
      return {sortKey: 'BEST_SELLING', reverse: false};
    case 'newest':
      return {sortKey: 'CREATED_AT', reverse: true};
    case 'price-low':
      return {sortKey: 'PRICE', reverse: false};
    case 'price-high':
      return {sortKey: 'PRICE', reverse: true};
    case 'title':
      return {sortKey: 'TITLE', reverse: false};
    default:
      return {sortKey: 'BEST_SELLING', reverse: false};
  }
}

export async function loader(args: Route.LoaderArgs) {
  const {context, request} = args;
  const url = new URL(request.url);
  const sort = url.searchParams.get('sort') || 'featured';
  const {sortKey, reverse} = mapSort(sort);
  const paginationVariables = getPaginationVariables(request, {pageBy: 12});

  const navPromise = context.storefront
    .query(NAV_COLLECTIONS_QUERY)
    .catch(() => null);

  const data = await context.storefront
    .query(CATALOG_QUERY, {
      variables: {
        ...paginationVariables,
        sortKey: sortKey as ProductSortKeys,
        reverse,
      },
    })
    .catch(() => null);

  const nav = await navPromise;

  return {
    products: data?.products ?? null,
    collections: nav?.collections?.nodes ?? [],
    sort,
  };
}

export default function ShopAll() {
  const {products, collections, sort} = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  function onSortChange(value: string) {
    const params = new URLSearchParams(searchParams);
    params.set('sort', value);
    params.delete('cursor');
    params.delete('direction');
    navigate(`?${params.toString()}`, {preventScrollReset: true});
  }

  return (
    <div className="container-x py-16">
      <Reveal className="mb-10 max-w-2xl">
        <p className="eyebrow mb-4">Shop</p>
        <h1 className="text-balance text-5xl sm:text-6xl">Shop All</h1>
        <p className="mt-4 text-mist">Every formula in the One Up arsenal.</p>
      </Reveal>

      <div className="mb-10 flex flex-col gap-5 border-y border-ash/60 py-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2.5">
          <FilterChip to="/collections/all" active>
            All
          </FilterChip>
          {collections.map((collection) => (
            <FilterChip
              key={collection.id}
              to={`/collections/${collection.handle}`}
              active={false}
            >
              {collection.title}
            </FilterChip>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <label
            htmlFor="sort"
            className="text-xs uppercase tracking-widest text-fog"
          >
            Sort
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="rounded-full border border-steel/70 bg-charcoal px-4 py-2.5 text-sm text-bone focus:border-volt focus:outline-none"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {products && products.nodes.length ? (
        <Pagination connection={products}>
          {({nodes, isLoading, PreviousLink, NextLink}) => (
            <>
              <div className="mb-8 flex justify-center">
                <PreviousLink className="btn-ghost">
                  {isLoading ? 'Loading…' : '↑ Load previous'}
                </PreviousLink>
              </div>
              <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
                {nodes.map((product, i) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={i}
                    loading={i < 4 ? 'eager' : 'lazy'}
                  />
                ))}
              </div>
              <div className="mt-12 flex justify-center">
                <NextLink className="btn-ghost">
                  {isLoading ? 'Loading…' : 'Load more ↓'}
                </NextLink>
              </div>
            </>
          )}
        </Pagination>
      ) : (
        <div className="card-surface p-12 text-center">
          <h3 className="font-display text-2xl">Nothing here yet</h3>
          <p className="mt-2 text-sm text-fog">Check back soon.</p>
        </div>
      )}
    </div>
  );
}

const NAV_COLLECTIONS_QUERY = `#graphql
  query NavCollections($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 8, sortKey: UPDATED_AT) {
      nodes {
        id
        title
        handle
      }
    }
  }
` as const;

const CATALOG_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $sortKey: ProductSortKeys
    $reverse: Boolean
  ) @inContext(country: $country, language: $language) {
    products(
      first: $first
      last: $last
      before: $startCursor
      after: $endCursor
      sortKey: $sortKey
      reverse: $reverse
    ) {
      nodes {
        ...ProductCard
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
` as const;
