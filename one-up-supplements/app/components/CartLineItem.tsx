import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import type {CartLayout, LineItemChildrenMap} from '~/components/CartMain';
import {CartForm, Image, type OptimisticCartLine} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link} from 'react-router';
import {ProductPrice} from './ProductPrice';
import {useAside} from './Aside';
import type {CartApiQueryFragment} from 'storefrontapi.generated';

export type CartLine = OptimisticCartLine<CartApiQueryFragment>;

export function CartLineItem({
  layout,
  line,
  childrenMap,
}: {
  layout: CartLayout;
  line: CartLine;
  childrenMap: LineItemChildrenMap;
}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const {close} = useAside();
  const lineItemChildren = childrenMap[id];
  const childrenLabelId = `cart-line-children-${id}`;

  return (
    <li className="py-5">
      <div className="flex gap-4">
        {image && (
          <Link
            to={lineItemUrl}
            onClick={() => layout === 'aside' && close()}
            className="shrink-0"
          >
            <Image
              alt={title}
              data={image}
              height={110}
              width={88}
              loading="lazy"
              className="h-[110px] w-[88px] rounded-xl border border-ash/60 object-cover"
            />
          </Link>
        )}

        <div className="flex flex-1 flex-col">
          <div className="flex items-start justify-between gap-2">
            <Link
              prefetch="intent"
              to={lineItemUrl}
              onClick={() => layout === 'aside' && close()}
              className="font-display text-sm font-bold leading-tight text-bone hover:text-volt"
            >
              {product.title}
            </Link>
            <ProductPrice price={line?.cost?.totalAmount} />
          </div>

          {selectedOptions.length && title !== 'Default Title' ? (
            <ul className="mt-1 flex flex-wrap gap-x-3 text-xs text-fog">
              {selectedOptions.map((option) => (
                <li key={option.name}>
                  {option.name}: {option.value}
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-auto pt-3">
            <CartLineQuantity line={line} />
          </div>
        </div>
      </div>

      {lineItemChildren ? (
        <div className="mt-3 pl-4">
          <p id={childrenLabelId} className="sr-only">
            Items bundled with {product.title}
          </p>
          <ul
            aria-labelledby={childrenLabelId}
            className="divide-y divide-ash/40 border-l border-ash/40 pl-4"
          >
            {lineItemChildren.map((childLine) => (
              <CartLineItem
                childrenMap={childrenMap}
                key={childLine.id}
                line={childLine}
                layout={layout}
              />
            ))}
          </ul>
        </div>
      ) : null}
    </li>
  );
}

function CartLineQuantity({line}: {line: CartLine}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="inline-flex items-center rounded-full border border-steel/70">
        <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
          <button
            aria-label="Decrease quantity"
            disabled={quantity <= 1 || !!isOptimistic}
            name="decrease-quantity"
            value={prevQuantity}
            className="grid h-8 w-8 place-items-center rounded-full text-fog transition-colors hover:text-volt disabled:opacity-40"
          >
            <span aria-hidden>−</span>
          </button>
        </CartLineUpdateButton>
        <span className="min-w-7 text-center text-sm font-semibold text-bone">
          {quantity}
        </span>
        <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
          <button
            aria-label="Increase quantity"
            name="increase-quantity"
            value={nextQuantity}
            disabled={!!isOptimistic}
            className="grid h-8 w-8 place-items-center rounded-full text-fog transition-colors hover:text-volt disabled:opacity-40"
          >
            <span aria-hidden>+</span>
          </button>
        </CartLineUpdateButton>
      </div>
      <CartLineRemoveButton lineIds={[lineId]} disabled={!!isOptimistic} />
    </div>
  );
}

function CartLineRemoveButton({
  lineIds,
  disabled,
}: {
  lineIds: string[];
  disabled: boolean;
}) {
  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button
        disabled={disabled}
        type="submit"
        className="text-xs uppercase tracking-wider text-fog underline-offset-4 transition-colors hover:text-volt hover:underline disabled:opacity-40"
      >
        Remove
      </button>
    </CartForm>
  );
}

function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  const lineIds = lines.map((line) => line.id);

  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}

function getUpdateKey(lineIds: string[]) {
  return [CartForm.ACTIONS.LinesUpdate, ...lineIds].join('-');
}
