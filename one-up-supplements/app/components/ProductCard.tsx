import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {motion} from 'framer-motion';
import type {ProductCardFragment} from 'storefrontapi.generated';
import {ProductPrice} from '~/components/ProductPrice';

/**
 * Animated product tile for grids. Lifts on hover, reveals a "View" cue, and
 * cross-fades to a second product image when one exists.
 */
export function ProductCard({
  product,
  index = 0,
  loading,
}: {
  product: ProductCardFragment;
  index?: number;
  loading?: 'eager' | 'lazy';
}) {
  const images = product.images?.nodes ?? [];
  const primary = product.featuredImage ?? images[0];
  const secondary = images.find((n) => n.id !== primary?.id);
  const minPrice = product.priceRange?.minVariantPrice;
  const compareAt = product.compareAtPriceRange?.minVariantPrice;
  const onSale =
    compareAt?.amount &&
    minPrice?.amount &&
    Number(compareAt.amount) > Number(minPrice.amount);

  return (
    <motion.article
      initial={{opacity: 0, y: 28}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: '0px 0px -80px 0px'}}
      transition={{duration: 0.6, delay: (index % 8) * 0.06, ease: [0.16, 1, 0.3, 1]}}
      className="group relative"
    >
      <Link to={`/products/${product.handle}`} prefetch="intent" className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-ash/60 bg-charcoal">
          {onSale ? (
            <span className="absolute left-3 top-3 z-10 rounded-full bg-volt px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-void">
              Sale
            </span>
          ) : null}

          {primary ? (
            <Image
              data={primary}
              aspectRatio="4/5"
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              loading={loading}
              className="h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="grid h-full w-full place-items-center bg-graphite text-fog">
              <span className="text-xs uppercase tracking-widest">No image</span>
            </div>
          )}

          {secondary ? (
            <Image
              data={secondary}
              aspectRatio="4/5"
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          ) : null}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-void/90 via-void/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 translate-y-3 p-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-volt px-4 py-2 text-xs font-bold uppercase tracking-wide text-void">
              View product
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2 6h8M6.5 2.5L10 6l-3.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            {product.vendor ? (
              <p className="mb-1 truncate text-[11px] uppercase tracking-widest text-fog">
                {product.vendor}
              </p>
            ) : null}
            <h3 className="font-display text-base font-bold leading-tight tracking-tightest text-bone transition-colors group-hover:text-volt">
              {product.title}
            </h3>
          </div>
          <ProductPrice
            price={minPrice}
            compareAtPrice={compareAt}
            className="shrink-0"
          />
        </div>
      </Link>
    </motion.article>
  );
}
