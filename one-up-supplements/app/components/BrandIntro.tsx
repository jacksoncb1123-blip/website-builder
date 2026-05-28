import {useEffect, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';

/**
 * Full-screen page-load animation revealing the brand name, shown once per
 * browser session. Skipped for users who prefer reduced motion.
 */
export function BrandIntro() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const seen = sessionStorage.getItem('oneup:intro');
    if (reduce || seen) return;

    setShow(true);
    sessionStorage.setItem('oneup:intro', '1');
    const timer = setTimeout(() => setShow(false), 1900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-void"
          initial={{opacity: 1}}
          exit={{opacity: 0, transition: {duration: 0.5}}}
        >
          <div className="absolute inset-0 bg-radial-volt opacity-60" />
          <div className="overflow-hidden">
            <motion.div
              className="flex items-baseline gap-3 font-display text-5xl font-extrabold tracking-tightest sm:text-7xl"
              initial={{y: '110%'}}
              animate={{y: 0}}
              transition={{duration: 0.8, ease: [0.16, 1, 0.3, 1]}}
            >
              <span>ONE</span>
              <span className="text-volt">UP</span>
            </motion.div>
          </div>
          <motion.div
            className="absolute bottom-0 left-0 h-[3px] bg-volt"
            initial={{width: '0%'}}
            animate={{width: '100%'}}
            transition={{duration: 1.7, ease: 'easeInOut'}}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
