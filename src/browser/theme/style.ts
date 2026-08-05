export const THEME_STYLE = `
:root[data-codex-web-theme] {
  color-scheme: var(--cw-color-scheme);
  --cw-background-image: none;
  --cw-background-opacity: .9;
  --cw-background-blur: 0px;
  --cw-panel-line: color-mix(in oklab, var(--cw-accent) 24%, transparent);
  --cw-panel-shadow: 0 18px 60px rgb(0 0 0 / .22);
  --color-token-application-menu-background: var(--cw-sidebar);
  --color-token-application-menu-foreground: var(--cw-text);
  --color-token-main-surface-primary: var(--cw-surface);
  --color-token-side-bar-background: var(--cw-sidebar);
}

:root[data-codex-web-theme="rose"] {
  --color-token-application-menu-background: var(--cw-sidebar);
  --color-token-application-menu-foreground: var(--cw-text);
  --color-token-badge-background: color-mix(in oklab, var(--cw-accent) 9%, transparent);
  --color-token-badge-foreground: var(--cw-text-muted);
  --color-token-border: color-mix(in oklab, var(--cw-accent) 20%, transparent);
  --color-token-border-default: color-mix(in oklab, var(--cw-accent) 20%, transparent);
  --color-token-border-heavy: color-mix(in oklab, var(--cw-accent) 32%, transparent);
  --color-token-border-light: color-mix(in oklab, var(--cw-accent) 11%, transparent);
  --color-token-button-border: color-mix(in oklab, var(--cw-accent) 25%, transparent);
  --color-token-button-secondary-hover-background: color-mix(in oklab, var(--cw-accent) 12%, transparent);
  --color-token-checkbox-background: color-mix(in oklab, var(--cw-surface) 88%, white);
  --color-token-checkbox-border: color-mix(in oklab, var(--cw-accent) 28%, transparent);
  --color-token-description-foreground: var(--cw-text-muted);
  --color-token-disabled-foreground: color-mix(in oklab, var(--cw-text-muted) 70%, transparent);
  --color-token-dropdown-background: color-mix(in oklab, var(--cw-surface) 94%, white);
  --color-token-dropdown-foreground: var(--cw-text);
  --color-token-editor-background: #fff9fb;
  --color-token-editor-foreground: var(--cw-text);
  --color-token-editor-widget-background: rgb(255 250 252 / .97);
  --color-token-foreground: var(--cw-text);
  --color-token-icon-foreground: var(--cw-text);
  --color-token-input-background: rgb(255 250 252 / .92);
  --color-token-input-border: color-mix(in oklab, var(--cw-accent) 28%, transparent);
  --color-token-input-foreground: var(--cw-text);
  --color-token-input-placeholder-foreground: var(--cw-text-muted);
  --color-token-list-active-selection-background: color-mix(in oklab, var(--cw-accent) 13%, transparent);
  --color-token-list-active-selection-foreground: var(--cw-text);
  --color-token-list-active-selection-icon-foreground: var(--cw-text);
  --color-token-list-hover-background: color-mix(in oklab, var(--cw-accent) 10%, transparent);
  --color-token-main-surface-primary: rgb(255 250 252 / .88);
  --color-token-menu-background: rgb(255 250 252 / .97);
  --color-token-menu-border: color-mix(in oklab, var(--cw-accent) 20%, transparent);
  --color-token-menubar-selection-background: color-mix(in oklab, var(--cw-accent) 9%, transparent);
  --color-token-menubar-selection-foreground: var(--cw-text);
  --color-token-scrollbar-slider-active-background: color-mix(in oklab, var(--cw-accent) 30%, transparent);
  --color-token-scrollbar-slider-background: color-mix(in oklab, var(--cw-accent) 14%, transparent);
  --color-token-scrollbar-slider-hover-background: color-mix(in oklab, var(--cw-accent) 24%, transparent);
  --color-token-side-bar-background: var(--cw-sidebar);
  --color-token-terminal-background: #fff9fb;
  --color-token-terminal-border: color-mix(in oklab, var(--cw-accent) 20%, transparent);
  --color-token-terminal-foreground: var(--cw-text);
  --color-token-text-code-block-background: color-mix(in oklab, var(--cw-accent) 7%, white);
  --color-token-text-link-active-foreground: color-mix(in oklab, var(--cw-accent) 82%, #7b2842);
  --color-token-text-link-foreground: color-mix(in oklab, var(--cw-accent) 82%, #7b2842);
  --color-token-text-preformat-background: color-mix(in oklab, var(--cw-accent) 7%, white);
  --color-token-text-preformat-foreground: var(--cw-text);
  --color-token-text-primary: var(--cw-text);
  --color-token-text-secondary: var(--cw-text-muted);
  --color-token-text-tertiary: color-mix(in oklab, var(--cw-text-muted) 82%, transparent);
  --color-token-toolbar-hover-background: color-mix(in oklab, var(--cw-accent) 10%, transparent);
}

:root[data-codex-web-theme-background="custom"] {
  --cw-custom-main-overlay: rgb(7 9 13 / .24);
  --cw-custom-sidebar-overlay: rgb(7 9 13 / .38);
  --cw-custom-header-overlay: rgb(7 9 13 / .62);
  --cw-custom-menubar-overlay: rgb(7 9 13 / .8);
  --color-token-application-menu-background: var(--cw-custom-menubar-overlay);
  --color-token-main-surface-primary: var(--cw-custom-main-overlay);
  --color-token-side-bar-background: var(--cw-custom-sidebar-overlay);
}

:root[data-codex-web-theme-background="custom"][data-codex-web-theme-appearance="light"] {
  --cw-custom-main-overlay: rgb(255 252 253 / .3);
  --cw-custom-sidebar-overlay: rgb(255 250 252 / .46);
  --cw-custom-header-overlay: rgb(255 252 253 / .7);
  --cw-custom-menubar-overlay: rgb(250 246 248 / .86);
}

:root[data-codex-web-theme] body {
  background: var(--cw-canvas) !important;
  color: var(--cw-text) !important;
}

:root[data-codex-web-theme] body::before {
  content: "";
  position: fixed;
  z-index: 0;
  inset: calc(var(--cw-background-blur) * -1);
  pointer-events: none;
  opacity: var(--cw-background-opacity);
  background-color: var(--cw-canvas);
  background-image: var(--cw-background-image),
    radial-gradient(circle at 78% 18%, color-mix(in oklab, var(--cw-accent) 42%, transparent), transparent 38%),
    linear-gradient(145deg, color-mix(in oklab, var(--cw-canvas) 82%, var(--cw-accent)), var(--cw-canvas));
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  filter: blur(var(--cw-background-blur));
  transform: scale(1.025);
}

:root[data-codex-web-theme-background="custom"] body::before {
  opacity: var(--cw-background-opacity);
}

:root[data-codex-web-theme] body > #root {
  position: relative;
  z-index: 1;
}

:root[data-codex-web-theme] aside.app-shell-left-panel {
  color: var(--cw-text) !important;
  background: var(--cw-sidebar) !important;
  border-color: var(--cw-panel-line) !important;
  box-shadow: inset -1px 0 var(--cw-panel-line) !important;
  backdrop-filter: blur(18px) saturate(1.08) !important;
}

:root[data-codex-web-theme-background="custom"] aside.app-shell-left-panel {
  background: var(--cw-custom-sidebar-overlay) !important;
  -webkit-backdrop-filter: none !important;
  backdrop-filter: none !important;
}

:root[data-codex-web-theme] aside.app-shell-left-panel nav {
  background: transparent !important;
}

:root[data-codex-web-theme] aside.app-shell-left-panel button {
  color: var(--cw-text) !important;
}

:root[data-codex-web-theme] aside.app-shell-left-panel button:hover,
:root[data-codex-web-theme] aside.app-shell-left-panel [aria-current="page"] {
  background: color-mix(in oklab, var(--cw-accent) 15%, transparent) !important;
}

:root[data-codex-web-theme] main.main-surface {
  color: var(--cw-text) !important;
  background: var(--cw-surface) !important;
  border-color: var(--cw-panel-line) !important;
  backdrop-filter: blur(15px) saturate(1.04) !important;
}

:root[data-codex-web-theme-background="custom"] main.main-surface {
  background: var(--cw-custom-main-overlay) !important;
  -webkit-backdrop-filter: none !important;
  backdrop-filter: none !important;
}

:root[data-codex-web-theme] main.main-surface > header.app-header-tint {
  color: var(--cw-text) !important;
  background: color-mix(in oklab, var(--cw-surface) 91%, transparent) !important;
  border-color: var(--cw-panel-line) !important;
  backdrop-filter: blur(18px) saturate(1.04) !important;
}

:root[data-codex-web-theme-background="custom"] main.main-surface > header.app-header-tint {
  background: var(--cw-custom-header-overlay) !important;
  -webkit-backdrop-filter: none !important;
  backdrop-filter: none !important;
}

:root[data-codex-web-theme] [class~="group/application-menu-top-bar"] {
  color: var(--cw-text) !important;
  background: color-mix(in oklab, var(--cw-sidebar) 91%, transparent) !important;
  border-color: var(--cw-panel-line) !important;
  backdrop-filter: blur(18px) !important;
}

:root[data-codex-web-theme-background="custom"] [class~="group/application-menu-top-bar"] {
  background: var(--cw-custom-menubar-overlay) !important;
  -webkit-backdrop-filter: none !important;
  backdrop-filter: none !important;
}

:root[data-codex-web-theme-background="custom"] [class~="bg-token-main-surface-primary"] {
  background-color: var(--cw-custom-main-overlay) !important;
  -webkit-backdrop-filter: none !important;
  backdrop-filter: none !important;
}

:root[data-codex-web-theme-background="custom"] [class~="bg-token-side-bar-background"] {
  background-color: var(--cw-custom-sidebar-overlay) !important;
  -webkit-backdrop-filter: none !important;
  backdrop-filter: none !important;
}

:root[data-codex-web-theme-background="custom"] [class~="bg-token-application-menu-background"] {
  background-color: var(--cw-custom-menubar-overlay) !important;
  -webkit-backdrop-filter: none !important;
  backdrop-filter: none !important;
}

:root[data-codex-web-theme] [class~="group/application-menu-top-bar"] button,
:root[data-codex-web-theme] [class~="group/application-menu-top-bar"] svg {
  color: var(--cw-text) !important;
}

:root[data-codex-web-theme] [class*="text-token-text-secondary"],
:root[data-codex-web-theme] [class*="text-token-text-tertiary"] {
  color: var(--cw-text-muted) !important;
}

:root[data-codex-web-theme] [class~="text-token-foreground"],
:root[data-codex-web-theme] [class~="text-token-text-primary"] {
  color: var(--cw-text) !important;
}

:root[data-codex-web-theme] [class~="text-token-description-foreground"],
:root[data-codex-web-theme] [class~="text-token-input-placeholder-foreground"],
:root[data-codex-web-theme] [class~="text-token-muted-foreground"] {
  color: var(--cw-text-muted) !important;
}

@media (max-width: 768px) {
  :root[data-codex-web-theme] main.main-surface {
    backdrop-filter: blur(10px) !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  #codex-web-theme-host *,
  #codex-web-theme-host *::before,
  #codex-web-theme-host *::after {
    scroll-behavior: auto !important;
    transition-duration: .01ms !important;
  }
}
`;
