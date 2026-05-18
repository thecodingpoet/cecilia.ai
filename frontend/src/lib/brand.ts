/** Product branding — update here for app-wide name and copy. */
export const APP_NAME = "Cecilia AI";
export const APP_TAGLINE = "Your AI shopping assistant";
export const ASSISTANT_GREETING = "Hi, I'm Cecilia.";
export const LOGO_SRC = "/cecilia-logo.png";
export const LOGO_ALT = "Cecilia";
export const ASSISTANT_INTRO =
  "I can help you discover products, compare options, and shop effortlessly. Just chat naturally.";

export const ORDERS_PAGE_TITLE = "Orders";
export const ORDERS_EMPTY_MESSAGE =
  "No orders yet. Place one through chat and it will show up here.";

export const STARTER_PROMPTS = [
  "Show me wireless headphones under $400",
  "What's in stock in Electronics?",
  "I want to order TECH-003, quantity 1",
  "What's in my cart?",
];

const SESSION_KEY = "cecilia-session-id";

export function loadSessionId(): string | null {
  return localStorage.getItem(SESSION_KEY);
}

export function saveSessionId(id: string): void {
  localStorage.setItem(SESSION_KEY, id);
}
