import { useEffect, useState } from "react";
import { APP_NAME, APP_TAGLINE } from "../lib/brand";
import { markIntroSeen, shouldShowIntro } from "../lib/motion";
import CeciliaLogo from "./CeciliaLogo";

interface Props {
  onComplete: () => void;
}

export default function AppIntro({ onComplete }: Props) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (!shouldShowIntro()) {
      onComplete();
      return;
    }

    const exitAt = window.setTimeout(() => setExiting(true), 1100);
    const doneAt = window.setTimeout(() => {
      markIntroSeen();
      onComplete();
    }, 1550);

    return () => {
      window.clearTimeout(exitAt);
      window.clearTimeout(doneAt);
    };
  }, [onComplete]);

  return (
    <div
      className={`intro-splash app-bg fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 px-6${exiting ? " intro-splash--exit" : ""}`}
      role="status"
      aria-live="polite"
      aria-label={`Loading ${APP_NAME}`}
    >
      <div className="intro-logo-wrap">
        <CeciliaLogo size="lg" className="intro-logo" />
      </div>
      <div className="intro-copy text-center">
        <p className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
          {APP_NAME}
        </p>
        <p className="mt-1 text-sm text-[var(--text-muted)]">{APP_TAGLINE}</p>
      </div>
    </div>
  );
}
