import { ThemeEngine } from "./engine";
import {
  THEME_PRESETS,
  type ThemeAppearance,
  type ThemeSettings,
} from "./types";

const HOST_ID = "codex-web-theme-host";

const PANEL_STYLE = `
:host {
  position: fixed;
  z-index: 2147483000;
  inset: 0;
  pointer-events: none;
  color: #f4f4f5;
  font: 13px/1.45 Inter, "Segoe UI", "Microsoft YaHei UI", system-ui, sans-serif;
}

* { box-sizing: border-box; }
button, input, select { font: inherit; }

.launcher {
  position: fixed;
  right: 0;
  top: 50%;
  width: 34px;
  height: 58px;
  border: 1px solid rgb(255 255 255 / .14);
  border-right: 0;
  border-radius: 12px 0 0 12px;
  color: #f4f4f5;
  background: rgb(20 21 25 / .82);
  box-shadow: 0 8px 28px rgb(0 0 0 / .24);
  backdrop-filter: blur(14px);
  cursor: pointer;
  pointer-events: auto;
  transform: translateY(-50%);
  transition: width 160ms ease, background 160ms ease;
}

.launcher:hover,
.launcher:focus-visible {
  width: 40px;
  background: rgb(36 38 44 / .94);
  outline: none;
}

.launcher svg { width: 18px; height: 18px; }

.backdrop {
  position: fixed;
  inset: 0;
  display: none;
  background: rgb(0 0 0 / .18);
  pointer-events: auto;
}

.backdrop[data-open="true"] { display: block; }

.panel {
  position: fixed;
  top: 52px;
  right: 14px;
  bottom: 14px;
  width: min(390px, calc(100vw - 28px));
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgb(255 255 255 / .12);
  border-radius: 18px;
  color: #f4f4f5;
  background: rgb(17 18 22 / .96);
  box-shadow: 0 24px 90px rgb(0 0 0 / .42);
  backdrop-filter: blur(22px) saturate(1.08);
  pointer-events: auto;
  transform: translateX(calc(100% + 28px));
  transition: transform 190ms cubic-bezier(.22, 1, .36, 1);
}

.panel[data-open="true"] { transform: translateX(0); }

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 17px 18px 13px;
  border-bottom: 1px solid rgb(255 255 255 / .09);
}

.title { margin: 0; font-size: 16px; font-weight: 650; }
.subtitle { margin: 2px 0 0; color: #a1a1aa; font-size: 12px; }

.icon-button {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 9px;
  color: #d4d4d8;
  background: transparent;
  cursor: pointer;
}
.icon-button:hover { background: rgb(255 255 255 / .08); }

.content {
  min-height: 0;
  padding: 16px 18px 24px;
  overflow: auto;
  scrollbar-width: thin;
}

.section + .section { margin-top: 22px; }
.section-title { margin: 0 0 10px; font-size: 12px; font-weight: 650; color: #d4d4d8; }

.preset-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.preset {
  min-width: 0;
  padding: 0;
  overflow: hidden;
  border: 1px solid rgb(255 255 255 / .1);
  border-radius: 13px;
  color: inherit;
  background: #24252a;
  text-align: left;
  cursor: pointer;
}
.preset:hover { border-color: rgb(255 255 255 / .24); }
.preset[aria-pressed="true"] {
  border-color: #a78bfa;
  box-shadow: 0 0 0 2px rgb(167 139 250 / .2);
}
.preset-preview { height: 66px; background: var(--preview); }
.preset-copy { padding: 9px 10px 10px; }
.preset-name { display: block; font-weight: 620; }
.preset-description { display: block; margin-top: 2px; color: #a1a1aa; font-size: 11px; }

.field {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 14px;
  min-height: 38px;
}
.field + .field { margin-top: 9px; }
.field-copy span { display: block; }
.field-hint { color: #8f8f99; font-size: 11px; }

select {
  min-width: 106px;
  height: 32px;
  padding: 0 28px 0 10px;
  border: 1px solid rgb(255 255 255 / .12);
  border-radius: 9px;
  color: #f4f4f5;
  background: #292a30;
}

input[type="range"] { width: 126px; accent-color: #9b87f5; }

.switch {
  position: relative;
  width: 38px;
  height: 22px;
  border: 0;
  border-radius: 999px;
  background: #3f3f46;
  cursor: pointer;
}
.switch::after {
  content: "";
  position: absolute;
  top: 3px;
  left: 3px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  transition: transform 150ms ease;
}
.switch[aria-checked="true"] { background: #816ee0; }
.switch[aria-checked="true"]::after { transform: translateX(16px); }

.actions { display: flex; flex-wrap: wrap; gap: 8px; }
.action {
  min-height: 34px;
  padding: 0 12px;
  border: 1px solid rgb(255 255 255 / .12);
  border-radius: 9px;
  color: #ececf0;
  background: #292a30;
  cursor: pointer;
}
.action:hover { background: #34353c; }
.action.danger { color: #fda4af; }
.action.primary { color: #fff; background: #6654c7; border-color: #7d69df; }
.action.primary:hover { background: #7562d5; }

.status {
  min-height: 18px;
  margin: 10px 0 0;
  color: #a7f3d0;
  font-size: 11px;
}
.status[data-error="true"] { color: #fda4af; }

.footer-note {
  margin: 16px 0 0;
  padding: 10px 11px;
  border-radius: 10px;
  color: #9ca3af;
  background: rgb(255 255 255 / .045);
  font-size: 11px;
}

@media (max-width: 520px) {
  .panel { top: 8px; right: 8px; bottom: 8px; width: calc(100vw - 16px); }
  .preset-grid { grid-template-columns: 1fr; }
  .launcher { top: auto; bottom: 88px; transform: none; }
}
`;

function createElement<K extends keyof HTMLElementTagNameMap>(
  name: K,
  className?: string,
): HTMLElementTagNameMap[K] {
  const element = document.createElement(name);
  if (className) {
    element.className = className;
  }
  return element;
}

export class ThemePanel {
  private backdrop: HTMLDivElement;
  private closeButton: HTMLButtonElement;
  private content: HTMLDivElement;
  private engine: ThemeEngine;
  private host: HTMLDivElement;
  private launcher: HTMLButtonElement;
  private open = false;
  private panel: HTMLElement;
  private shadow: ShadowRoot;
  private status: HTMLParagraphElement | null = null;
  private unsubscribe: (() => void) | null = null;

  constructor(engine: ThemeEngine) {
    this.engine = engine;
    this.host = createElement("div");
    this.host.id = HOST_ID;
    this.shadow = this.host.attachShadow({ mode: "open" });

    const style = createElement("style");
    style.textContent = PANEL_STYLE;
    this.shadow.append(style);

    this.launcher = createElement("button", "launcher");
    this.launcher.type = "button";
    this.launcher.title = "主题";
    this.launcher.setAttribute("aria-label", "打开主题设置");
    this.launcher.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3a9 9 0 0 0 0 18h1.15a2.35 2.35 0 0 0 0-4.7h-.7a1.4 1.4 0 0 1 0-2.8H15A6 6 0 0 0 15 3h-3Zm-4.5 7.2a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Zm3-3a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Zm-5.1 6.3a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Z"/></svg>';

    this.backdrop = createElement("div", "backdrop");
    this.backdrop.setAttribute("aria-hidden", "true");

    this.panel = createElement("section", "panel");
    this.panel.setAttribute("aria-label", "Codex Web 主题设置");

    const header = createElement("header", "header");
    const heading = createElement("div");
    const title = createElement("h2", "title");
    title.textContent = "主题";
    const subtitle = createElement("p", "subtitle");
    subtitle.textContent = "只改变外观，不参与 Codex 主流程";
    heading.append(title, subtitle);

    this.closeButton = createElement("button", "icon-button");
    this.closeButton.type = "button";
    this.closeButton.setAttribute("aria-label", "关闭主题设置");
    this.closeButton.textContent = "✕";
    header.append(heading, this.closeButton);

    this.content = createElement("div", "content");
    this.panel.append(header, this.content);
    this.shadow.append(this.launcher, this.backdrop, this.panel);
  }

  mount(): void {
    const existing = document.getElementById(HOST_ID);
    existing?.remove();
    document.body.append(this.host);
    this.launcher.addEventListener("click", this.handleOpen);
    this.closeButton.addEventListener("click", this.handleClose);
    this.backdrop.addEventListener("click", this.handleClose);
    window.addEventListener("keydown", this.handleKeydown);
    this.unsubscribe = this.engine.subscribe((settings) =>
      this.render(settings),
    );
    this.render(this.engine.getSettings());
  }

  destroy(): void {
    this.unsubscribe?.();
    this.unsubscribe = null;
    this.launcher.removeEventListener("click", this.handleOpen);
    this.closeButton.removeEventListener("click", this.handleClose);
    this.backdrop.removeEventListener("click", this.handleClose);
    window.removeEventListener("keydown", this.handleKeydown);
    this.host.remove();
  }

  private handleOpen = () => this.setOpen(true);
  private handleClose = () => this.setOpen(false);
  private handleKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && this.open) {
      this.setOpen(false);
    }
  };

  private setOpen(open: boolean): void {
    this.open = open;
    this.panel.dataset.open = String(open);
    this.backdrop.dataset.open = String(open);
    this.launcher.setAttribute("aria-expanded", String(open));
    if (open) {
      this.closeButton.focus();
    }
  }

  private render(settings: ThemeSettings): void {
    this.content.replaceChildren();

    const presetSection = this.createSection("主题方案");
    const grid = createElement("div", "preset-grid");
    for (const preset of THEME_PRESETS) {
      const button = createElement("button", "preset");
      button.type = "button";
      button.setAttribute(
        "aria-pressed",
        String(
          preset.id === "default"
            ? !settings.enabled
            : settings.enabled && settings.presetId === preset.id,
        ),
      );
      const preview = createElement("div", "preset-preview");
      preview.style.setProperty("--preview", preset.preview);
      const copy = createElement("span", "preset-copy");
      const name = createElement("span", "preset-name");
      name.textContent = preset.name;
      const description = createElement("span", "preset-description");
      description.textContent = preset.description;
      copy.append(name, description);
      button.append(preview, copy);
      button.addEventListener("click", () => {
        try {
          this.engine.selectPreset(preset.id);
          this.setStatus(
            preset.id === "default" ? "已恢复官方外观" : `已启用${preset.name}`,
          );
        } catch (error) {
          this.setStatus(this.errorMessage(error), true);
        }
      });
      grid.append(button);
    }
    presetSection.append(grid);

    const adjustmentSection = this.createSection("显示设置");
    adjustmentSection.append(
      this.createSwitchField(
        "启用主题",
        "关闭后不保留任何主题样式",
        settings.enabled,
        (enabled) => this.engine.setEnabled(enabled),
      ),
      this.createSelectField(
        "外观模式",
        "控制浏览器控件的明暗模式",
        settings.appearance,
        [
          ["auto", "自动"],
          ["dark", "深色"],
          ["light", "浅色"],
        ],
        (value) => this.engine.setAppearance(value as ThemeAppearance),
      ),
      this.createRangeField(
        "背景可见度",
        `${Math.round(settings.backgroundOpacity * 100)}%`,
        settings.backgroundOpacity,
        0.2,
        1,
        0.01,
        (value) => this.engine.setBackgroundOpacity(value),
      ),
      this.createRangeField(
        "背景模糊",
        `${Math.round(settings.backgroundBlur)}px`,
        settings.backgroundBlur,
        0,
        20,
        1,
        (value) => this.engine.setBackgroundBlur(value),
      ),
    );

    const backgroundSection = this.createSection("自定义背景");
    const actions = createElement("div", "actions");
    const input = createElement("input");
    input.type = "file";
    input.accept = "image/png,image/jpeg,image/webp";
    input.hidden = true;
    const choose = createElement("button", "action primary");
    choose.type = "button";
    choose.textContent = settings.customBackground ? "更换背景" : "选择背景图";
    choose.addEventListener("click", () => input.click());
    input.addEventListener("change", () => {
      const file = input.files?.[0];
      input.value = "";
      if (!file) {
        return;
      }
      this.setStatus("正在处理背景图片…");
      void this.engine
        .setCustomBackground(file)
        .then(() => this.setStatus("背景图片已保存在当前浏览器"))
        .catch((error) => this.setStatus(this.errorMessage(error), true));
    });
    actions.append(choose, input);
    if (settings.customBackground) {
      const remove = createElement("button", "action danger");
      remove.type = "button";
      remove.textContent = "移除背景";
      remove.addEventListener("click", () => {
        void this.engine
          .removeCustomBackground()
          .then(() => this.setStatus("已移除自定义背景"))
          .catch((error) => this.setStatus(this.errorMessage(error), true));
      });
      actions.append(remove);
    }
    backgroundSection.append(actions);

    const resetSection = this.createSection("恢复");
    const reset = createElement("button", "action danger");
    reset.type = "button";
    reset.textContent = "清除主题设置并恢复默认";
    reset.addEventListener("click", () => {
      try {
        this.engine.reset();
        this.setStatus("主题设置已清除");
      } catch (error) {
        this.setStatus(this.errorMessage(error), true);
      }
    });
    resetSection.append(reset);

    this.status = createElement("p", "status");
    this.status.setAttribute("aria-live", "polite");
    const note = createElement("p", "footer-note");
    note.textContent =
      "主题功能独立于 Codex 主流程。加载或存储失败时会自动回退官方外观，自定义图片仅保存在当前浏览器。";

    this.content.append(
      presetSection,
      adjustmentSection,
      backgroundSection,
      resetSection,
      this.status,
      note,
    );
  }

  private createSection(titleText: string): HTMLElement {
    const section = createElement("section", "section");
    const title = createElement("h3", "section-title");
    title.textContent = titleText;
    section.append(title);
    return section;
  }

  private createField(label: string, hint: string): HTMLDivElement {
    const field = createElement("div", "field");
    const copy = createElement("div", "field-copy");
    const labelElement = createElement("span");
    labelElement.textContent = label;
    const hintElement = createElement("span", "field-hint");
    hintElement.textContent = hint;
    copy.append(labelElement, hintElement);
    field.append(copy);
    return field;
  }

  private createSwitchField(
    label: string,
    hint: string,
    checked: boolean,
    onChange: (checked: boolean) => void,
  ): HTMLDivElement {
    const field = this.createField(label, hint);
    const button = createElement("button", "switch");
    button.type = "button";
    button.setAttribute("role", "switch");
    button.setAttribute("aria-label", label);
    button.setAttribute("aria-checked", String(checked));
    button.addEventListener("click", () => onChange(!checked));
    field.append(button);
    return field;
  }

  private createSelectField(
    label: string,
    hint: string,
    value: string,
    options: ReadonlyArray<readonly [string, string]>,
    onChange: (value: string) => void,
  ): HTMLDivElement {
    const field = this.createField(label, hint);
    const select = createElement("select");
    select.setAttribute("aria-label", label);
    for (const [optionValue, optionLabel] of options) {
      const option = createElement("option");
      option.value = optionValue;
      option.textContent = optionLabel;
      option.selected = optionValue === value;
      select.append(option);
    }
    select.addEventListener("change", () => onChange(select.value));
    field.append(select);
    return field;
  }

  private createRangeField(
    label: string,
    hint: string,
    value: number,
    min: number,
    max: number,
    step: number,
    onChange: (value: number) => void,
  ): HTMLDivElement {
    const field = this.createField(label, hint);
    const range = createElement("input");
    range.type = "range";
    range.setAttribute("aria-label", label);
    range.min = String(min);
    range.max = String(max);
    range.step = String(step);
    range.value = String(value);
    range.addEventListener("change", () => onChange(Number(range.value)));
    field.append(range);
    return field;
  }

  private setStatus(message: string, error = false): void {
    if (!this.status) {
      return;
    }
    this.status.textContent = message;
    this.status.dataset.error = String(error);
  }

  private errorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
  }
}
