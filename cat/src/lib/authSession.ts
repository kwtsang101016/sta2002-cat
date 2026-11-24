const STORAGE_KEY = "sta2002-cat-auth-v2";
const LEGACY_STORAGE_KEY = "sta2002-cat-auth-v1";

/** How long a remembered PIN / student ID is reused after it was last entered. */
export const AUTH_TTL_MS = 4 * 60 * 60 * 1000;

export interface AuthSession {
  instructorSecret?: string;
  /** personId -> student ID (or credential) entered by the user */
  secrets: Record<string, string>;
}

interface StoredAuthSession extends AuthSession {
  /** Epoch ms after which the remembered credentials are discarded. */
  expiresAt: number;
}

function emptySession(): AuthSession {
  return { secrets: {} };
}

function readStored(): StoredAuthSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as Partial<StoredAuthSession>;
    if (typeof parsed.expiresAt !== "number" || parsed.expiresAt <= Date.now()) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return {
      instructorSecret: typeof parsed.instructorSecret === "string" ? parsed.instructorSecret : undefined,
      secrets: parsed.secrets && typeof parsed.secrets === "object" ? parsed.secrets : {},
      expiresAt: parsed.expiresAt,
    };
  } catch {
    return null;
  }
}

function removeLegacy(): void {
  try {
    sessionStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    // sessionStorage may be unavailable (private mode); nothing to clean up.
  }
}

export function loadAuthSession(): AuthSession {
  const stored = readStored();
  if (!stored) {
    return emptySession();
  }
  return { instructorSecret: stored.instructorSecret, secrets: stored.secrets };
}

/** Persists the session and restarts the 4-hour window. */
export function saveAuthSession(session: AuthSession): void {
  removeLegacy();
  try {
    const stored: StoredAuthSession = { ...session, expiresAt: Date.now() + AUTH_TTL_MS };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // Storage full or blocked: the login still works for this page load.
  }
}

export function rememberPersonSecret(personId: string, secret: string): AuthSession {
  const session = loadAuthSession();
  session.secrets[personId] = secret;
  saveAuthSession(session);
  return session;
}

export function rememberInstructorSecret(secret: string): AuthSession {
  const session = loadAuthSession();
  session.instructorSecret = secret;
  saveAuthSession(session);
  return session;
}

export function clearAuthSession(): void {
  removeLegacy();
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to clear if storage is unavailable.
  }
}
