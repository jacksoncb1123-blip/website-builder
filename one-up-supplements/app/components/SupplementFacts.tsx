/**
 * On-brand "Supplement Facts" panel. Pulls from Shopify metafields when present
 * (namespace `custom`): `supplement_facts`, `serving_size`, `directions`.
 *
 * Expected `supplement_facts` format — one nutrient per line, pipe-delimited:
 *   Creatine Monohydrate|5 g|*
 *   Vitamin C|90 mg|100%
 * Falls back to a tasteful default panel when no metafields are configured.
 */
export function SupplementFacts({
  facts,
  servingSize,
  directions,
}: {
  facts?: string | null;
  servingSize?: string | null;
  directions?: string | null;
}) {
  const rows = parseFacts(facts);

  return (
    <div className="card-surface overflow-hidden">
      <div className="border-b-2 border-volt bg-volt/5 px-6 py-4">
        <h3 className="font-display text-xl font-extrabold tracking-tightest">
          Supplement Facts
        </h3>
        <p className="mt-1 text-sm text-fog">
          Serving size: {servingSize || '1 scoop'}
        </p>
      </div>

      {rows.length ? (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ash/60 text-left text-xs uppercase tracking-wider text-fog">
              <th className="px-6 py-2.5 font-medium">Nutrient</th>
              <th className="px-6 py-2.5 text-right font-medium">Amount</th>
              <th className="px-6 py-2.5 text-right font-medium">% DV</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={`${row.name}-${i}`}
                className="border-b border-ash/40 last:border-0"
              >
                <td className="px-6 py-3 font-medium text-bone">{row.name}</td>
                <td className="px-6 py-3 text-right text-mist">{row.amount}</td>
                <td className="px-6 py-3 text-right text-volt">{row.dv}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="px-6 py-5 text-sm text-fog">
          <p>
            Detailed supplement facts will appear here once you add a{' '}
            <code className="text-volt">custom.supplement_facts</code> metafield
            to this product in Shopify.
          </p>
        </div>
      )}

      <div className="border-t border-ash/60 px-6 py-4 text-xs text-fog">
        {directions ? (
          <p>
            <span className="font-semibold text-mist">Directions: </span>
            {directions}
          </p>
        ) : null}
        <p className="mt-2">
          * Percent Daily Values are based on a 2,000 calorie diet. Daily Value
          (DV) not established for some ingredients.
        </p>
      </div>
    </div>
  );
}

function parseFacts(
  facts?: string | null,
): Array<{name: string; amount: string; dv: string}> {
  if (!facts) return [];
  return facts
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name = '', amount = '', dv = ''] = line
        .split('|')
        .map((c) => c.trim());
      return {name, amount, dv: dv || '*'};
    })
    .filter((row) => row.name);
}
