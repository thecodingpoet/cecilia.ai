import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import { ChatProvider } from "./hooks/useChat";
import ChatPage from "./pages/ChatPage";
import OrdersPage from "./pages/OrdersPage";

export default function App() {
  return (
    <div className="app-root app-shell-enter">
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
  );
}
