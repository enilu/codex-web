import { ThemeEngine } from "./engine";
import { ThemePanel } from "./panel";

declare global {
  interface Window {
    __CODEX_WEB_THEME__?: {
      destroy(): void;
    };
  }
}

async function waitForBody(): Promise<void> {
  if (document.body) {
    return;
  }
  await new Promise<void>((resolve) =>
    document.addEventListener("DOMContentLoaded", () => resolve(), {
      once: true,
    }),
  );
}

export async function startThemeFeature(): Promise<void> {
  if (window.__CODEX_WEB_THEME__) {
    return;
  }

  await waitForBody();
  const engine = new ThemeEngine();
  let panel: ThemePanel | null = null;

  try {
    await engine.start();
    panel = new ThemePanel(engine);
    panel.mount();
    window.__CODEX_WEB_THEME__ = {
      destroy() {
        try {
          panel?.destroy();
        } finally {
          engine.destroy();
          delete window.__CODEX_WEB_THEME__;
        }
      },
    };
  } catch (error) {
    console.warn(
      "[codex-web-theme] optional theme feature failed; using native appearance",
      error,
    );
    try {
      panel?.destroy();
      engine.destroy();
    } catch (cleanupError) {
      console.warn("[codex-web-theme] cleanup failed", cleanupError);
    }
  }
}
