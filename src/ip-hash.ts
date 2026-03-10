import { createHash } from 'crypto';
import { getConfig } from './config';

/**
 * Hash an IP address using SHA-256 with a server-side salt.
 * Never stores raw IPs -- privacy-compliant by design.
 *
 * Requires `ipHashSalt` in config or `IP_HASH_SALT` env var.
 */
export function hashIp(ip: string): string {
  const config = getConfig();
  const salt = config.ipHashSalt;
  if (!salt) {
    throw new Error(
      '@echoatlas/sdk: IP_HASH_SALT is required. Set it via init({ ipHashSalt }) or the IP_HASH_SALT env var.',
    );
  }
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex');
}

/**
 * Extract client IP from standard proxy headers.
 * Works with Vercel, Cloudflare, AWS ALB, and most reverse proxies.
 */
export function getClientIp(headers: {
  get(name: string): string | null;
}): string {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const realIp = headers.get('x-real-ip');
  if (realIp) return realIp;
  return 'unknown';
}
