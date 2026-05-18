import { useCallback, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppIntro from "./components/AppIntro";
import AppLayout from "./components/AppLayout";
import { ChatProvider } from "./hooks/useChat";
import { shouldShowIntro } from "./lib/motion";
import ChatPage from "./pages/ChatPage";
import OrdersPage from "./pages/OrdersPage";

export default function App() {
  const [introDone, setIntroDone] = useState(() => !shouldShowIntro());
  const onIntroComplete = useCallback(() => setIntroDone(true), []);

  return (
    <>
      {!introDone && <AppIntro onComplete={onIntroComplete} />}
      <div
        className={`h-full${introDone ? " app-shell-enter" : " pointer-events-none opacity-0"}`}
        aria-hidden={!introDone}
      >
        <BrowserRouter>
          <ChatProvider>
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/" element={<ChatPage />} />
                <Route path="/orders" element={<OrdersPage />} />
              </Route>
            </Routes>
          </ChatProvider>
        </BrowserRouter>
      </div>
    </>
  );
}
