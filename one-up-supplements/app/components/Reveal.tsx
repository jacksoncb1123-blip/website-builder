import {motion, type Variants} from 'framer-motion';
import type {ReactNode} from 'react';

const variants: Variants = {
  hidden: {opacity: 0, y: 28},
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1]},
  }),
};

/** Fade-and-rise on scroll. Pass `index` for staggered groups. */
export function Reveal({
  children,
  index = 0,
  className,
  as = 'div',
  id,
}: {
  children: ReactNode;
  index?: number;
  className?: string;
  as?: 'div' | 'section' | 'li' | 'article' | 'span';
  id?: string;
}) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      id={id}
      className={className}
      variants={variants}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{once: true, margin: '0px 0px -80px 0px'}}
    >
      {children}
    </MotionTag>
  );
}

/** Container that staggers <Reveal> children automatically. */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{once: true, margin: '0px 0px -80px 0px'}}
      variants={{
        hidden: {},
        visible: {transition: {staggerChildren: stagger}},
      }}
    >
      {children}
    </motion.div>
  );
}
