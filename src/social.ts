import { getConfig, getHeaders } from './config';

export type SocialEventType =
  | 'new_content'
  | 'bot_spike'
  | 'trap_triggered'
  | 'canary_hit'
  | 'milestone';

export interface AutoPostPayload {
  eventType: SocialEventType;
  title: string;
  body: string;
  url?: string;
  metadata?: Record<string, unknown>;
}

/** Auto-post an event to the EchoAtlas Social feed */
export function autoPostEvent(payload: AutoPostPayload): void {
  const config = getConfig();
  fetch(`${config.apiUrl}/api/social/agent-post`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      source_site: config.siteId,
      event_type: payload.eventType,
      title: payload.title,
      body: payload.body,
      url: payload.url,
      metadata: payload.metadata,
    }),
  }).catch(() => {});
}
