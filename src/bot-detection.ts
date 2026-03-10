import { getConfig } from './config';

const DEFAULT_AI_AGENT_UA_PATTERNS = [
  'GPTBot', 'ChatGPT-User', 'CCBot', 'Claude-Web', 'ClaudeBot',
  'Anthropic-AI', 'Google-Extended', 'PerplexityBot', 'Amazonbot',
  'Cohere-AI', 'Bytespider', 'Bingbot', 'facebookexternalhit',
  'Twitterbot', 'LinkedInBot', 'Slackbot', 'Discordbot', 'YouBot',
  'Applebot', 'PetalBot', 'DataForSeoBot', 'SemrushBot', 'AhrefsBot',
  'MJ12bot', 'DotBot', 'Omgilibot', 'YandexBot', 'Seekport',
  'Meta-ExternalAgent', 'Scraper', 'scraper', 'fetcher', 'Fetcher',
  'HeadlessChrome', 'PhantomJS', 'Selenium', 'Puppeteer', 'Playwright',
  'Crawler', 'crawl', 'Spider', 'spider', 'Bot/', 'bot/', 'Agent', 'agent',
];

const DEFAULT_AUTOMATION_UA_PATTERNS = [
  'curl', 'wget', 'python-requests', 'python-urllib', 'go-http-client',
  'Java/', 'okhttp', 'axios', 'node-fetch', 'fetch', 'HTTPie',
  'Insomnia', 'PostmanRuntime',
];

function getPatterns(): string[] {
  try {
    const config = getConfig();
    const raw = config.botUaPatterns;
    if (raw) {
      if (Array.isArray(raw)) return raw;
      return raw.split(',').map((p) => p.trim()).filter(Boolean);
    }
  } catch { /* config not initialized yet */ }
  return [...DEFAULT_AI_AGENT_UA_PATTERNS, ...DEFAULT_AUTOMATION_UA_PATTERNS];
}

export interface BotDetectionInput {
  userAgent: string | null;
  acceptLanguage: string | null;
  method: string;
  hasCookies: boolean;
  referer: string | null;
  accept: string | null;
  /** Set to 'agent' by polite bots via X-Bot-Intent header */
  xBotIntent?: string | null;
}

export interface BotDetectionResult {
  isBot: boolean;
  /** Why the request was classified as a bot */
  reason?: string;
}

function matchesAgentUa(ua: string): boolean {
  const lower = ua.toLowerCase();
  return getPatterns().some((p) => lower.includes(p.toLowerCase()));
}

/**
 * Detect whether an incoming request is from a bot/agent.
 *
 * Uses a multi-signal approach:
 * 1. User-Agent pattern matching (60+ known AI crawlers + automation tools)
 * 2. Behavioral heuristics (missing UA, HEAD/OPTIONS probing, missing Accept-Language)
 * 3. Self-identification via X-Bot-Intent: agent header
 */
export function detectBot(input: BotDetectionInput): BotDetectionResult {
  const ua = input.userAgent ?? '';

  if (!ua || ua.trim().length === 0) {
    return { isBot: true, reason: 'missing_user_agent' };
  }

  if (matchesAgentUa(ua)) {
    return { isBot: true, reason: 'user_agent_match' };
  }

  if (['HEAD', 'OPTIONS'].includes(input.method) && ua.length < 50) {
    return { isBot: true, reason: 'probing_request' };
  }

  if (!input.acceptLanguage || input.acceptLanguage.trim().length === 0) {
    if (ua.length < 80 || ua.includes('http') || ua.includes('HTTP')) {
      return { isBot: true, reason: 'missing_accept_language' };
    }
  }

  if (input.xBotIntent?.trim().toLowerCase() === 'agent') {
    return { isBot: true, reason: 'x_bot_intent' };
  }

  return { isBot: false };
}

/** Get the full list of bot UA patterns currently in use */
export function getBotPatterns(): string[] {
  return getPatterns();
}
