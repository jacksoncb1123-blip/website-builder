import {redirect, useLoaderData, useNavigate, useSearchParams} from 'react-router';
import type {Route} from './+types/collections.$handle';
import {getPaginationVariables, Analytics, Pagination} from '@shopify/hydrogen';
import type {ProductCollectionSortKeys} from '@shopify/hydrogen/storefront-api-types';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {ProductCard} from '~/components/ProductCard';
import {Reveal} from '~/components/Reveal';
import {FilterChip} from '~/components/FilterChip';
import {PRODUCT_CARD_FRAGMENT} from '~/lib/fragments';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `${data?.collection.title ?? 'Collection'} | One Up Supplements`}];
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
      return {sortKey: 'CREATED', reverse: true};
    case 'price-low':
      return {sortKey: 'PRICE', reverse: false};
    case 'price-high':
      return {sortKey: 'PRICE', reverse: true};
    case 'title':
      return {sortKey: 'TITLE', reverse: false};
    default:
      return {sortKey: 'COLLECTION_DEFAULT', reverse: false};
  }
}

export async function loader(args: Route.LoaderArgs) {
  const {context, params, request} = args;
  const {handle} = params;
  const {storefront} = context;
  const url = new URL(request.url);
  const sort = url.searchParams.get('sort') || 'featured';
  const {sortKey, reverse} = mapSort(sort);
  const paginationVariables = getPaginationVariables(request, {pageBy: 12});

  if (!handle) {
    throw redirect('/collections');
  }

  const navPromise = storefront.query(NAV_COLLECTIONS_QUERY).catch(() => null);

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {
        handle,
        ...paginationVariables,
        sortKey: sortKey as ProductCollectionSortKeys,
        reverse,
      },
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle, data: collection});
  const nav = await navPromise;

  return {
    collection,
    collections: nav?.collections?.nodes ?? [],
    handle,
    sort,
  };
}

export default function Collection() {
  const {collection, collections, handle, sort} = useLoaderData<typeof loader>();
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
        <p className="eyebrow mb-4">Collection</p>
        <h1 className="text-balance text-5xl sm:text-6xl">{collection.title}</h1>
        {collection.description ? (
          <p className="mt-4 text-mist">{collection.description}</p>
        ) : null}
      </Reveal>

      <div className="mb-10 flex flex-col gap-5 border-y border-ash/60 py-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2.5">
          <FilterChip to="/collections/all" active={false}>
            All
          </FilterChip>
          {collections.map((c) => (
            <FilterChip
              key={c.id}
              to={`/collections/${c.handle}`}
              active={handle === c.handle}
            >
              {c.title}
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

      {collection.products.nodes.length ? (
        <Pagination connection={collection.products}>
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
          <p className="mt-2 text-sm text-fog">
            No products in this collection. Check back soon.
          </p>
        </div>
      )}

      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
    </div>
  );
}

const NAV_COLLECTIONS_QUERY = `#graphql
  query CollectionNav($country: CountryCode, $language: LanguageCode)
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

const COLLECTION_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
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
          endCursor
          startCursor
        }
      }
    }
  }
` as const;
