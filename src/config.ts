export interface EchoAtlasConfig {
  /** EchoAtlas API base URL (default: https://echo-atlas.com) */
  apiUrl: string;
  /** API key for authenticated telemetry (optional, improves data attribution) */
  apiKey?: string;
  /** Unique identifier for this site (e.g. "my-blog", "shop-frontend") */
  siteId: string;
  /** Salt for SHA-256 IP hashing. Required for privacy-compliant IP tracking. */
  ipHashSalt?: string;
  /** Override default bot UA patterns (comma-separated or array) */
  botUaPatterns?: string[] | string;
  /** Override default trap phrases (comma-separated or array) */
  trapPhrases?: string[] | string;
}

let _config: EchoAtlasConfig | null = null;

/**
 * Initialize the SDK with your site's configuration.
 * Call this once at app startup (e.g. in your middleware or layout).
 */
export function init(config: Partial<EchoAtlasConfig> & { siteId: string }): void {
  _config = {
    apiUrl: config.apiUrl || process.env.ECHOATLAS_API_URL || 'https://echo-atlas.com',
    apiKey: config.apiKey || process.env.ECHOATLAS_API_KEY || undefined,
    siteId: config.siteId || process.env.ECHOATLAS_SITE_ID || 'unknown',
    ipHashSalt: config.ipHashSalt || process.env.IP_HASH_SALT || undefined,
    botUaPatterns: config.botUaPatterns || process.env.BOT_UA_PATTERNS || undefined,
    trapPhrases: config.trapPhrases || process.env.TRAP_PHRASES || undefined,
  };
}

/**
 * Auto-initialize from environment variables. No explicit init() call needed
 * if all config is in env vars.
 */
export function autoInit(): EchoAtlasConfig {
  if (!_config) {
    init({
      siteId: process.env.ECHOATLAS_SITE_ID || 'unknown',
    });
  }
  return _config!;
}

export function getConfig(): EchoAtlasConfig {
  return autoInit();
}

export function getHeaders(): Record<string, string> {
  const config = getConfig();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Source-Site': config.siteId,
  };
  if (config.apiKey) {
    headers['X-API-Key'] = config.apiKey;
  }
  return headers;
}
