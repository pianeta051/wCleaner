export type Tokens = {
  idToken: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
};

export type Challenge = {
  session: string;
  username: string;
};

export type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

const TOKENS_KEY = "wcleaner.auth";
const CHALLENGE_KEY = "wcleaner.auth.challenge";

const readJson = (storage: StorageLike, key: string): unknown => {
  try {
    const raw = storage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const isTokens = (value: unknown): value is Tokens => {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const v = value as Record<string, unknown>;
  return (
    typeof v.idToken === "string" &&
    typeof v.accessToken === "string" &&
    typeof v.refreshToken === "string" &&
    typeof v.expiresAt === "number"
  );
};

const isChallenge = (value: unknown): value is Challenge => {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const v = value as Record<string, unknown>;
  return typeof v.session === "string" && typeof v.username === "string";
};

// Tokens live in `persistent` (localStorage) so the session survives reloads
// and tabs; the pending challenge lives in `session` (sessionStorage).
export const createTokenStore = ({
  persistent,
  session,
}: {
  persistent: StorageLike;
  session: StorageLike;
}) => ({
  getTokens(): Tokens | null {
    const value = readJson(persistent, TOKENS_KEY);
    return isTokens(value) ? value : null;
  },
  setTokens(tokens: Tokens): void {
    persistent.setItem(TOKENS_KEY, JSON.stringify(tokens));
  },
  clearTokens(): void {
    try {
      persistent.removeItem(TOKENS_KEY);
    } catch {
      // Nothing else we can do if storage is unavailable.
    }
  },
  getChallenge(): Challenge | null {
    const value = readJson(session, CHALLENGE_KEY);
    return isChallenge(value) ? value : null;
  },
  setChallenge(challenge: Challenge): void {
    session.setItem(CHALLENGE_KEY, JSON.stringify(challenge));
  },
  clearChallenge(): void {
    try {
      session.removeItem(CHALLENGE_KEY);
    } catch {
      // Nothing else we can do if storage is unavailable.
    }
  },
});

export type TokenStore = ReturnType<typeof createTokenStore>;
