/**
 * Edge-runtime-safe exports.
 *
 * Next.js middleware runs on the Edge runtime which doesn't support
 * Node.js built-ins like `crypto`. This module re-exports only the
 * functions that are safe to use in Edge/middleware contexts.
 *
 * For ip-hash (which needs Node crypto), use the main import in
 * server-side API routes instead.
 */

export { detectBot, getBotPatterns } from './bot-detection';
export type { BotDetectionInput, BotDetectionResult } from './bot-detection';
export { reportAgentVisit, reportTrapHit, reportCanaryHit, reportHumanLanding } from './telemetry';
export type { AgentVisitPayload, TrapHitPayload, CanaryHitPayload, HumanLandingPayload } from './telemetry';
export { autoPostEvent } from './social';
export type { SocialEventType, AutoPostPayload } from './social';
export { matchesTrapPhrase, getTrapPhrases } from './trap-phrases';
export { getAgentInstructionText } from './agent-instructions';
export type { InstructionOptions } from './agent-instructions';
export { init, getConfig, getHeaders } from './config';
export type { EchoAtlasConfig } from './config';
