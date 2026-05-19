import { LOGO_ALT, LOGO_SRC } from "../lib/brand";

/** Height-led sizing — asset is trimmed to content bounds (no letterbox padding). */
const SIZE_CLASS = {
  header: "h-8 w-auto sm:h-9",
  md: "h-10 w-auto sm:h-11",
  lg: "h-14 w-auto sm:h-16",
} as const;

interface Props {
  size?: keyof typeof SIZE_CLASS;
  className?: string;
}

export default function CeciliaLogo({
  size = "header",
  className = "",
}: Props) {
  return (
    <img
      src={LOGO_SRC}
      alt={LOGO_ALT}
      className={`block h-auto shrink-0 object-contain object-left ${SIZE_CLASS[size]} ${className}`.trim()}
      decoding="async"
    />
  );
}
