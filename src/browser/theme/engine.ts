import {
  DEFAULT_THEME_SETTINGS,
  getThemePreset,
  normalizeThemeSettings,
  type ThemeAppearance,
  type ThemeId,
  type ThemeSettings,
} from "./types";
import { THEME_STYLE } from "./style";

const SETTINGS_KEY = "codex-web-theme-settings-v1";
const DATABASE_NAME = "codex-web-theme-assets";
const DATABASE_STORE = "assets";
const BACKGROUND_KEY = "custom-background";
const STYLE_ID = "codex-web-theme-style";
const MAX_IMAGE_BYTES = 20 * 1024 * 1024;

type ThemeListener = (settings: ThemeSettings) => void;

function openThemeDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, 1);
    request.onerror = () => reject(request.error ?? new Error("DB open failed"));
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(DATABASE_STORE)) {
        database.createObjectStore(DATABASE_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
  });
}

async function readBackgroundBlob(): Promise<Blob | null> {
  const database = await openThemeDatabase();
  try {
    return await new Promise((resolve, reject) => {
      const transaction = database.transaction(DATABASE_STORE, "readonly");
      const request = transaction.objectStore(DATABASE_STORE).get(BACKGROUND_KEY);
      request.onerror = () => reject(request.error);
      request.onsuccess = () =>
        resolve(request.result instanceof Blob ? request.result : null);
    });
  } finally {
    database.close();
  }
}

async function writeBackgroundBlob(blob: Blob | null): Promise<void> {
  const database = await openThemeDatabase();
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(DATABASE_STORE, "readwrite");
      transaction.onerror = () => reject(transaction.error);
      transaction.oncomplete = () => resolve();
      const store = transaction.objectStore(DATABASE_STORE);
      if (blob) {
        store.put(blob, BACKGROUND_KEY);
      } else {
        store.delete(BACKGROUND_KEY);
      }
    });
  } finally {
    database.close();
  }
}

function loadSettings(): ThemeSettings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    return normalizeThemeSettings(stored ? JSON.parse(stored) : null);
  } catch (error) {
    console.warn("[codex-web-theme] settings unavailable", error);
    return { ...DEFAULT_THEME_SETTINGS };
  }
}

function saveSettings(settings: ThemeSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.warn("[codex-web-theme] could not save settings", error);
  }
}

async function validateBackgroundImage(file: File): Promise<void> {
  if (!new Set(["image/jpeg", "image/png", "image/webp"]).has(file.type)) {
    throw new Error("仅支持 PNG、JPEG 和 WebP 图片");
  }
  if (file.size < 1 || file.size > MAX_IMAGE_BYTES) {
    throw new Error("背景图片不能超过 20 MB");
  }

  const bitmap = await createImageBitmap(file);
  bitmap.close();
}

export class ThemeEngine {
  private backgroundUrl: string | null = null;
  private destroyed = false;
  private listeners = new Set<ThemeListener>();
  private settings = loadSettings();
  private styleElement: HTMLStyleElement | null = null;

  async start(): Promise<void> {
    saveSettings(this.settings);
    this.installStyle();
    this.apply();

    if (!this.settings.customBackground) {
      return;
    }

    try {
      const blob = await readBackgroundBlob();
      if (blob && !this.destroyed) {
        this.setBackgroundUrl(URL.createObjectURL(blob));
        this.apply();
      } else if (!blob) {
        this.update({ customBackground: false });
      }
    } catch (error) {
      console.warn("[codex-web-theme] custom background unavailable", error);
      this.update({ customBackground: false });
    }
  }

  destroy(): void {
    this.destroyed = true;
    this.listeners.clear();
    this.clearThemeDom();
    this.styleElement?.remove();
    this.styleElement = null;
    this.setBackgroundUrl(null);
  }

  getSettings(): ThemeSettings {
    return { ...this.settings };
  }

  subscribe(listener: ThemeListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  selectPreset(presetId: ThemeId): void {
    if (presetId === "default") {
      this.update({ enabled: false, presetId });
      return;
    }
    this.update({ enabled: true, presetId });
  }

  setEnabled(enabled: boolean): void {
    this.update({ enabled });
  }

  setAppearance(appearance: ThemeAppearance): void {
    this.update({ appearance });
  }

  setBackgroundOpacity(backgroundOpacity: number): void {
    this.update({ backgroundOpacity });
  }

  setBackgroundBlur(backgroundBlur: number): void {
    this.update({ backgroundBlur });
  }

  async setCustomBackground(file: File): Promise<void> {
    await validateBackgroundImage(file);
    await writeBackgroundBlob(file);
    this.setBackgroundUrl(URL.createObjectURL(file));
    this.update({
      customBackground: true,
      enabled: true,
      presetId:
        this.settings.presetId === "default"
          ? DEFAULT_THEME_SETTINGS.presetId
          : this.settings.presetId,
    });
  }

  async removeCustomBackground(): Promise<void> {
    try {
      await writeBackgroundBlob(null);
    } finally {
      this.setBackgroundUrl(null);
      this.update({ customBackground: false });
    }
  }

  reset(): void {
    this.settings = { ...DEFAULT_THEME_SETTINGS };
    saveSettings(this.settings);
    this.apply();
    this.emit();
    void writeBackgroundBlob(null).catch((error) =>
      console.warn("[codex-web-theme] background cleanup failed", error),
    );
    this.setBackgroundUrl(null);
  }

  private update(patch: Partial<ThemeSettings>): void {
    this.settings = normalizeThemeSettings({ ...this.settings, ...patch });
    saveSettings(this.settings);
    this.apply();
    this.emit();
  }

  private emit(): void {
    const settings = this.getSettings();
    for (const listener of this.listeners) {
      try {
        listener(settings);
      } catch (error) {
        console.warn("[codex-web-theme] listener failed", error);
      }
    }
  }

  private installStyle(): void {
    const existing = document.getElementById(STYLE_ID);
    if (existing instanceof HTMLStyleElement) {
      this.styleElement = existing;
      return;
    }

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = THEME_STYLE;
    (document.head ?? document.documentElement).append(style);
    this.styleElement = style;
  }

  private apply(): void {
    const root = document.documentElement;
    if (!this.settings.enabled || this.settings.presetId === "default") {
      this.clearThemeDom();
      return;
    }

    const preset = getThemePreset(this.settings.presetId);
    const appearance =
      this.settings.appearance === "auto"
        ? preset.appearance
        : this.settings.appearance;

    root.dataset.codexWebTheme = preset.id;
    root.dataset.codexWebThemeAppearance = appearance;
    if (this.settings.customBackground && this.backgroundUrl) {
      root.dataset.codexWebThemeBackground = "custom";
    } else {
      delete root.dataset.codexWebThemeBackground;
    }
    root.style.setProperty("--cw-accent", preset.accent);
    root.style.setProperty("--cw-canvas", preset.canvas);
    root.style.setProperty("--cw-color-scheme", appearance);
    root.style.setProperty("--cw-sidebar", preset.sidebar);
    root.style.setProperty("--cw-surface", preset.surface);
    root.style.setProperty("--cw-text", preset.text);
    root.style.setProperty("--cw-text-muted", preset.textMuted);
    root.style.setProperty(
      "--cw-background-opacity",
      String(this.settings.backgroundOpacity),
    );
    root.style.setProperty(
      "--cw-background-blur",
      `${this.settings.backgroundBlur}px`,
    );
    root.style.setProperty(
      "--cw-background-image",
      this.settings.customBackground && this.backgroundUrl
        ? `url("${this.backgroundUrl}")`
        : "none",
    );
  }

  private clearThemeDom(): void {
    const root = document.documentElement;
    delete root.dataset.codexWebTheme;
    delete root.dataset.codexWebThemeAppearance;
    delete root.dataset.codexWebThemeBackground;
    for (const property of [
      "--cw-accent",
      "--cw-background-blur",
      "--cw-background-image",
      "--cw-background-opacity",
      "--cw-canvas",
      "--cw-color-scheme",
      "--cw-sidebar",
      "--cw-surface",
      "--cw-text",
      "--cw-text-muted",
    ]) {
      root.style.removeProperty(property);
    }
  }

  private setBackgroundUrl(url: string | null): void {
    if (this.backgroundUrl) {
      URL.revokeObjectURL(this.backgroundUrl);
    }
    this.backgroundUrl = url;
  }
}
