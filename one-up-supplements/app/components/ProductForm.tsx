import {Link, useNavigate} from 'react-router';
import {type MappedProductOptions} from '@shopify/hydrogen';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';
import type {ProductFragment} from 'storefrontapi.generated';

export function ProductForm({
  productOptions,
  selectedVariant,
}: {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
}) {
  const navigate = useNavigate();
  const {open} = useAside();
  const available = selectedVariant?.availableForSale;

  return (
    <div className="space-y-7">
      {productOptions.map((option) => {
        if (option.optionValues.length === 1) return null;

        return (
          <fieldset key={option.name} className="space-y-3">
            <legend className="text-xs font-semibold uppercase tracking-ultrawide text-fog">
              {option.name}
            </legend>
            <div className="flex flex-wrap gap-2.5">
              {option.optionValues.map((value) => {
                const {
                  name,
                  handle,
                  variantUriQuery,
                  selected,
                  available: optAvailable,
                  exists,
                  isDifferentProduct,
                  swatch,
                } = value;

                const base =
                  'rounded-full border px-5 py-2.5 text-sm font-medium transition-all';
                const stateClass = selected
                  ? 'border-volt bg-volt text-void'
                  : 'border-steel/70 text-mist hover:border-volt hover:text-volt';
                const dim = optAvailable ? '' : 'opacity-40';

                if (isDifferentProduct) {
                  return (
                    <Link
                      className={`${base} ${stateClass} ${dim}`}
                      key={option.name + name}
                      prefetch="intent"
                      preventScrollReset
                      replace
                      to={`/products/${handle}?${variantUriQuery}`}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </Link>
                  );
                }

                return (
                  <button
                    type="button"
                    className={`${base} ${stateClass} ${dim} disabled:cursor-not-allowed`}
                    key={option.name + name}
                    disabled={!exists}
                    onClick={() => {
                      if (!selected) {
                        void navigate(`?${variantUriQuery}`, {
                          replace: true,
                          preventScrollReset: true,
                        });
                      }
                    }}
                  >
                    <ProductOptionSwatch swatch={swatch} name={name} />
                  </button>
                );
              })}
            </div>
          </fieldset>
        );
      })}

      <AddToCartButton
        disabled={!selectedVariant || !available}
        onClick={() => open('cart')}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                  selectedVariant,
                },
              ]
            : []
        }
      >
        {available ? 'Add to cart' : 'Sold out'}
      </AddToCartButton>
    </div>
  );
}

function ProductOptionSwatch({
  swatch,
  name,
}: {
  swatch?: Maybe<ProductOptionValueSwatch> | undefined;
  name: string;
}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (!image && !color) return <>{name}</>;

  return (
    <span
      aria-label={name}
      className="inline-block h-6 w-6 overflow-hidden rounded-full align-middle"
      style={{backgroundColor: color || 'transparent'}}
    >
      {image ? (
        <img src={image} alt={name} className="h-full w-full object-cover" />
      ) : null}
    </span>
  );
}
