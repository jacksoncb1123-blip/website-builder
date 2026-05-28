import {Link} from 'react-router';
import type {Route} from './+types/about';
import {Reveal, RevealGroup} from '~/components/Reveal';
import {Marquee} from '~/components/Marquee';

export const meta: Route.MetaFunction = () => {
  return [
    {title: 'About | One Up Supplements'},
    {
      name: 'description',
      content:
        'The story behind One Up Supplements — clinically dosed, transparently labeled performance nutrition built to help you outwork yesterday.',
    },
  ];
};

const VALUES = [
  {
    title: 'Clinical doses',
    body: 'Every active ingredient is dosed at the level shown to work in research — not a fairy-dusted fraction.',
  },
  {
    title: 'Radical transparency',
    body: 'No proprietary blends hiding behind a label. You see exactly what you take and how much.',
  },
  {
    title: 'Tested, then tested again',
    body: 'Third-party, banned-substance tested every batch. If it has our name on it, it earned it.',
  },
  {
    title: 'Zero junk',
    body: 'No artificial fillers, no junk binders, no shortcuts. Just what your body can actually use.',
  },
];

const FAQ = [
  {
    q: 'How long until I notice results?',
    a: 'It depends on the product. Creatine saturation takes 2–4 weeks of daily use; beetroot is felt acutely before training. Consistency is everything.',
  },
  {
    q: 'Are your products third-party tested?',
    a: 'Yes — every batch is tested by an independent lab for purity, potency, and banned substances. Certificates of analysis are available on request.',
  },
  {
    q: 'Do you ship internationally?',
    a: 'We currently ship across the US with international expansion in progress. Join the newsletter to hear when we land in your region.',
  },
  {
    q: 'What if it doesn’t work for me?',
    a: 'We back every order with a 30-day money-back guarantee. If you’re not feeling the difference, we’ll make it right.',
  },
];

export default function AboutRoute() {
  return (
    <div>
      <section className="relative overflow-hidden py-28">
        <div className="absolute inset-0 bg-radial-volt opacity-60" />
        <div className="absolute inset-0 bg-grid-faint bg-[size:64px_64px] opacity-40" />
        <div className="container-x relative">
          <Reveal className="max-w-3xl">
            <p className="eyebrow mb-6">Our story</p>
            <h1 className="text-balance text-5xl font-extrabold leading-[0.95] sm:text-7xl">
              Built in the gym.{' '}
              <span className="text-volt">Backed by science.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg text-mist">
              One Up started with a simple frustration: the supplement aisle was
              full of under-dosed, over-hyped products wrapped in proprietary
              blends. We wanted something better. So we built it.
            </p>
          </Reveal>
        </div>
      </section>

      <Marquee />

      <section id="mission" className="container-x py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <p className="eyebrow mb-4">The mission</p>
            <h2 className="text-balance text-4xl sm:text-5xl">
              Help everyday athletes beat yesterday — one scoop at a time.
            </h2>
          </Reveal>
          <Reveal index={1}>
            <div className="space-y-5 text-mist">
              <p>
                We formulate for the person who trains before sunrise, who reads
                the label, who wants to know <em>why</em> something works. No
                gimmicks. No hype you can’t feel.
              </p>
              <p>
                From creatine and beetroot to mullein and postbiotics, every One
                Up formula is dosed to clinical standards, made in cGMP-certified
                facilities, and tested by independent labs before it ever reaches
                you.
              </p>
              <p className="font-display text-xl font-bold text-bone">
                If it’s not better than what’s already out there, we don’t
                release it.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container-x pb-8">
        <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((value) => (
            <Reveal as="article" key={value.title} className="card-surface flex flex-col p-7">
              <span className="mb-5 grid h-11 w-11 place-items-center rounded-full bg-volt font-display text-lg font-bold text-void">
                ✓
              </span>
              <h3 className="font-display text-xl tracking-tightest">
                {value.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-fog">{value.body}</p>
            </Reveal>
          ))}
        </RevealGroup>
      </section>

      <section className="container-x grid gap-6 py-16 md:grid-cols-2">
        <Reveal as="article" id="shipping" className="card-surface p-8">
          <h2 className="font-display text-2xl tracking-tightest">Shipping</h2>
          <p className="mt-3 text-sm leading-relaxed text-fog">
            Orders ship within 1–2 business days. Free standard shipping on US
            orders over $50. Tracking is emailed the moment your order leaves the
            warehouse.
          </p>
        </Reveal>
        <Reveal as="article" index={1} id="returns" className="card-surface p-8">
          <h2 className="font-display text-2xl tracking-tightest">Returns</h2>
          <p className="mt-3 text-sm leading-relaxed text-fog">
            Not feeling it? Our 30-day money-back guarantee has you covered — even
            on opened products. Reach out and we’ll make it right, no hassle.
          </p>
        </Reveal>
      </section>

      <section id="faq" className="container-x py-16">
        <Reveal className="mb-12 max-w-2xl">
          <p className="eyebrow mb-4">Questions</p>
          <h2 className="text-4xl sm:text-5xl">Good to know.</h2>
        </Reveal>
        <RevealGroup className="mx-auto max-w-3xl divide-y divide-ash/60 border-y border-ash/60">
          {FAQ.map((item) => (
            <Reveal as="div" key={item.q}>
              <details className="group py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg tracking-tightest">
                  {item.q}
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-steel/70 text-fog transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-fog">{item.a}</p>
              </details>
            </Reveal>
          ))}
        </RevealGroup>
      </section>

      <section id="contact" className="container-x py-20">
        <Reveal className="relative overflow-hidden rounded-3xl border border-ash/60 bg-charcoal px-6 py-16 text-center sm:px-16">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-radial-volt opacity-70" />
          <div className="relative">
            <h2 className="text-balance text-4xl sm:text-5xl">
              Ready to outwork yesterday?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-mist">
              Questions about a formula? Reach us at{' '}
              <a
                href="mailto:hello@oneupsupplements.com"
                className="text-volt hover:underline"
              >
                hello@oneupsupplements.com
              </a>
              .
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Link to="/collections/all" prefetch="intent" className="btn-primary">
                Shop the lineup
              </Link>
              <Link to="/collections" prefetch="intent" className="btn-ghost">
                Browse collections
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
