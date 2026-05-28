import {useOptimisticCart} from '@shopify/hydrogen';
import {Link} from 'react-router';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {CartLineItem, type CartLine} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

export type LineItemChildrenMap = {[parentId: string]: CartLine[]};

/** Returns a map of all line items and their children (componentizable lines). */
function getLineItemChildrenMap(lines: CartLine[]): LineItemChildrenMap {
  const children: LineItemChildrenMap = {};
  for (const line of lines) {
    if ('parentRelationship' in line && line.parentRelationship?.parent) {
      const parentId = line.parentRelationship.parent.id;
      if (!children[parentId]) children[parentId] = [];
      children[parentId].push(line);
    }
    if ('lineComponents' in line) {
      const nested = getLineItemChildrenMap(line.lineComponents);
      for (const [parentId, childIds] of Object.entries(nested)) {
        if (!children[parentId]) children[parentId] = [];
        children[parentId].push(...childIds);
      }
    }
  }
  return children;
}

export function CartMain({layout, cart: originalCart}: CartMainProps) {
  const cart = useOptimisticCart(originalCart);
  const cartHasItems = (cart?.totalQuantity ?? 0) > 0;
  const childrenMap = getLineItemChildrenMap(cart?.lines?.nodes ?? []);

  if (!cartHasItems) {
    return <CartEmpty layout={layout} />;
  }

  return (
    <section
      className="flex h-full flex-col"
      aria-label={layout === 'page' ? 'Cart page' : 'Cart drawer'}
    >
      <ul
        aria-label="Cart line items"
        className={`flex-1 divide-y divide-ash/50 px-6 ${
          layout === 'aside' ? 'overflow-y-auto' : ''
        }`}
      >
        {(cart?.lines?.nodes ?? []).map((line) => {
          if ('parentRelationship' in line && line.parentRelationship?.parent) {
            return null;
          }
          return (
            <CartLineItem
              key={line.id}
              line={line}
              layout={layout}
              childrenMap={childrenMap}
            />
          );
        })}
      </ul>
      <CartSummary cart={cart} layout={layout} />
    </section>
  );
}

function CartEmpty({layout}: {layout: CartLayout}) {
  const {close} = useAside();
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-8 py-16 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-full border border-ash/70 text-fog">
        <svg width="26" height="26" viewBox="0 0 18 18" fill="none">
          <path
            d="M2 2h2l1.5 9.5a1 1 0 001 .8h6.8a1 1 0 001-.8L16 5H5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div>
        <h3 className="font-display text-xl">Your cart is empty</h3>
        <p className="mt-2 text-sm text-fog">Time to stack up. Find your formula.</p>
      </div>
      <Link
        to="/collections/all"
        prefetch="viewport"
        onClick={() => layout === 'aside' && close()}
        className="btn-primary"
      >
        Shop supplements
      </Link>
    </div>
  );
}
