import {useLoaderData, Link} from 'react-router';
import type {Route} from './+types/collections._index';
import {getPaginationVariables, Image, Pagination} from '@shopify/hydrogen';
import type {CollectionFragment} from 'storefrontapi.generated';
import {Reveal} from '~/components/Reveal';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Collections | One Up Supplements'}];
};

export async function loader(args: Route.LoaderArgs) {
  const paginationVariables = getPaginationVariables(args.request, {pageBy: 12});

  const data = await args.context.storefront
    .query(COLLECTIONS_QUERY, {variables: paginationVariables})
    .catch(() => null);

  return {collections: data?.collections ?? null};
}

export default function Collections() {
  const {collections} = useLoaderData<typeof loader>();

  return (
    <div className="container-x py-16">
      <Reveal className="mb-12 max-w-2xl">
        <p className="eyebrow mb-4">Browse</p>
        <h1 className="text-balance text-5xl sm:text-6xl">Collections</h1>
        <p className="mt-4 text-mist">
          Find the formula for your goal — strength, endurance, recovery, or
          everyday wellness.
        </p>
      </Reveal>

      {collections && collections.nodes.length ? (
        <Pagination connection={collections}>
          {({nodes, isLoading, PreviousLink, NextLink}) => (
            <>
              <div className="mb-8 flex justify-center">
                <PreviousLink className="btn-ghost">
                  {isLoading ? 'Loading…' : '↑ Load previous'}
                </PreviousLink>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {nodes.map((collection, index) => (
                  <CollectionItem
                    key={collection.id}
                    collection={collection}
                    index={index}
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
        <p className="text-fog">No collections found.</p>
      )}
    </div>
  );
}

function CollectionItem({
  collection,
  index,
}: {
  collection: CollectionFragment;
  index: number;
}) {
  return (
    <Link
      to={`/collections/${collection.handle}`}
      prefetch="intent"
      className="group relative block aspect-[4/3] overflow-hidden rounded-2xl border border-ash/60 bg-charcoal"
    >
      {collection?.image ? (
        <Image
          alt={collection.image.altText || collection.title}
          data={collection.image}
          loading={index < 3 ? 'eager' : 'lazy'}
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="h-full w-full object-cover opacity-60 transition-all duration-700 group-hover:scale-105 group-hover:opacity-80"
        />
      ) : (
        <div className="h-full w-full bg-graphite" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6">
        <h2 className="font-display text-2xl tracking-tightest transition-colors group-hover:text-volt">
          {collection.title}
        </h2>
        <span className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-volt opacity-0 transition-opacity group-hover:opacity-100">
          Shop now →
        </span>
      </div>
    </Link>
  );
}

const COLLECTIONS_QUERY = `#graphql
  fragment Collection on Collection {
    id
    title
    handle
    description
    image {
      id
      url
      altText
      width
      height
    }
  }
  query StoreCollections(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...Collection
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
` as const;
