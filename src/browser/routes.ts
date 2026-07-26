const ROUTE_SEGMENTS = new Set(["share", "thread"]);

export function getBrowserBasePath(
  pathname = window.location.pathname,
): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) {
    return "";
  }

  const routeSegmentIndex = segments.findIndex((segment) =>
    ROUTE_SEGMENTS.has(segment),
  );
  if (routeSegmentIndex === 0) {
    return "";
  }

  if (routeSegmentIndex > 0) {
    return `/${segments.slice(0, routeSegmentIndex).join("/")}`;
  }

  return `/${segments.join("/")}`;
}

function stripBrowserBasePath(pathname: string): string {
  const basePath = getBrowserBasePath(pathname);
  if (!basePath) {
    return pathname;
  }

  if (pathname === basePath) {
    return "/";
  }

  if (pathname.startsWith(`${basePath}/`)) {
    return pathname.slice(basePath.length) || "/";
  }

  return pathname;
}

function withBrowserBasePath(pathname: string): string {
  const basePath = getBrowserBasePath();
  if (!basePath) {
    return pathname;
  }

  return pathname === "/" ? basePath : `${basePath}${pathname}`;
}

export function mapBrowserPathToInitialRoute(pathname: string, search: string) {
  const routePathname = stripBrowserBasePath(pathname);

  if (routePathname === "/share/receive" && search) {
    const params = new URLSearchParams(search);

    const prompt = ["title", "text", "url"]
      .flatMap((name) => {
        const value = params.get(name);
        return value === null ? [] : [`${name}: ${value}`];
      })
      .join("\n");

    return {
      memoryPath: prompt
        ? `/?${new URLSearchParams({ prompt }).toString()}`
        : "/",
      browserPath: withBrowserBasePath("/"),
    };
  }

  return {
    memoryPath: mapBrowserPathToRoute(routePathname),
  };
}

function mapBrowserPathToRoute(pathname: string): string {
  const match = pathname.match(/^\/thread\/([^/]+)$/);
  if (match) {
    try {
      return `/local/${decodeURIComponent(match[1])}`;
    } catch {
      return "/";
    }
  }

  return "/";
}

export function mapMemoryPathToBrowserPath(pathname: string) {
  if (pathname === "/") {
    return { path: withBrowserBasePath("/"), titleChange: "Codex" };
  }

  const match = pathname.match(/^\/local\/([^/?#]+)$/);
  if (!match) {
    return null;
  }

  return {
    path: withBrowserBasePath(`/thread/${encodeURIComponent(match[1])}`),
  };
}

export function dispatchNavigateToRoute(path: string): void {
  window.dispatchEvent(
    new MessageEvent("message", {
      data: {
        type: "navigate-to-route",
        path,
      },
    }),
  );
}

window.addEventListener("popstate", () => {
  dispatchNavigateToRoute(
    mapBrowserPathToRoute(stripBrowserBasePath(window.location.pathname)),
  );
});
