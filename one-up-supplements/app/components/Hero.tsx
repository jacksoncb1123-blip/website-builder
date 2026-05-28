import {useRef} from 'react';
import {Link} from 'react-router';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';

type Chip = {
  label: string;
  depth: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
};

const INGREDIENTS: Chip[] = [
  {label: 'Creatine', top: '18%', left: '8%', depth: 80},
  {label: 'Beetroot', top: '30%', right: '10%', depth: 140},
  {label: 'Mullein', bottom: '26%', left: '12%', depth: 110},
  {label: 'Postbiotics', bottom: '18%', right: '14%', depth: 60},
];

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const {scrollYProgress} = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const yGlow = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const yWord = useTransform(scrollYProgress, [0, 1], ['0%', '60%']);
  const yContent = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[92vh] items-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid-faint bg-[size:64px_64px]" />
      <motion.div
        style={{y: reduce ? 0 : yGlow}}
        className="absolute inset-x-0 top-[-20%] h-[80vh] bg-radial-volt"
      />

      <motion.h2
        style={{y: reduce ? 0 : yWord}}
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center font-display text-[24vw] font-extrabold leading-none text-stroke-volt opacity-[0.07]"
      >
        ONE UP
      </motion.h2>

      <motion.div
        style={{y: reduce ? 0 : yContent, opacity: reduce ? 1 : opacity}}
        className="container-x relative z-10"
      >
        <div className="max-w-3xl">
          <motion.p
            initial={{opacity: 0, y: 16}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.3, duration: 0.7}}
            className="eyebrow mb-6"
          >
            Performance Nutrition · Clinically Dosed
          </motion.p>
          <h1 className="text-balance font-display text-5xl font-extrabold leading-[0.95] tracking-tightest sm:text-7xl lg:text-8xl">
            {['Outwork', 'Yesterday.'].map((word, i) => (
              <span key={word} className="block overflow-hidden">
                <motion.span
                  className={`inline-block ${i === 1 ? 'text-volt' : ''}`}
                  initial={{y: '110%'}}
                  animate={{y: 0}}
                  transition={{
                    delay: 0.4 + i * 0.12,
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p
            initial={{opacity: 0, y: 16}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.7, duration: 0.7}}
            className="mt-7 max-w-xl text-lg leading-relaxed text-mist"
          >
            Clinically dosed creatine, beetroot, mullein and postbiotics —
            engineered for athletes who treat recovery like a sport. No filler.
            No fluff. Just results you can feel.
          </motion.p>
          <motion.div
            initial={{opacity: 0, y: 16}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.85, duration: 0.7}}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link to="/collections/all" prefetch="intent" className="btn-primary">
              Shop the lineup
              <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2 6h8M6.5 2.5L10 6l-3.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <Link to="/pages/about" prefetch="intent" className="btn-ghost">
              Our mission
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {INGREDIENTS.map((chip, i) => (
        <FloatingChip
          key={chip.label}
          chip={chip}
          index={i}
          progress={scrollYProgress}
          disabled={!!reduce}
        />
      ))}

      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-steel/70 p-1.5">
          <motion.span
            className="h-2 w-1 rounded-full bg-volt"
            animate={{y: [0, 8, 0]}}
            transition={{repeat: Infinity, duration: 1.6, ease: 'easeInOut'}}
          />
        </div>
      </div>
    </section>
  );
}

function FloatingChip({
  chip,
  index,
  progress,
  disabled,
}: {
  chip: Chip;
  index: number;
  progress: MotionValue<number>;
  disabled: boolean;
}) {
  const y = useTransform(progress, [0, 1], ['0px', `${chip.depth}px`]);
  return (
    <motion.div
      aria-hidden
      style={{
        y: disabled ? 0 : y,
        top: chip.top,
        left: chip.left,
        right: chip.right,
        bottom: chip.bottom,
      }}
      initial={{opacity: 0, scale: 0.8}}
      animate={{opacity: 1, scale: 1}}
      transition={{delay: 1 + index * 0.1, duration: 0.6}}
      className="absolute z-[5] hidden lg:block"
    >
      <span className="card-surface rounded-full px-5 py-2.5 text-sm font-semibold text-mist shadow-lift">
        <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-volt align-middle" />
        {chip.label}
      </span>
    </motion.div>
  );
}
