import {Await, useLoaderData} from 'react-router';
import {Suspense} from 'react';
import type {Route} from './+types/products.$handle';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import type {RelatedProductsQuery} from 'storefrontapi.generated';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductForm} from '~/components/ProductForm';
import {ProductGallery} from '~/components/ProductGallery';
import {ProductCard} from '~/components/ProductCard';
import {SupplementFacts} from '~/components/SupplementFacts';
import {Reveal} from '~/components/Reveal';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {PRODUCT_CARD_FRAGMENT} from '~/lib/fragments';

export const meta: Route.MetaFunction = ({data}) => {
  return [
    {title: `${data?.product?.title ?? 'Product'} | One Up Supplements`},
    {
      name: 'description',
      content:
        data?.product?.seo?.description ??
        data?.product?.description?.slice(0, 150) ??
        '',
    },
    {rel: 'canonical', href: `/products/${data?.product?.handle}`},
  ];
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {product};
}

function loadDeferredData({context}: Route.LoaderArgs) {
  const relatedProducts = context.storefront
    .query(RELATED_PRODUCTS_QUERY)
    .catch((error: Error) => {
      console.error(error);
      return null;
    });

  return {relatedProducts};
}

export default function Product() {
  const {product, relatedProducts} = useLoaderData<typeof loader>();

  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {title, descriptionHtml, vendor} = product;
  const galleryImages = product.images?.nodes ?? [];
  const available = selectedVariant?.availableForSale;

  return (
    <div className="container-x py-12">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <div className="lg:sticky lg:top-[calc(var(--header-h)+24px)]">
            <ProductGallery
              images={galleryImages}
              title={title}
              activeUrl={selectedVariant?.image?.url}
            />
          </div>
        </Reveal>

        <Reveal index={1}>
          <div>
            {vendor ? <p className="eyebrow mb-4">{vendor}</p> : null}
            <h1 className="text-balance text-4xl font-extrabold sm:text-5xl">
              {title}
            </h1>

            <div className="mt-6 flex items-center justify-between gap-4">
              <ProductPrice
                price={selectedVariant?.price}
                compareAtPrice={selectedVariant?.compareAtPrice}
                className="[&>*:first-child]:text-2xl"
              />
              <span
                className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider ${
                  available ? 'text-volt' : 'text-fog'
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    available ? 'animate-pulse-glow bg-volt' : 'bg-steel'
                  }`}
                />
                {available ? 'In stock' : 'Sold out'}
              </span>
            </div>

            <div className="mt-8">
              <ProductForm
                productOptions={productOptions}
                selectedVariant={selectedVariant}
              />
            </div>

            <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {['Third-party tested', 'No fillers', 'Free shipping $50+'].map(
                (badge) => (
                  <li
                    key={badge}
                    className="flex items-center gap-2 rounded-xl border border-ash/60 bg-charcoal px-3 py-2.5 text-xs text-mist"
                  >
                    <span className="text-volt">✓</span>
                    {badge}
                  </li>
                ),
              )}
            </ul>

            {descriptionHtml ? (
              <div className="mt-10">
                <h2 className="mb-3 text-lg font-bold">Description</h2>
                <div
                  className="max-w-none text-sm leading-relaxed text-mist [&_a]:text-volt [&_li]:my-1 [&_ul]:list-disc [&_ul]:pl-5"
                  dangerouslySetInnerHTML={{__html: descriptionHtml}}
                />
              </div>
            ) : null}

            <div className="mt-10">
              <SupplementFacts
                facts={product.supplementFacts?.value}
                servingSize={product.servingSize?.value}
                directions={product.directions?.value}
              />
            </div>
          </div>
        </Reveal>
      </div>

      <Suspense fallback={null}>
        <Await resolve={relatedProducts}>
          {(related) => <RelatedProducts related={related} handle={product.handle} />}
        </Await>
      </Suspense>

      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

function RelatedProducts({
  related,
  handle,
}: {
  related: RelatedProductsQuery | null;
  handle: string;
}) {
  const products =
    related?.products?.nodes?.filter((p) => p.handle !== handle).slice(0, 4) ??
    [];
  if (!products.length) return null;

  return (
    <section className="mt-28">
      <Reveal className="mb-10">
        <p className="eyebrow mb-4">Stack it with</p>
        <h2 className="text-4xl sm:text-5xl">You might also like</h2>
      </Reveal>
      <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} loading="lazy" />
        ))}
      </div>
    </section>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    images(first: 10) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    servingSize: metafield(namespace: "custom", key: "serving_size") {
      value
    }
    directions: metafield(namespace: "custom", key: "directions") {
      value
    }
    supplementFacts: metafield(namespace: "custom", key: "supplement_facts") {
      value
      type
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

const RELATED_PRODUCTS_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query RelatedProducts($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 8, sortKey: BEST_SELLING) {
      nodes {
        ...ProductCard
      }
    }
  }
` as const;
