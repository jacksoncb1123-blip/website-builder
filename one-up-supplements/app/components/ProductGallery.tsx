import {useEffect, useState} from 'react';
import {Image} from '@shopify/hydrogen';
import {AnimatePresence, motion} from 'framer-motion';

type GalleryImage = {
  id?: string | null;
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
};

export function ProductGallery({
  images,
  title,
  activeUrl,
}: {
  images: GalleryImage[];
  title: string;
  /** When the selected variant changes, jump to its image. */
  activeUrl?: string | null;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!activeUrl) return;
    const i = images.findIndex((img) => img.url === activeUrl);
    if (i >= 0) setActive(i);
  }, [activeUrl, images]);

  const current = images[active];

  if (!images.length) {
    return (
      <div className="grid aspect-square w-full place-items-center rounded-3xl border border-ash/60 bg-graphite text-fog">
        <span className="text-xs uppercase tracking-widest">No image</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square overflow-hidden rounded-3xl border border-ash/60 bg-charcoal">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-40 bg-radial-volt opacity-50" />
        <AnimatePresence mode="wait">
          <motion.div
            key={current?.id ?? current?.url ?? active}
            initial={{opacity: 0, scale: 1.02}}
            animate={{opacity: 1, scale: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.4, ease: [0.16, 1, 0.3, 1]}}
            className="h-full w-full"
          >
            {current ? (
              <Image
                data={current}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="h-full w-full object-cover"
                loading="eager"
              />
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>

      {images.length > 1 ? (
        <div className="grid grid-cols-5 gap-3">
          {images.slice(0, 5).map((image, i) => (
            <button
              key={image.id ?? image.url ?? i}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1} of ${title}`}
              className={`aspect-square overflow-hidden rounded-xl border transition-all ${
                i === active
                  ? 'border-volt opacity-100'
                  : 'border-ash/60 opacity-60 hover:opacity-100'
              }`}
            >
              <Image
                data={image}
                width={120}
                height={120}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
