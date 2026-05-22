import { LOGO_ALT, LOGO_ICON_SRC, LOGO_SRC } from "../lib/brand";

/** Height-led wordmark sizing — asset is trimmed to content bounds. */
const WORDMARK_SIZE_CLASS = {
  header: "h-6 w-auto sm:h-9",
  md: "h-10 w-auto sm:h-11",
  lg: "h-14 w-auto sm:h-16",
} as const;

const ICON_CLASS = "block h-6 w-6 shrink-0 object-contain";
const WORDMARK_CLASS = "block shrink-0 object-contain object-left";

export type CeciliaLogoVariant = "icon" | "wordmark";

interface Props {
  variant?: CeciliaLogoVariant;
  size?: keyof typeof WORDMARK_SIZE_CLASS;
  className?: string;
}

export default function CeciliaLogo({
  variant = "wordmark",
  size = "header",
  className = "",
}: Props) {
  if (variant === "icon") {
    return (
      <img
        src={LOGO_ICON_SRC}
        alt={LOGO_ALT}
        className={[ICON_CLASS, className].filter(Boolean).join(" ")}
        decoding="async"
      />
    );
  }

  return (
    <img
      src={LOGO_SRC}
      alt={LOGO_ALT}
      className={[WORDMARK_CLASS, WORDMARK_SIZE_CLASS[size], className]
        .filter(Boolean)
        .join(" ")}
      decoding="async"
    />
  );
}
