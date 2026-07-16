import {
  AGOUA_MARK_HEIGHT,
  AGOUA_MARK_INNER_TRANSFORM,
  AGOUA_MARK_OUTER_TRANSFORM,
  AGOUA_MARK_PATHS,
  AGOUA_MARK_WIDTH,
} from "@/lib/agouaMark";

type AgouaMarkProps = {
  className?: string;
};

export function AgouaMark({ className }: AgouaMarkProps) {
  return (
    <svg
      viewBox={`0 0 ${AGOUA_MARK_WIDTH} ${AGOUA_MARK_HEIGHT}`}
      className={className}
      fill="currentColor"
      aria-label="Agoua"
    >
      <g transform={AGOUA_MARK_OUTER_TRANSFORM}>
        <g transform={AGOUA_MARK_INNER_TRANSFORM}>
          {AGOUA_MARK_PATHS.map((d, index) => (
            <path key={index} d={d} />
          ))}
        </g>
      </g>
    </svg>
  );
}
