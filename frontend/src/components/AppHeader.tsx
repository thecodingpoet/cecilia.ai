import { Link, NavLink, useLocation } from "react-router-dom";
import CeciliaLogo from "./CeciliaLogo";

interface Props {
  onClear?: () => void;
  clearDisabled?: boolean;
  showClear?: boolean;
}

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-2.5 py-1 text-sm font-medium transition-colors ${
    isActive ? "" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
  }`;

const navLinkStyle = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? { background: "var(--accent-muted)", color: "var(--accent)" }
    : undefined;

export default function AppHeader({
  onClear,
  clearDisabled = false,
  showClear = false,
}: Props) {
  const { pathname } = useLocation();
  const headerMaxWidth =
    pathname === "/orders"
      ? "var(--max-content-width)"
      : "var(--max-chat-width)";

  return (
    <header
      className="animate-header-enter shrink-0 border-b"
      style={{
        borderColor: "var(--border-subtle)",
        ["--header-max-width" as string]: headerMaxWidth,
      }}
    >
      <div
        className="mx-auto flex max-w-[var(--header-max-width)] items-center justify-between gap-3 px-4 py-1.5 sm:px-5"
      >
        <Link
          to="/"
          className="flex shrink-0 items-center leading-none"
          aria-label="Cecilia home"
        >
          <CeciliaLogo size="header" />
        </Link>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <nav
            className="flex items-center gap-1"
            aria-label="Main"
          >
            <NavLink to="/" end className={navLinkClass} style={navLinkStyle}>
              Chat
            </NavLink>
            <NavLink to="/orders" className={navLinkClass} style={navLinkStyle}>
              Orders
            </NavLink>
          </nav>

          {showClear && onClear && (
            <button
              type="button"
              onClick={onClear}
              disabled={clearDisabled}
              className="shrink-0 rounded-md border px-2.5 py-1 text-sm transition-colors hover:bg-[var(--bg-elevated)] disabled:opacity-40"
              style={{ borderColor: "var(--border-subtle)" }}
            >
              Clear chat
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
