const originOf = (url: string): string | null => {
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
};

export const resolveRedirectTo = (
  requested: string | undefined,
  appUrl: string,
  allowedOrigins: string[]
): string => {
  const fallback = appUrl.replace(/\/+$/, "");
  if (requested === undefined) {
    return fallback;
  }
  const origin = originOf(requested);
  const allowed = new Set(
    [appUrl, ...allowedOrigins].map(originOf).filter((o) => o !== null)
  );
  if (origin !== null && allowed.has(origin)) {
    return origin;
  }
  console.warn(
    `Ignoring redirectTo ${JSON.stringify(requested)}: origin not allowed`
  );
  return fallback;
};
