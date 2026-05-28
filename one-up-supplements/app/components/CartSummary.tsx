import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, Money, type OptimisticCart} from '@shopify/hydrogen';
import {useId} from 'react';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({cart, layout}: CartSummaryProps) {
  return (
    <div
      className={`border-t border-ash/60 bg-carbon px-6 py-6 ${
        layout === 'page' ? 'rounded-2xl border' : ''
      }`}
    >
      <CartDiscounts discountCodes={cart.discountCodes} />

      <dl className="mb-5 flex items-center justify-between">
        <dt className="text-sm uppercase tracking-widest text-fog">Subtotal</dt>
        <dd className="font-display text-xl font-bold">
          {cart.cost?.subtotalAmount?.amount ? (
            <Money data={cart.cost.subtotalAmount} />
          ) : (
            '—'
          )}
        </dd>
      </dl>

      <p className="mb-5 text-xs text-fog">
        Shipping &amp; taxes calculated at checkout.
      </p>

      <a
        href={cart.checkoutUrl ?? '#'}
        target="_self"
        className={`btn-primary w-full ${
          cart.checkoutUrl ? '' : 'pointer-events-none opacity-50'
        }`}
      >
        Checkout
        <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
          <path
            d="M2 6h8M6.5 2.5L10 6l-3.5 3.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </div>
  );
}

function CartDiscounts({
  discountCodes,
}: {
  discountCodes?: CartApiQueryFragment['discountCodes'];
}) {
  const codeInputId = useId();
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div className="mb-5">
      {codes.length ? (
        <div className="mb-3 flex items-center justify-between rounded-lg bg-graphite px-3 py-2 text-sm">
          <span className="text-fog">Discount</span>
          <div className="flex items-center gap-2">
            <code className="font-semibold text-volt">{codes.join(', ')}</code>
            <UpdateDiscountForm>
              <button
                type="submit"
                aria-label="Remove discount"
                className="text-xs text-fog hover:text-volt"
              >
                Remove
              </button>
            </UpdateDiscountForm>
          </div>
        </div>
      ) : null}

      <UpdateDiscountForm discountCodes={codes}>
        <div className="flex gap-2">
          <label htmlFor={codeInputId} className="sr-only">
            Discount code
          </label>
          <input
            id={codeInputId}
            type="text"
            name="discountCode"
            placeholder="Discount code"
            className="min-w-0 flex-1 rounded-full border border-steel/70 bg-charcoal px-4 py-2.5 text-sm text-bone placeholder:text-fog focus:border-volt focus:outline-none"
          />
          <button type="submit" className="btn-ghost px-5 py-2.5">
            Apply
          </button>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{discountCodes: discountCodes || []}}
    >
      {children}
    </CartForm>
  );
}
