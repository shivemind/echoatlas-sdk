import { getConfig, getHeaders } from './config';

export interface AgentVisitPayload {
  path: string;
  userAgent?: string;
  referer?: string;
  ipHash?: string;
  botReason?: string;
  agentName?: string;
}

export interface TrapHitPayload {
  trapPhrase: string;
  query: string;
  agentName?: string;
  ipHash?: string;
  path?: string;
}

export interface CanaryHitPayload {
  token: string;
  ipHash?: string;
  userAgent?: string;
  referer?: string;
}

export interface HumanLandingPayload {
  path: string;
  referer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

function fireAndForget(endpoint: string, body: Record<string, unknown>): void {
  const config = getConfig();
  fetch(`${config.apiUrl}${endpoint}`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ ...body, source_site: config.siteId }),
  }).catch(() => {});
}

/** Report a detected bot/agent visit to EchoAtlas Observatory */
export function reportAgentVisit(payload: AgentVisitPayload): void {
  const config = getConfig();
  fireAndForget('/api/agent', {
    query: `[telemetry] agent visit on ${payload.path}`,
    agent_name: payload.agentName || payload.userAgent || 'unknown',
    source_url: `${config.apiUrl.replace('echo-atlas.com', '')}${payload.path}`,
    metadata: {
      type: 'agent_visit',
      bot_reason: payload.botReason,
      referer: payload.referer,
      ip_hash: payload.ipHash,
    },
  });
}

/** Report a trap phrase match to EchoAtlas Underground */
export function reportTrapHit(payload: TrapHitPayload): void {
  fireAndForget('/api/agent', {
    query: `[trap] ${payload.trapPhrase}`,
    agent_name: payload.agentName || 'unknown',
    source_url: payload.path,
    metadata: {
      type: 'trap_hit',
      trap_phrase: payload.trapPhrase,
      original_query: payload.query,
      ip_hash: payload.ipHash,
    },
  });
}

/** Report a canary token hit to EchoAtlas Underground */
export function reportCanaryHit(payload: CanaryHitPayload): void {
  fireAndForget('/api/agent', {
    query: `[canary] token=${payload.token}`,
    agent_name: payload.userAgent || 'unknown',
    source_url: `/c/${payload.token}`,
    metadata: {
      type: 'canary_hit',
      token: payload.token,
      referer: payload.referer,
      ip_hash: payload.ipHash,
    },
  });
}

/** Report a human landing with referrer/UTM data for AI-referrer tracking */
export function reportHumanLanding(payload: HumanLandingPayload): void {
  fireAndForget('/api/agent', {
    query: `[landing] ${payload.path}`,
    agent_name: 'human',
    source_url: payload.path,
    metadata: {
      type: 'human_landing',
      referer: payload.referer,
      utm_source: payload.utmSource,
      utm_medium: payload.utmMedium,
      utm_campaign: payload.utmCampaign,
    },
  });
}
