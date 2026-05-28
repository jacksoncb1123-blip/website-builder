import {Money} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';

/** Price display that strikes through a compare-at price when on sale. */
export function ProductPrice({
  price,
  compareAtPrice,
  className = '',
}: {
  price?: Partial<MoneyV2> | null;
  compareAtPrice?: Partial<MoneyV2> | null;
  className?: string;
}) {
  const onSale =
    compareAtPrice?.amount &&
    price?.amount &&
    Number(compareAtPrice.amount) > Number(price.amount);

  return (
    <div
      aria-label="Price"
      role="group"
      className={`flex items-baseline gap-2 ${className}`}
    >
      {price?.amount ? (
        <Money
          data={price as MoneyV2}
          className="font-display text-base font-bold text-bone"
        />
      ) : (
        <span className="text-fog">&nbsp;</span>
      )}
      {onSale ? (
        <Money
          data={compareAtPrice as MoneyV2}
          className="text-sm text-fog line-through"
        />
      ) : null}
    </div>
  );
}
