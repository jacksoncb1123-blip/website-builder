import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import {AnimatePresence, motion} from 'framer-motion';

type AsideType = 'search' | 'cart' | 'mobile' | 'closed';
type AsideContextValue = {
  type: AsideType;
  open: (mode: AsideType) => void;
  close: () => void;
};

/**
 * A slide-out overlay panel used for the cart drawer, search, and mobile menu.
 * Handles the backdrop, escape-to-close, scroll lock, and slide animation.
 */
export function Aside({
  children,
  heading,
  type,
  side = 'right',
}: {
  children?: ReactNode;
  type: AsideType;
  heading: ReactNode;
  side?: 'left' | 'right';
}) {
  const {type: activeType, close} = useAside();
  const expanded = type === activeType;

  useEffect(() => {
    if (!expanded) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [expanded, close]);

  const offscreen = side === 'right' ? '100%' : '-100%';

  return (
    <AnimatePresence>
      {expanded && (
        <motion.div
          className="fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-label={typeof heading === 'string' ? heading : 'Panel'}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.button
            aria-label="Close panel"
            className="absolute inset-0 h-full w-full cursor-default bg-void/70 backdrop-blur-sm"
            onClick={close}
            variants={{hidden: {opacity: 0}, visible: {opacity: 1}}}
            transition={{duration: 0.3}}
          />
          <motion.aside
            className={`absolute top-0 flex h-full w-full max-w-md flex-col bg-carbon shadow-lift ${
              side === 'right' ? 'right-0 border-l' : 'left-0 border-r'
            } border-ash/70`}
            variants={{hidden: {x: offscreen}, visible: {x: 0}}}
            transition={{type: 'spring', stiffness: 360, damping: 38}}
          >
            <header className="flex items-center justify-between border-b border-ash/60 px-6 py-5">
              <h3 className="font-display text-xl tracking-tightest">
                {heading}
              </h3>
              <button
                onClick={close}
                aria-label="Close"
                className="grid h-9 w-9 place-items-center rounded-full border border-steel/70 text-fog transition-colors hover:border-volt hover:text-volt"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 3l10 10M13 3L3 13"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </header>
            <div className="flex-1 overflow-y-auto">{children}</div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const AsideContext = createContext<AsideContextValue | null>(null);

Aside.Provider = function AsideProvider({children}: {children: ReactNode}) {
  const [type, setType] = useState<AsideType>('closed');

  return (
    <AsideContext.Provider
      value={{
        type,
        open: setType,
        close: () => setType('closed'),
      }}
    >
      {children}
    </AsideContext.Provider>
  );
};

export function useAside() {
  const aside = useContext(AsideContext);
  if (!aside) {
    throw new Error('useAside must be used within an Aside.Provider');
  }
  return aside;
}
