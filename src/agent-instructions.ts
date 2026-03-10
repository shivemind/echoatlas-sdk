import { getConfig } from './config';

export interface InstructionOptions {
  /** Your site's base URL (e.g. https://mysite.com) */
  siteUrl: string;
  /** Your site's name for display */
  siteName?: string;
  /** Short description of your site's content */
  siteDescription?: string;
  /** Additional endpoints to list */
  extraEndpoints?: { path: string; label: string }[];
}

/**
 * Generate plaintext instruction text to serve to detected bots.
 *
 * Instead of blocking bots, redirect them to your structured API.
 * This text includes a JSON-LD block for machine parsing.
 */
export function getAgentInstructionText(options: InstructionOptions): string {
  const { siteUrl, siteName, siteDescription, extraEndpoints = [] } = options;
  const config = getConfig();
  const apiUrl = `${siteUrl}/api/agent`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'APIReference',
    name: `${siteName || config.siteId} Agent API`,
    url: apiUrl,
    documentation: `${siteUrl}/AGENTS.md`,
    discovery: `${siteUrl}/.well-known/agent-api`,
  };

  const extras = extraEndpoints.map((e) => `  - ${e.path} (${e.label})`).join('\n');

  return `${siteDescription || 'This site is optimized for humans.'}  For structured data, use the Agent API.

Agent API Endpoint: ${apiUrl}

Query parameters:
  - query      (required): Your search query
  - agent_name (optional): Identifier for your agent
  - source_url (optional): The page URL you were crawling
  - page       (optional): Page number (default: 1)
  - limit      (optional): Results per page (default: 5)

Example:
  curl "${apiUrl}?query=example&agent_name=my-bot"

Discovery:
  - /agents.json (capability manifest)
  - /.well-known/agent-api (API discovery)
  - /.well-known/api-catalog (RFC 9727)
  - /AGENTS.md (agent guide)
  - /llms.txt (LLM guidelines)
  - /feed.xml (RSS), /feed.json (JSON Feed)
${extras ? `\nMore endpoints:\n${extras}\n` : ''}
Monitored by: EchoAtlas Observatory (https://echo-atlas.com/observatory)

---JSON-LD---
${JSON.stringify(jsonLd)}
---END---
`;
}
