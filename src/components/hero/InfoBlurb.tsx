import { motion } from "framer-motion";

type InfoBlurbProps = {
  ready: boolean;
};

export function InfoBlurb({ ready }: InfoBlurbProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={ready ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: 1.05, ease: [0.16, 1, 0.3, 1] }}
      className="absolute bottom-8 left-4 z-10 flex max-w-xs items-start gap-4 sm:left-6"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-neutral-300 text-brand-teal">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
          <path
            d="M3 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
          />
        </svg>
      </span>
      <p className="text-xs leading-relaxed text-neutral-500">
        In this futuristic realm, users can explore hyper-realistic virtual
        environments, interact with AI-driven avatars.
      </p>
    </motion.div>
  );
}
