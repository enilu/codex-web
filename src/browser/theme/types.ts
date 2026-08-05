export type ThemeAppearance = "auto" | "dark" | "light";

export type ThemeId = "default" | "forest" | "midnight" | "rose";

export type ThemePreset = {
  accent: string;
  appearance: Exclude<ThemeAppearance, "auto">;
  canvas: string;
  description: string;
  id: ThemeId;
  name: string;
  preview: string;
  sidebar: string;
  surface: string;
  text: string;
  textMuted: string;
};

export type ThemeSettings = {
  appearance: ThemeAppearance;
  backgroundBlur: number;
  backgroundOpacity: number;
  customBackground: boolean;
  enabled: boolean;
  presetId: ThemeId;
  schemaVersion: 3;
};

export const DEFAULT_THEME_SETTINGS: ThemeSettings = {
  appearance: "auto",
  backgroundBlur: 0,
  backgroundOpacity: 0.9,
  customBackground: false,
  enabled: false,
  presetId: "midnight",
  schemaVersion: 3,
};

export const THEME_PRESETS: readonly ThemePreset[] = [
  {
    id: "default",
    name: "官方默认",
    description: "完全恢复 Codex 原生外观。",
    appearance: "dark",
    accent: "#8f95a3",
    canvas: "#111214",
    surface: "rgba(20, 21, 24, 0.96)",
    sidebar: "rgba(17, 18, 20, 0.98)",
    text: "#f4f4f5",
    textMuted: "#a1a1aa",
    preview: "linear-gradient(135deg, #25272b, #111214)",
  },
  {
    id: "midnight",
    name: "午夜星云",
    description: "低饱和蓝紫色玻璃质感，适合暗色环境。",
    appearance: "dark",
    accent: "#9b87f5",
    canvas: "#090b16",
    surface: "rgba(14, 17, 32, 0.78)",
    sidebar: "rgba(9, 11, 23, 0.86)",
    text: "#f4f1ff",
    textMuted: "#b9b4cf",
    preview:
      "radial-gradient(circle at 76% 24%, #5946a8 0, transparent 35%), linear-gradient(135deg, #161a38, #090b16)",
  },
  {
    id: "forest",
    name: "雾林",
    description: "沉静的青绿色调，保持代码区域清晰。",
    appearance: "dark",
    accent: "#65c9a5",
    canvas: "#081411",
    surface: "rgba(12, 27, 23, 0.8)",
    sidebar: "rgba(7, 20, 17, 0.88)",
    text: "#eefbf6",
    textMuted: "#acc9be",
    preview:
      "radial-gradient(circle at 70% 18%, #286c57 0, transparent 38%), linear-gradient(145deg, #112c25, #081411)",
  },
  {
    id: "rose",
    name: "柔光玫瑰",
    description: "轻盈暖色主题，适合明亮环境。",
    appearance: "light",
    accent: "#d35f7d",
    canvas: "#f8eef1",
    surface: "rgba(255, 250, 251, 0.82)",
    sidebar: "rgba(250, 238, 242, 0.9)",
    text: "#36262b",
    textMuted: "#755d65",
    preview:
      "radial-gradient(circle at 72% 22%, #efafbd 0, transparent 38%), linear-gradient(145deg, #fff8fa, #efd9df)",
  },
];

export function getThemePreset(id: ThemeId): ThemePreset {
  return (
    THEME_PRESETS.find((preset) => preset.id === id) ??
    THEME_PRESETS.find((preset) => preset.id === "midnight")!
  );
}

function clamp(value: unknown, fallback: number, min: number, max: number) {
  const numeric = Number(value);
  return Number.isFinite(numeric)
    ? Math.min(max, Math.max(min, numeric))
    : fallback;
}

export function normalizeThemeSettings(value: unknown): ThemeSettings {
  if (!value || typeof value !== "object") {
    return { ...DEFAULT_THEME_SETTINGS };
  }

  const candidate = value as Partial<ThemeSettings>;
  const presetId = THEME_PRESETS.some(
    (preset) => preset.id === candidate.presetId,
  )
    ? candidate.presetId!
    : DEFAULT_THEME_SETTINGS.presetId;
  const appearance = ["auto", "dark", "light"].includes(
    String(candidate.appearance),
  )
    ? candidate.appearance!
    : DEFAULT_THEME_SETTINGS.appearance;
  const isLegacySettings = candidate.schemaVersion !== 3;
  const storedOpacity = clamp(
    candidate.backgroundOpacity,
    DEFAULT_THEME_SETTINGS.backgroundOpacity,
    0.2,
    1,
  );
  const backgroundOpacity =
    isLegacySettings && candidate.customBackground === true
      ? Math.min(1, 0.72 + storedOpacity * 0.28)
      : storedOpacity;

  return {
    appearance,
    backgroundBlur: clamp(
      candidate.backgroundBlur,
      DEFAULT_THEME_SETTINGS.backgroundBlur,
      0,
      20,
    ),
    backgroundOpacity,
    customBackground: candidate.customBackground === true,
    enabled: candidate.enabled === true,
    presetId,
    schemaVersion: 3,
  };
}
