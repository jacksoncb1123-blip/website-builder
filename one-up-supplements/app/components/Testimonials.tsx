import {Reveal, RevealGroup} from '~/components/Reveal';

const REVIEWS = [
  {
    quote:
      'The creatine actually mixes clean — no grit, no aftertaste. Three months in and my lifts have never been more consistent.',
    name: 'Marcus T.',
    role: 'Powerlifter',
  },
  {
    quote:
      'Beetroot before training is a game changer for my endurance. I genuinely feel the difference on long rides.',
    name: 'Elena R.',
    role: 'Cyclist',
  },
  {
    quote:
      "Finally a postbiotic that doesn't wreck my stomach. Transparent labels and dosing I can actually trust.",
    name: 'Dré W.',
    role: 'CrossFit Coach',
  },
];

export function Testimonials() {
  return (
    <section className="container-x py-24">
      <Reveal className="mb-14 max-w-2xl">
        <p className="eyebrow mb-4">Proof, not promises</p>
        <h2 className="text-balance text-4xl sm:text-5xl">
          Trusted by people who don&apos;t skip leg day.
        </h2>
      </Reveal>

      <RevealGroup className="grid gap-6 md:grid-cols-3">
        {REVIEWS.map((review) => (
          <Reveal
            as="article"
            key={review.name}
            className="card-surface flex flex-col p-7"
          >
            <div
              className="mb-5 flex gap-1 text-volt"
              aria-label="5 out of 5 stars"
            >
              {Array.from({length: 5}).map((_, i) => (
                <svg key={i} width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 1l2 4.2 4.6.4-3.5 3 1.1 4.5L8 10.8 3.8 13.1l1.1-4.5-3.5-3 4.6-.4z" />
                </svg>
              ))}
            </div>
            <p className="flex-1 text-balance leading-relaxed text-mist">
              “{review.quote}”
            </p>
            <div className="mt-6 flex items-center gap-3 border-t border-ash/50 pt-5">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-volt font-display text-sm font-bold text-void">
                {review.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-bone">{review.name}</p>
                <p className="text-xs text-fog">{review.role}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </RevealGroup>
    </section>
  );
}
