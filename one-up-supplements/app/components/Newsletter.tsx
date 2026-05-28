import {useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {Reveal} from '~/components/Reveal';

/**
 * Client-side newsletter capture. Validates the email and shows a success
 * state. NOTE: this does not POST anywhere yet — wire `handleSubmit` to your
 * ESP (Klaviyo, Mailchimp, Shopify marketing) or a route action when ready.
 */
export function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'error' | 'done'>('idle');

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!valid) {
      setStatus('error');
      return;
    }
    // TODO: send `email` to your email service provider here.
    setStatus('done');
  }

  return (
    <section className="container-x py-24">
      <Reveal className="relative overflow-hidden rounded-3xl border border-ash/60 bg-charcoal px-6 py-16 text-center sm:px-16">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-radial-volt opacity-70" />
        <div className="relative mx-auto max-w-2xl">
          <p className="eyebrow mb-4">Join the team</p>
          <h2 className="text-balance text-4xl sm:text-5xl">
            Get <span className="text-volt">15% off</span> your first stack.
          </h2>
          <p className="mt-4 text-mist">
            Early drops, training tips, and member-only pricing. No spam — just
            gains.
          </p>

          <AnimatePresence mode="wait">
            {status === 'done' ? (
              <motion.div
                key="done"
                initial={{opacity: 0, y: 12}}
                animate={{opacity: 1, y: 0}}
                className="mx-auto mt-9 flex max-w-md items-center justify-center gap-3 rounded-full border border-volt/50 bg-volt/10 px-6 py-4 text-volt"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M4 10.5l4 4 8-9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                You&apos;re in. Check your inbox for your code.
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{opacity: 0, y: 12}}
                animate={{opacity: 1, y: 0}}
                className="mx-auto mt-9 flex max-w-md flex-col gap-3 sm:flex-row"
                noValidate
              >
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  placeholder="you@email.com"
                  aria-invalid={status === 'error'}
                  className="min-w-0 flex-1 rounded-full border border-steel/70 bg-void px-5 py-3.5 text-sm text-bone placeholder:text-fog focus:border-volt focus:outline-none"
                />
                <button type="submit" className="btn-primary shrink-0">
                  Claim 15%
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {status === 'error' ? (
            <p className="mt-3 text-sm text-red-400">
              Please enter a valid email address.
            </p>
          ) : null}
        </div>
      </Reveal>
    </section>
  );
}
