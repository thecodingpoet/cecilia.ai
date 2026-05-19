import { useCallback, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useChat } from "../hooks/useChat";
import AppHeader from "./AppHeader";

export default function AppLayout() {
  const { pathname } = useLocation();
  const isChat = pathname === "/";
  const { loading, clear, hasMessages } = useChat();
  const [confirmClear, setConfirmClear] = useState(false);

  const handleClear = useCallback(async () => {
    if (!hasMessages) return;
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    await clear();
    setConfirmClear(false);
  }, [clear, confirmClear, hasMessages]);

  const handleClearCancel = () => setConfirmClear(false);

  return (
    <div className="app-bg app-bg--live flex h-full flex-col">
      <AppHeader
        showClear={isChat && hasMessages}
        onClear={handleClear}
        clearDisabled={loading}
      />

      {isChat && confirmClear && (
        <div
          className="animate-banner-enter border-b px-4 py-2 text-center text-sm"
          style={{
            borderColor: "var(--border-subtle)",
            background: "var(--bg-elevated)",
          }}
          role="alert"
        >
          <span className="text-[var(--text-muted)]">
            Clear this conversation?{" "}
          </span>
          <button
            type="button"
            onClick={handleClear}
            className="font-medium"
            style={{ color: "var(--accent)" }}
          >
            Yes, clear
          </button>
          <span className="text-[var(--text-muted)]"> · </span>
          <button
            type="button"
            onClick={handleClearCancel}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            Cancel
          </button>
        </div>
      )}

      <div key={pathname} className="flex min-h-0 flex-1 flex-col animate-page-enter">
        <Outlet />
      </div>

      <footer className="shrink-0 py-2 text-center text-xs text-[var(--text-muted)]">
        Cecilia AI · {new Date().getFullYear()} 
      </footer>
    </div>
  );
}
